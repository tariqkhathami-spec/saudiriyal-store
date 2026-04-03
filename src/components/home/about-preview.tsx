import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export function AboutPreview() {
  const t = useTranslations("home");
  const locale = useLocale();
  const isRtl = locale === "ar";

  return (
    <section className="py-16 sm:py-24 bg-ivory">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div className={cn(isRtl && "lg:order-2")}>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-gold" />
              <span className="text-gold text-xs tracking-[0.2em] uppercase font-semibold">
                {t("aboutPreviewTitle")}
              </span>
            </div>
            <h2
              className={cn(
                "text-3xl sm:text-4xl font-bold text-navy mb-6",
                isRtl
                  ? "font-[family-name:var(--font-noto-naskh)]"
                  : "font-[family-name:var(--font-playfair)]"
              )}
            >
              Abdullah Al Khathami
            </h2>
            <p className="text-muted leading-relaxed mb-8">
              {t("aboutPreviewText")}
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-6 py-3 border border-navy text-navy hover:bg-navy hover:text-ivory rounded-md transition-colors font-semibold text-sm"
            >
              {t("learnMore")}
            </Link>
          </div>

          {/* Visual */}
          <div className={cn("relative", isRtl && "lg:order-1")}>
            <div className="bg-cream rounded-2xl p-8 sm:p-12 border border-border">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-5 text-center border border-border">
                  <p className="text-gold text-3xl font-bold font-[family-name:var(--font-playfair)]">
                    100%
                  </p>
                  <p className="text-muted text-sm mt-1">{t("positiveFeedback")}</p>
                </div>
                <div className="bg-white rounded-xl p-5 text-center border border-border">
                  <p className="text-gold text-3xl font-bold font-[family-name:var(--font-playfair)]">
                    216+
                  </p>
                  <p className="text-muted text-sm mt-1">{t("itemsSold")}</p>
                </div>
                <div className="bg-white rounded-xl p-5 text-center border border-border">
                  <p className="text-gold text-3xl font-bold font-[family-name:var(--font-playfair)]">
                    12+
                  </p>
                  <p className="text-muted text-sm mt-1">{t("yearsSelling")}</p>
                </div>
                <div className="bg-white rounded-xl p-5 text-center border border-border">
                  <p className="text-gold text-3xl font-bold font-[family-name:var(--font-playfair)]">
                    5.0
                  </p>
                  <p className="text-muted text-sm mt-1">eBay Rating</p>
                </div>
              </div>
              {/* Decorative corner */}
              <div className="absolute -top-2 -end-2 w-16 h-16 border-t-2 border-e-2 border-gold/30 rounded-se-2xl" />
              <div className="absolute -bottom-2 -start-2 w-16 h-16 border-b-2 border-s-2 border-gold/30 rounded-es-2xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
