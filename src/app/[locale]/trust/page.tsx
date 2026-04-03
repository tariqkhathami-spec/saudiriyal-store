import { setRequestLocale, getTranslations } from "next-intl/server";
import { useTranslations, useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { SITE_CONFIG } from "@/lib/constants";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "trust" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function TrustPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <TrustContent />;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={cn("w-5 h-5", i < rating ? "text-gold" : "text-border")}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function TrustContent() {
  const t = useTranslations("trust");
  const locale = useLocale();
  const isRtl = locale === "ar";

  const stats = [
    { value: "100%", label: t("positiveFeedback") },
    { value: "547", label: t("totalFeedback") },
    { value: "216+", label: t("itemsSold") },
    { value: "165", label: t("followers") },
    { value: "2012", label: t("memberSince") },
  ];

  const ratings = [
    { label: t("accurateDescription"), rating: 5 },
    { label: t("reasonableShipping"), rating: 5 },
    { label: t("shippingSpeed"), rating: 5 },
    { label: t("communication"), rating: 5 },
  ];

  return (
    <div className="bg-ivory min-h-screen">
      {/* Hero */}
      <div className="bg-navy py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1
            className={cn(
              "text-3xl sm:text-4xl lg:text-5xl font-bold text-ivory mb-4",
              isRtl ? "font-[family-name:var(--font-noto-naskh)]" : "font-[family-name:var(--font-playfair)]"
            )}
          >
            {t("title")}
          </h1>
          <p className="text-ivory/50 max-w-xl mx-auto text-lg">{t("subtitle")}</p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        {/* eBay Profile Card */}
        <div className="bg-white rounded-2xl border border-border p-6 sm:p-8 mb-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-full bg-navy flex items-center justify-center">
              <span className="text-gold font-bold text-xl">SR</span>
            </div>
            <div>
              <h2
                className={cn(
                  "text-2xl font-bold text-navy",
                  isRtl ? "font-[family-name:var(--font-noto-naskh)]" : "font-[family-name:var(--font-playfair)]"
                )}
              >
                {t("ebayTitle")}
              </h2>
              <p className="text-muted text-sm">@{SITE_CONFIG.ebayUsername}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-ivory rounded-xl p-4 text-center">
                <p className="text-gold text-2xl font-bold font-[family-name:var(--font-playfair)]">
                  {stat.value}
                </p>
                <p className="text-muted text-xs mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Detailed Ratings */}
          <h3 className="font-semibold text-navy mb-4">{t("detailedRatings")}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {ratings.map((r) => (
              <div key={r.label} className="flex items-center justify-between bg-ivory rounded-lg p-3">
                <span className="text-sm text-muted">{r.label}</span>
                <StarRating rating={r.rating} />
              </div>
            ))}
          </div>

          <a
            href={SITE_CONFIG.ebayUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-navy hover:bg-navy-light text-ivory rounded-lg font-semibold transition-colors"
          >
            {t("viewFullProfile")}
            <svg className={cn("w-4 h-4", isRtl && "rotate-180")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>

        {/* Professional Grading */}
        <div className="bg-navy rounded-2xl p-6 sm:p-8 mb-10">
          <h2
            className={cn(
              "text-2xl font-bold text-ivory mb-4",
              isRtl ? "font-[family-name:var(--font-noto-naskh)]" : "font-[family-name:var(--font-playfair)]"
            )}
          >
            {t("gradingTitle")}
          </h2>
          <p className="text-ivory/60 leading-relaxed mb-6">{t("gradingText")}</p>
          <div className="flex flex-wrap gap-4">
            {["PMG", "NGC", "PCGS"].map((company) => (
              <div
                key={company}
                className="bg-ivory/10 border border-gold/20 rounded-lg px-5 py-3"
              >
                <span className="text-gold font-bold text-lg">{company}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Why Trust Us */}
        <h2
          className={cn(
            "text-2xl sm:text-3xl font-bold text-navy mb-8 text-center",
            isRtl ? "font-[family-name:var(--font-noto-naskh)]" : "font-[family-name:var(--font-playfair)]"
          )}
        >
          {t("whyTrust")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            { title: t("reason1Title"), text: t("reason1Text") },
            { title: t("reason2Title"), text: t("reason2Text") },
            { title: t("reason3Title"), text: t("reason3Text") },
            { title: t("reason4Title"), text: t("reason4Text") },
          ].map((reason, i) => (
            <div key={i} className="bg-white rounded-xl border border-border p-6">
              <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-gold" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-navy font-semibold mb-2">{reason.title}</h3>
              <p className="text-muted text-sm">{reason.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
