import { setRequestLocale, getTranslations } from "next-intl/server";
import { useTranslations, useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AboutContent />;
}

function AboutContent() {
  const t = useTranslations("about");
  const locale = useLocale();
  const isRtl = locale === "ar";

  const sections = [
    { title: t("passion"), text: t("passionText"), icon: "heart" },
    { title: t("expertise"), text: t("expertiseText"), icon: "shield" },
    { title: t("commitment"), text: t("commitmentText"), icon: "star" },
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
          <div className="divider-gold mt-8 max-w-xs mx-auto" />
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        {/* Intro */}
        <p className="text-lg sm:text-xl text-muted leading-relaxed mb-16 text-center">
          {t("intro")}
        </p>

        {/* Sections */}
        <div className="space-y-12">
          {sections.map((section, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-border p-6 sm:p-8"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0">
                  <div className="w-6 h-6 text-gold">
                    {section.icon === "heart" && (
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                      </svg>
                    )}
                    {section.icon === "shield" && (
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                      </svg>
                    )}
                    {section.icon === "star" && (
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                      </svg>
                    )}
                  </div>
                </div>
                <div>
                  <h2 className={cn(
                    "text-xl sm:text-2xl font-bold text-navy mb-3",
                    isRtl ? "font-[family-name:var(--font-noto-naskh)]" : "font-[family-name:var(--font-playfair)]"
                  )}>
                    {section.title}
                  </h2>
                  <p className="text-muted leading-relaxed">{section.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Link
            href="/collection"
            className="inline-flex px-8 py-3.5 bg-gold hover:bg-gold-light text-navy font-semibold rounded-md transition-all hover:shadow-lg hover:shadow-gold/20"
          >
            Explore the Collection
          </Link>
        </div>
      </div>
    </div>
  );
}
