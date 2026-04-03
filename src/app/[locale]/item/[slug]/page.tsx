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

  return {
    title,
    description: description?.slice(0, 160),
    openGraph: {
      title,
      description: description?.slice(0, 160),
      images: imageUrl ? [imageUrl] : [],
      type: "article",
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

  return <ItemDetailContent item={item} />;
}
