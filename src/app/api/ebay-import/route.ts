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
    const $ = cheerio.load(html);

    // Try JSON-LD first
    let title = "";
    let description = "";
    let price: number | null = null;
    let priceCurrency = "USD";
    let imageUrls: string[] = [];
    let condition = "";

    const jsonLdScript = $('script[type="application/ld+json"]').first().html();
    if (jsonLdScript) {
      try {
        const jsonLd = JSON.parse(jsonLdScript);
        const product = Array.isArray(jsonLd) ? jsonLd.find((item: any) => item["@type"] === "Product") : jsonLd;

        if (product) {
          title = product.name || "";
          description = product.description || "";
          if (product.offers) {
            const offer = Array.isArray(product.offers) ? product.offers[0] : product.offers;
            price = offer?.price ? parseFloat(offer.price) : null;
            priceCurrency = offer?.priceCurrency || "USD";
          }
          if (product.image) {
            imageUrls = Array.isArray(product.image)
              ? product.image
              : [product.image];
          }
        }
      } catch {
        // JSON-LD parse failed, fall back to meta tags
      }
    }

    // Fallback: Open Graph meta tags
    if (!title) {
      title = $('meta[property="og:title"]').attr("content") || $("title").text() || "";
    }
    if (!description) {
      description = $('meta[property="og:description"]').attr("content") || $('meta[name="description"]').attr("content") || "";
    }
    if (imageUrls.length === 0) {
      const ogImage = $('meta[property="og:image"]').attr("content");
      if (ogImage) imageUrls = [ogImage];
    }

    // Try to parse item specifics for country, year, denomination
    let country = "";
    let year: number | null = null;
    let denomination = "";
    let gradingCompany = "";
    let grade = "";

    // Extract from title patterns
    const yearMatch = title.match(/\b(1[789]\d{2}|20[0-2]\d)\b/);
    if (yearMatch) year = parseInt(yearMatch[1]);

    // PMG/NGC pattern
    const pmgMatch = title.match(/(\d+)\s*(PMG|NGC)/i);
    if (pmgMatch) {
      grade = pmgMatch[1];
      gradingCompany = pmgMatch[2].toUpperCase();
    }
    const pmgMatch2 = title.match(/(PMG|NGC)\s*(\d+)/i);
    if (!grade && pmgMatch2) {
      gradingCompany = pmgMatch2[1].toUpperCase();
      grade = pmgMatch2[2];
    }

    // EPQ pattern
    const epqMatch = title.match(/(\d+)\s*EPQ/i);
    if (epqMatch && !grade) grade = `${epqMatch[1]} EPQ`;
    else if (epqMatch && grade && !grade.includes("EPQ")) grade += " EPQ";

    // Country detection
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

    return NextResponse.json({
      title_en: title.trim(),
      description_en: description.trim(),
      price,
      price_currency: priceCurrency,
      country,
      year,
      denomination,
      grading_company: gradingCompany,
      grade,
      condition: grade ? "UNC" : "",
      ebay_url: url,
      imageUrls: imageUrls.slice(0, 10),
      type: "banknote",
    });
  } catch (error) {
    return NextResponse.json({ error: "Import failed" }, { status: 500 });
  }
}
