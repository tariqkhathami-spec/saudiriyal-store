import { setRequestLocale } from "next-intl/server";
import { HeroSection } from "@/components/home/hero-section";
import { FeaturedItems } from "@/components/home/featured-items";
import { CategoryShowcase } from "@/components/home/category-showcase";
import { TrustBanner } from "@/components/home/trust-banner";
import { AboutPreview } from "@/components/home/about-preview";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <HeroSection />
      <FeaturedItems />
      <CategoryShowcase />
      <TrustBanner />
      <AboutPreview />
    </>
  );
}
