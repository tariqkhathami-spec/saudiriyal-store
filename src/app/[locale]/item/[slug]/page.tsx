import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { ItemDetailContent } from "@/components/item-detail/item-detail-content";

async function getItem(slug: string) {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("items")
      .select("*, item_images(*)")
      .eq("slug", slug)
      .eq("visible", true)
      .single();
    return data;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const item = await getItem(slug);
  if (!item) return { title: "Item Not Found" };

  const title = locale === "ar" ? item.meta_title_ar || item.title_ar || item.title_en : item.meta_title_en || item.title_en;
  const description = locale === "ar" ? item.meta_description_ar || item.description_ar || item.description_en : item.meta_description_en || item.description_en;
  const primaryImage = item.item_images?.find((img: any) => img.is_primary) || item.item_images?.[0];
  const imageUrl = primaryImage
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/item-images/${primaryImage.storage_path}`
    : undefined;

  const fullTitle = `${title} — Buy Rare ${item.country || ""} ${item.type || "Banknote"} | Saudi Riyal Collection`;

  return {
    title: fullTitle,
    description: description?.slice(0, 160) || `Buy ${title}. ${item.grading_company} ${item.grade} graded. Authentic, professionally certified. Up to 15% off direct purchase.`,
    openGraph: {
      title: fullTitle,
      description: description?.slice(0, 160),
      images: imageUrl ? [imageUrl] : [],
      type: "article",
      url: `https://saudiriyal.store/${locale}/item/${slug}`,
    },
    alternates: {
      canonical: `https://saudiriyal.store/en/item/${slug}`,
      languages: {
        en: `https://saudiriyal.store/en/item/${slug}`,
        ar: `https://saudiriyal.store/ar/item/${slug}`,
      },
    },
  };
}

export default async function ItemPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const item = await getItem(slug);
  if (!item) notFound();

  // JSON-LD Product schema for rich Google results
  const primaryImage = item.item_images?.find((img: any) => img.is_primary) || item.item_images?.[0];
  const imageUrl = primaryImage
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/item-images/${primaryImage.storage_path}`
    : undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: item.title_en,
    description: item.description_en || `${item.country || ""} ${item.denomination || "banknote"} ${item.year ? `(${item.year})` : ""} — ${item.grading_company} ${item.grade}`,
    image: imageUrl ? [imageUrl] : [],
    brand: {
      "@type": "Brand",
      name: item.grading_company || "PMG",
    },
    category: `Collectible ${item.type || "Banknote"}`,
    sku: item.ebay_item_id || item.slug,
    url: `https://saudiriyal.store/en/item/${item.slug}`,
    offers: {
      "@type": "Offer",
      price: item.price ? Math.round(item.price * 0.9) : undefined,
      priceCurrency: item.price_currency || "USD",
      availability: item.status === "available"
        ? "https://schema.org/InStock"
        : item.status === "sold"
        ? "https://schema.org/SoldOut"
        : "https://schema.org/PreOrder",
      seller: {
        "@type": "Organization",
        name: "Saudi Riyal Collection",
        url: "https://saudiriyal.store",
      },
      itemCondition: "https://schema.org/UsedCondition",
    },
    additionalProperty: [
      item.country && { "@type": "PropertyValue", name: "Country", value: item.country },
      item.year && { "@type": "PropertyValue", name: "Year", value: String(item.year) },
      item.grade && { "@type": "PropertyValue", name: "Grade", value: item.grade },
      item.denomination && { "@type": "PropertyValue", name: "Denomination", value: item.denomination },
      item.certification_number && { "@type": "PropertyValue", name: "Certification Number", value: item.certification_number },
    ].filter(Boolean),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ItemDetailContent item={item} />
    </>
  );
}
