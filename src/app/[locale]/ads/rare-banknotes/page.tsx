import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { AdsLandingContent } from "@/components/ads/ads-landing-content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "adsLanding" });

  const title =
    locale === "ar"
      ? "اشتري أوراق نقدية نادرة مصنفة PMG — وفر 10% عند الشراء المباشر"
      : "Buy Rare PMG-Graded Banknotes — Save 10% Direct";
  const description =
    locale === "ar"
      ? "أوراق نقدية نادرة مصنفة من PMG و NGC للبيع. خصم 10% عند الشراء المباشر عبر واتساب. بائع موثوق على إيباي بتقييم 100%. شحن عالمي مجاني."
      : "Rare PMG & NGC graded banknotes for sale. Save 10% buying direct via WhatsApp. 100% eBay feedback, 216+ sold. Free worldwide shipping.";

  return {
    title,
    description,
    robots: {
      index: false,
      follow: false,
    },
    openGraph: {
      title,
      description,
      url: `https://saudiriyal.store/${locale}/ads/rare-banknotes`,
    },
  };
}

export default async function AdsRareBanknotesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AdsLandingContent />;
}
