import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import * as cheerio from "cheerio";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
    .substring(0, 80);
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url || !url.includes("ebay.com")) {
      return NextResponse.json({ error: "Invalid eBay URL" }, { status: 400 });
    }

    // --- Step 1: Fetch the eBay listing page ---
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
    const $ = cheerio.load(html);

    // --- Step 2: Extract data ---
    let rawTitle = "";
    let rawDescription = "";
    let price: number | null = null;
    let priceCurrency = "USD";
    let imageUrls: string[] = [];

    // JSON-LD
    $('script[type="application/ld+json"]').each((_, el) => {
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
      } catch { /* skip */ }
    });

    if (!rawTitle) {
      rawTitle = $("h1.x-item-title__mainTitle span").text().trim()
        || $('meta[property="og:title"]').attr("content")
        || $("title").text()
        || "";
    }

    if (price === null) {
      const priceText = $('[data-testid="x-price-primary"] span').first().text()
        || $(".x-price-primary").first().text() || "";
      const priceMatch = priceText.match(/[\d,]+\.?\d*/);
      if (priceMatch) price = parseFloat(priceMatch[0].replace(/,/g, ""));
    }

    // Item specifics
    const specifics: Record<string, string> = {};
    $(".ux-labels-values").each((_, row) => {
      const label = $(row).find(".ux-labels-values__labels").text().trim().replace(/:$/, "");
      const value = $(row).find(".ux-labels-values__values").text().trim();
      if (label && value) specifics[label] = value;
    });

    if (imageUrls.length === 0) {
      $("img").each((_, el) => {
        const src = $(el).attr("src") || "";
        if (src.includes("ebayimg.com/images/g/") && src.includes("s-l")) {
          imageUrls.push(src);
        }
      });
    }

    // --- Step 3: Clean and enrich data ---

    // Clean title
    let title = rawTitle
      .replace(/<[^>]*>/g, "")                  // strip HTML tags like <wbr/>
      .replace(/\s*\|\s*eBay$/i, "")
      .replace(/➖/g, " - ")
      .replace(/\s*-\s*$/, "")
      .replace(/\s{2,}/g, " ")
      .trim();

    // Clean description
    let description = rawDescription;
    if (
      description.toLowerCase().includes("find many great new & used options") ||
      description.toLowerCase().includes("best deals for") ||
      description.toLowerCase().includes("free shipping for many products") ||
      description.length < 30
    ) {
      description = "";
    }

    // Country
    let country = specifics["Country"] || specifics["Country/Region of Manufacture"] || "";
    if (!country) {
      const countries = [
        "Saudi Arabia", "Palestine", "Jordan", "Iraq", "Afghanistan",
        "Libya", "Turkey", "Ottoman", "Egypt", "Syria", "Lebanon",
        "Kuwait", "Bahrain", "Qatar", "UAE", "Oman", "Yemen", "Pakistan", "India"
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

    // Grading
    let gradingCompany = specifics["Certification"] || "";
    let grade = specifics["Grade"] || "";
    if (!gradingCompany || !grade) {
      const companyMatch = title.match(/(PMG|NGC|PCGS)/i);
      if (companyMatch) gradingCompany = companyMatch[1].toUpperCase();
      const gradeMatch = title.match(/(?:PMG|NGC|PCGS)\s*(\d+)/i) || title.match(/(\d+)\s*(?:EPQ\s*)?(?:PMG|NGC|PCGS)/i);
      if (gradeMatch && !grade) grade = gradeMatch[1];
    }
    if (grade && !grade.includes("EPQ") && /EPQ/i.test(title)) grade += " EPQ";

    const gradeNum = parseInt(grade);
    if (gradeNum && !/[a-zA-Z]/.test(grade.replace(/EPQ/i, "").trim())) {
      const descriptions: Record<number, string> = {
        70: "Superb Gem Unc", 69: "Superb Gem Unc", 68: "Superb Gem Unc",
        67: "Superb Gem Unc", 66: "Gem Unc", 65: "Gem Unc",
        64: "Choice Unc", 63: "Choice Unc", 62: "Unc", 61: "Unc", 60: "Unc",
        58: "Choice About Unc", 55: "About Unc", 53: "About Unc", 50: "About Unc",
        45: "Choice XF", 40: "XF", 35: "Choice VF", 30: "VF", 25: "VF", 20: "VF",
        15: "Choice Fine", 12: "Fine", 10: "VG", 8: "VG", 6: "Good", 4: "Good",
      };
      const closest = Object.keys(descriptions).map(Number)
        .sort((a, b) => Math.abs(a - gradeNum) - Math.abs(b - gradeNum))[0];
      if (closest !== undefined) {
        const epq = grade.includes("EPQ") ? " EPQ" : "";
        grade = `${gradeNum} ${descriptions[closest]}${epq}`;
      }
    }

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

    // Denomination
    let denomination = "";
    const denomMatch = title.match(/(\d+(?:\.\d+)?)\s*(Riyals?|Riyal|Pounds?|Dinars?|Lira|Piastres?|Fils|Rupees?|Ghirsh|Kurush)/i);
    if (denomMatch) denomination = `${denomMatch[1]} ${denomMatch[2]}`;

    let currency = "";
    if (/riyal/i.test(denomination)) currency = "Saudi Riyal";
    else if (/pound/i.test(denomination)) currency = "Pound";
    else if (/dinar/i.test(denomination)) currency = "Dinar";
    else if (/kurush/i.test(denomination)) currency = "Kurush";
    else if (/lira/i.test(denomination)) currency = "Lira";
    else if (/rupee/i.test(denomination)) currency = "Rupee";

    // Certification number
    let certificationNumber = specifics["Certification Number"] || specifics["Serial Number"] || "";
    if (!certificationNumber) {
      const snMatch = title.match(/S\/?N\s*([A-Z0-9/]+)/i);
      if (snMatch) certificationNumber = snMatch[1];
    }

    const itemIdMatch = url.match(/itm\/(\d+)/);
    const ebayItemId = itemIdMatch ? itemIdMatch[1] : "";

    if (!description) {
      const parts: string[] = [];
      if (country) parts.push(`${country} ${denomination || "banknote"}`);
      if (year) parts.push(`(${year})`);
      if (gradingCompany && grade) parts.push(`Graded ${gradingCompany} ${grade}.`);
      if (certificationNumber) parts.push(`Serial Number: ${certificationNumber}.`);
      description = parts.join(" ").trim();
    }

    // Deduplicate and upgrade image URLs
    const seen = new Set<string>();
    const highResUrls: string[] = [];
    for (const u of imageUrls) {
      const high = u.replace(/s-l\d+/, "s-l1600").replace(".webp", ".jpg");
      const hashMatch = high.match(/images\/g\/([^/]+)\//);
      const key = hashMatch ? hashMatch[1] : high;
      if (!seen.has(key)) {
        seen.add(key);
        highResUrls.push(high);
      }
    }

    // --- Step 4: Create item in database ---
    const slug = slugify(title);

    const { data: itemData, error: itemError } = await supabaseAdmin
      .from("items")
      .insert({
        title_en: title,
        description_en: description || null,
        type: "banknote",
        country: country || null,
        year,
        denomination: denomination || null,
        currency: currency || null,
        condition: condition || null,
        grading_company: gradingCompany || null,
        grade: grade || null,
        certification_number: certificationNumber || null,
        price,
        price_currency: priceCurrency,
        status: "available",
        featured: false,
        visible: true,
        ebay_url: url,
        ebay_item_id: ebayItemId || null,
        slug,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (itemError) {
      return NextResponse.json({ error: itemError.message }, { status: 500 });
    }

    const createdItemId = itemData.id;

    // --- Step 5: Download and upload images ---
    let uploadedCount = 0;
    const imageSlice = highResUrls.slice(0, 10);

    for (let i = 0; i < imageSlice.length; i++) {
      try {
        const imgResponse = await fetch(imageSlice[i], {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          },
        });

        if (!imgResponse.ok) continue;

        const contentType = imgResponse.headers.get("content-type") || "image/jpeg";
        const ext = contentType.includes("png") ? "png" : contentType.includes("webp") ? "webp" : "jpg";
        const buffer = await imgResponse.arrayBuffer();
        const path = `${createdItemId}/${Date.now()}-${i}.${ext}`;

        const { error: uploadError } = await supabaseAdmin.storage
          .from("item-images")
          .upload(path, Buffer.from(buffer), {
            contentType,
            cacheControl: "3600",
            upsert: false,
          });

        if (!uploadError) {
          await supabaseAdmin.from("item_images").insert({
            item_id: createdItemId,
            storage_path: path,
            is_primary: i === 0,
            sort_order: i,
          });
          uploadedCount++;
        }
      } catch {
        // Continue with other images
      }
    }

    return NextResponse.json({
      success: true,
      item: itemData,
      imagesUploaded: uploadedCount,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Import failed" }, { status: 500 });
  }
}
