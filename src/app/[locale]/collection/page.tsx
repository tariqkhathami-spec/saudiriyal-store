import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { CollectionContent } from "@/components/collection/collection-content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "collection" });

  const title = locale === "ar"
    ? "مجموعة العملات النادرة للبيع — أوراق نقدية سعودية وعثمانية"
    : "Rare Banknotes & Currency for Sale — Saudi, Ottoman, Middle Eastern";
  const description = locale === "ar"
    ? "تصفح واشتري أوراق نقدية نادرة مصنفة من PMG و NGC. عملات سعودية، عثمانية، فلسطينية وأكثر. خصم 10% عند الشراء المباشر."
    : "Browse and buy rare PMG & NGC graded banknotes. Saudi Arabian, Ottoman, Palestinian currency and more. 10% off direct purchases via WhatsApp.";

  return {
    title,
    description,
    alternates: {
      canonical: `https://saudiriyal.store/en/collection`,
      languages: {
        en: "https://saudiriyal.store/en/collection",
        ar: "https://saudiriyal.store/ar/collection",
      },
    },
    openGraph: {
      title,
      description,
      url: `https://saudiriyal.store/${locale}/collection`,
    },
  };
}

export default async function CollectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const filters = await searchParams;

  return <CollectionContent filters={filters} />;
}
