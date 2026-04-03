import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { country: "Saudi Arabia", countryAr: "السعودية", emoji: "🇸🇦", query: "Saudi Arabia" },
  { country: "Palestine", countryAr: "فلسطين", emoji: "🇵🇸", query: "Palestine" },
  { country: "Jordan / Iraq", countryAr: "الأردن / العراق", emoji: "🇯🇴", query: "Jordan" },
  { country: "Ottoman / Turkey", countryAr: "عثمانية / تركيا", emoji: "🇹🇷", query: "Turkey" },
  { country: "Afghanistan", countryAr: "أفغانستان", emoji: "🇦🇫", query: "Afghanistan" },
  { country: "Libya", countryAr: "ليبيا", emoji: "🇱🇾", query: "Libya" },
];

export function CategoryShowcase() {
  const t = useTranslations("home");
  const locale = useLocale();
  const isRtl = locale === "ar";

  return (
    <section className="py-16 sm:py-24 bg-cream">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2
            className={cn(
              "text-3xl sm:text-4xl font-bold text-navy mb-3",
              isRtl
                ? "font-[family-name:var(--font-noto-naskh)]"
                : "font-[family-name:var(--font-playfair)]"
            )}
          >
            {t("categoriesTitle")}
          </h2>
          <p className="text-muted max-w-xl mx-auto">{t("categoriesSubtitle")}</p>
          <div className="divider-gold mt-6 max-w-xs mx-auto" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.query}
              href={`/collection?country=${encodeURIComponent(cat.query)}`}
              className="group bg-white rounded-xl border border-border p-5 sm:p-6 text-center hover:border-gold/40 hover:shadow-lg transition-all"
            >
              <span className="text-3xl sm:text-4xl block mb-3">{cat.emoji}</span>
              <p className="text-navy font-semibold text-sm group-hover:text-gold transition-colors">
                {isRtl ? cat.countryAr : cat.country}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
