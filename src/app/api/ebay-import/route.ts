import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url || !url.includes("ebay.com")) {
      return NextResponse.json({ error: "Invalid eBay URL" }, { status: 400 });
    }

    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch eBay listing" }, { status: 502 });
    }

    const html = await response.text();

    // Detect eBay captcha/block pages
    if (
      html.includes("Pardon Our Interruption") ||
      html.includes("pardon our interruption") ||
      html.includes("verify yourself") ||
      html.includes("captcha") ||
      !html.includes("ebay")
    ) {
      return NextResponse.json(
        { error: "eBay is blocking this request. Please try again in a few minutes." },
        { status: 503 }
      );
    }

    const $ = cheerio.load(html);

    // --- Extract raw data from multiple sources ---

    let rawTitle = "";
    let rawDescription = "";
    let price: number | null = null;
    let priceCurrency = "USD";
    let imageUrls: string[] = [];

    // 1. JSON-LD structured data (most reliable for price & images)
    const jsonLdScripts = $('script[type="application/ld+json"]');
    jsonLdScripts.each((_, el) => {
      try {
        const jsonLd = JSON.parse($(el).html() || "");
        const product = Array.isArray(jsonLd)
          ? jsonLd.find((item: any) => item["@type"] === "Product")
          : jsonLd["@type"] === "Product" ? jsonLd : null;

        if (product) {
          if (product.name) rawTitle = product.name;
          if (product.description) rawDescription = product.description;
          if (product.offers) {
            const offer = Array.isArray(product.offers) ? product.offers[0] : product.offers;
            if (offer?.price) price = parseFloat(offer.price);
            if (offer?.priceCurrency) priceCurrency = offer.priceCurrency;
          }
          if (product.image) {
            const imgs = Array.isArray(product.image) ? product.image : [product.image];
            imageUrls.push(...imgs);
          }
        }
      } catch {
        // skip invalid JSON-LD blocks
      }
    });

    // 2. HTML title element (often has the real listing title)
    if (!rawTitle) {
      rawTitle = $("h1.x-item-title__mainTitle span").text().trim()
        || $('meta[property="og:title"]').attr("content")
        || $("title").text()
        || "";
    }

    // 3. Price from HTML if not in JSON-LD
    if (price === null) {
      const priceText = $('[data-testid="x-price-primary"] span').first().text()
        || $(".x-price-primary").first().text()
        || "";
      const priceMatch = priceText.match(/[\d,]+\.?\d*/);
      if (priceMatch) price = parseFloat(priceMatch[0].replace(/,/g, ""));
    }

    // 4. Item specifics from the listing page (most valuable data source)
    const specifics: Record<string, string> = {};
    $(".ux-labels-values").each((_, row) => {
      const label = $(row).find(".ux-labels-values__labels").text().trim().replace(/:$/, "");
      const value = $(row).find(".ux-labels-values__values").text().trim();
      if (label && value) specifics[label] = value;
    });
    // Also try the col-based layout
    $(".ux-layout-section-evo__row").each((_, row) => {
      const cols = $(row).find(".ux-layout-section-evo__col");
      if (cols.length >= 2) {
        for (let i = 0; i < cols.length - 1; i += 2) {
          const label = $(cols[i]).text().trim();
          const value = $(cols[i + 1]).text().trim();
          if (label && value && !label.includes("Shipping") && !label.includes("Delivery")) {
            specifics[label] = value;
          }
        }
      }
    });

    // 5. Images from HTML carousel (backup)
    if (imageUrls.length === 0) {
      $("img").each((_, el) => {
        const src = $(el).attr("src") || "";
        if (src.includes("ebayimg.com/images/g/") && src.includes("s-l")) {
          imageUrls.push(src);
        }
      });
    }

    // --- Clean up and enrich the data ---

    // Clean title: remove eBay artifacts
    let title = rawTitle
      .replace(/<[^>]*>/g, "")                  // strip HTML tags like <wbr/>
      .replace(/\s*\|\s*eBay$/i, "")          // remove "| eBay" suffix
      .replace(/➖/g, " - ")                    // replace ➖ with dash
      .replace(/\s*-\s*$/, "")                  // remove trailing dash
      .replace(/\s{2,}/g, " ")                  // collapse multiple spaces
      .trim();

    // Clean description: if it's eBay's generic meta description, discard it
    let description = rawDescription;
    if (
      description.toLowerCase().includes("find many great new & used options") ||
      description.toLowerCase().includes("best deals for") ||
      description.toLowerCase().includes("free shipping for many products") ||
      description.length < 30
    ) {
      // Build a better description from the title and specifics
      description = "";
    }

    // --- Extract structured fields ---

    // Country
    let country = specifics["Country"] || specifics["Country/Region of Manufacture"] || "";
    if (!country) {
      const countries = [
        "Saudi Arabia", "Palestine", "Jordan", "Iraq", "Afghanistan",
        "Libya", "Turkey", "Ottoman", "Egypt", "Syria", "Lebanon",
        "Kuwait", "Bahrain", "Qatar", "UAE", "Oman", "Yemen",
        "Pakistan", "India"
      ];
      for (const c of countries) {
        if (title.toLowerCase().includes(c.toLowerCase())) {
          country = c === "Ottoman" ? "Turkey / Ottoman" : c;
          break;
        }
      }
    }

    // Year
    let year: number | null = null;
    const yearSpecific = specifics["Year"] || specifics["Date"];
    if (yearSpecific) {
      const ym = yearSpecific.match(/\b(1[789]\d{2}|20[0-2]\d)\b/);
      if (ym) year = parseInt(ym[1]);
    }
    if (!year) {
      const ym = title.match(/\b(1[789]\d{2}|20[0-2]\d)\b/);
      if (ym) year = parseInt(ym[1]);
    }

    // Grading company & grade
    let gradingCompany = specifics["Certification"] || "";
    let grade = specifics["Grade"] || "";

    // Also try extracting from title: "PMG 58", "64 PMG", "NGC 65 EPQ"
    if (!gradingCompany || !grade) {
      const patterns = [
        /(?:PMG|NGC|PCGS)\s+(\d+\s*(?:EPQ|Choice|Gem|Superb)?[^,|\-]*)/i,
        /(\d+)\s*(?:EPQ\s*)?(?:PMG|NGC|PCGS)/i,
      ];
      for (const pat of patterns) {
        const m = title.match(pat);
        if (m) {
          const companyMatch = title.match(/(PMG|NGC|PCGS)/i);
          if (companyMatch) gradingCompany = companyMatch[1].toUpperCase();
          // Extract just the grade number and qualifier
          const gradeMatch = title.match(/(?:PMG|NGC|PCGS)\s*(\d+)/i) || title.match(/(\d+)\s*(?:EPQ\s*)?(?:PMG|NGC|PCGS)/i);
          if (gradeMatch && !grade) grade = gradeMatch[1];
          break;
        }
      }
    }

    // Add EPQ to grade if present in title
    if (grade && !grade.includes("EPQ") && /EPQ/i.test(title)) {
      grade += " EPQ";
    }

    // Add grade description from PMG label if extractable
    const gradeNum = parseInt(grade);
    if (gradeNum && !grade.includes(" ")) {
      const gradeDescriptions: Record<number, string> = {
        70: "Superb Gem Unc", 69: "Superb Gem Unc", 68: "Superb Gem Unc",
        67: "Superb Gem Unc", 66: "Gem Unc", 65: "Gem Unc",
        64: "Choice Unc", 63: "Choice Unc",
        62: "Unc", 61: "Unc", 60: "Unc",
        58: "Choice About Unc", 55: "About Unc", 53: "About Unc",
        50: "About Unc",
        45: "Choice Extremely Fine", 40: "Extremely Fine",
        35: "Choice Very Fine", 30: "Very Fine",
        25: "Very Fine", 20: "Very Fine",
        15: "Choice Fine", 12: "Fine",
        10: "Very Good", 8: "Very Good",
        6: "Good", 4: "Good",
      };
      // Find closest grade description
      const closestGrade = Object.keys(gradeDescriptions)
        .map(Number)
        .sort((a, b) => Math.abs(a - gradeNum) - Math.abs(b - gradeNum))[0];
      if (closestGrade !== undefined) {
        grade = `${gradeNum} ${gradeDescriptions[closestGrade]}`;
      }
    }

    // Condition mapping based on grade number
    let condition = "";
    if (gradeNum) {
      if (gradeNum >= 60) condition = "UNC";
      else if (gradeNum >= 50) condition = "AU";
      else if (gradeNum >= 40) condition = "XF";
      else if (gradeNum >= 25) condition = "VF";
      else if (gradeNum >= 12) condition = "F";
      else if (gradeNum >= 8) condition = "VG";
      else if (gradeNum >= 4) condition = "G";
      else condition = "PR";
    }

    // Denomination: extract from title (e.g., "10 Riyals", "5 Pounds", "1 Dinar")
    let denomination = "";
    const denomMatch = title.match(/(\d+(?:\.\d+)?)\s*(Riyals?|Riyal|Pounds?|Dinars?|Lira|Piastres?|Fils|Rupees?|Ghirsh|Kurush)/i);
    if (denomMatch) {
      denomination = `${denomMatch[1]} ${denomMatch[2]}`;
    }

    // Currency from denomination
    let currency = "";
    if (/riyal/i.test(denomination)) currency = "Saudi Riyal";
    else if (/pound/i.test(denomination)) currency = "Pound";
    else if (/dinar/i.test(denomination)) currency = "Dinar";
    else if (/lira/i.test(denomination)) currency = "Lira";
    else if (/rupee/i.test(denomination)) currency = "Rupee";

    // Certification/serial number from PMG label in title or specifics
    let certificationNumber = specifics["Certification Number"] || specifics["Serial Number"] || "";
    // Try extracting S/N from title: "S/N H/735559" or "SN 25/492944"
    if (!certificationNumber) {
      const snMatch = title.match(/S\/?N\s*([A-Z0-9/]+)/i);
      if (snMatch) certificationNumber = snMatch[1];
    }

    // Extract eBay item ID from URL
    const itemIdMatch = url.match(/itm\/(\d+)/);
    const ebayItemId = itemIdMatch ? itemIdMatch[1] : "";

    // Build a proper description if we don't have one
    if (!description) {
      const parts: string[] = [];
      if (country) parts.push(`${country} ${denomination || "banknote"}`);
      else parts.push(denomination || "Banknote");
      if (year) parts.push(`(${year})`);
      if (gradingCompany && grade) parts.push(`Graded ${gradingCompany} ${grade}.`);
      if (certificationNumber) parts.push(`Serial Number: ${certificationNumber}.`);
      description = parts.join(" ").trim();
    }

    // Upgrade image URLs to highest resolution and deduplicate
    const seen = new Set<string>();
    const highResUrls: string[] = [];
    for (const u of imageUrls) {
      const high = u.replace(/s-l\d+/, "s-l1600").replace(".webp", ".jpg");
      // Extract the unique image hash (e.g., "DWwAAeSwfJZpuZaR")
      const hashMatch = high.match(/images\/g\/([^/]+)\//);
      const key = hashMatch ? hashMatch[1] : high;
      if (!seen.has(key)) {
        seen.add(key);
        highResUrls.push(high);
      }
    }

    return NextResponse.json({
      title_en: title,
      description_en: description,
      price,
      price_currency: priceCurrency,
      country,
      year,
      denomination,
      currency,
      grading_company: gradingCompany,
      grade,
      certification_number: certificationNumber,
      condition,
      ebay_url: url,
      ebay_item_id: ebayItemId,
      imageUrls: highResUrls.slice(0, 10),
      type: "banknote",
    });
  } catch (error) {
    return NextResponse.json({ error: "Import failed" }, { status: 500 });
  }
}
