import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export function HeroSection() {
  const t = useTranslations("home");
  const tSite = useTranslations("site");
  const locale = useLocale();
  const isRtl = locale === "ar";

  return (
    <section className="relative bg-navy overflow-hidden">
      {/* Background photo */}
      <Image
        src="/hero.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center opacity-60"
      />

      {/* Dark overlay for legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy/80 via-navy/70 to-navy/90" />

      {/* Gold accent lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
        <div className="max-w-3xl mx-auto text-center">
          {/* Decorative element */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-12 bg-gold/40" />
            <span className="text-gold/70 text-xs tracking-[0.3em] uppercase">
              {tSite("owner")}
            </span>
            <div className="h-px w-12 bg-gold/40" />
          </div>

          {/* Title */}
          <h1
            className={cn(
              "text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-ivory mb-6 leading-tight",
              isRtl
                ? "font-[family-name:var(--font-noto-naskh)]"
                : "font-[family-name:var(--font-playfair)]"
            )}
          >
            {t("heroTitle")}
          </h1>

          {/* Subtitle */}
          <p className="text-ivory/60 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            {t("heroSubtitle")}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/collection"
              className="w-full sm:w-auto px-8 py-3.5 bg-gold hover:bg-gold-light text-navy font-semibold rounded-md transition-all hover:shadow-lg hover:shadow-gold/20 text-center"
            >
              {t("exploreCollection")}
            </Link>
            <Link
              href="/contact"
              className="w-full sm:w-auto px-8 py-3.5 border border-gold/30 text-gold hover:bg-gold/10 rounded-md transition-colors text-center"
            >
              {t("contactUs")}
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
            {[
              { value: "100%", label: t("positiveFeedback") },
              { value: "216+", label: t("itemsSold") },
              { value: "12+", label: t("yearsSelling") },
              { value: "PMG", label: t("professionallyGraded") },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-gold text-2xl sm:text-3xl font-bold font-[family-name:var(--font-playfair)]">
                  {stat.value}
                </p>
                <p className="text-ivory/40 text-xs sm:text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
