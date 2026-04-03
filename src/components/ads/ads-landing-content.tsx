"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cn, localized, formatPrice, getImageUrl } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { trackWhatsAppBuy, trackEbayClick } from "@/lib/gtm";
import Image from "next/image";
import type { Item } from "@/lib/supabase/types";

const WHATSAPP_NUMBER = "966504820501";
const EBAY_STORE_URL = "https://ebay.us/m/kJKYZ7";

function whatsAppUrl(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function AdsLandingContent() {
  const t = useTranslations("adsLanding");
  const locale = useLocale();
  const isRtl = locale === "ar";
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const supabase = createClient();
        const { data: featured } = await supabase
          .from("items")
          .select("*, item_images(*)")
          .eq("featured", true)
          .eq("visible", true)
          .eq("status", "available")
          .order("sort_order", { ascending: true })
          .limit(6);

        if (featured && featured.length > 0) {
          setItems(featured as Item[]);
        } else {
          const { data: latest } = await supabase
            .from("items")
            .select("*, item_images(*)")
            .eq("visible", true)
            .eq("status", "available")
            .order("created_at", { ascending: false })
            .limit(6);
          setItems((latest as Item[]) || []);
        }
      } catch {
        // Supabase not configured
      }
      setLoading(false);
    }
    fetchFeatured();
  }, []);

  const headingFont = isRtl
    ? "font-[family-name:var(--font-noto-naskh)]"
    : "font-[family-name:var(--font-playfair)]";

  return (
    <div className="bg-ivory">
      {/* ===== HERO SECTION ===== */}
      <section className="relative bg-navy text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,_var(--gold)_0%,_transparent_50%)]" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
          <div className="inline-flex items-center gap-2 bg-gold/20 text-gold-light px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
            </svg>
            {t("badge")}
          </div>
          <h1
            className={cn(
              "text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight",
              headingFont
            )}
          >
            {t("heroTitle")}
            <span className="block text-gold-gradient mt-2">
              {t("heroSave")}
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto mb-8">
            {t("heroSubtitle")}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={whatsAppUrl(t("whatsappHeroMessage"))}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppBuy("Hero CTA", 0)}
              className="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#20BD5A] text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all hover:scale-105 shadow-lg"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              {t("whatsappCta")}
            </a>
            <Link
              href="/collection"
              className="inline-flex items-center gap-2 border-2 border-gold/40 text-gold hover:bg-gold/10 px-8 py-4 rounded-xl text-lg font-semibold transition-colors"
            >
              {t("browseCollection")}
              <svg className={cn("w-5 h-5", isRtl && "rotate-180")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== TRUST SIGNALS ===== */}
      <section className="bg-cream border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "100%", label: t("trustFeedback"), icon: "star" },
              { value: "216+", label: t("trustSold"), icon: "check" },
              { value: "PMG/NGC", label: t("trustCertified"), icon: "shield" },
              { value: "12+", label: t("trustYears"), icon: "clock" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mb-1">
                  {stat.icon === "star" && (
                    <svg className="w-6 h-6 text-gold" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  )}
                  {stat.icon === "check" && (
                    <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  {stat.icon === "shield" && (
                    <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  )}
                  {stat.icon === "clock" && (
                    <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>
                <span className={cn("text-2xl sm:text-3xl font-bold text-navy", headingFont)}>
                  {stat.value}
                </span>
                <span className="text-muted text-sm">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED ITEMS GRID ===== */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2
              className={cn(
                "text-3xl sm:text-4xl font-bold text-navy mb-3",
                headingFont
              )}
            >
              {t("featuredTitle")}
            </h2>
            <p className="text-muted max-w-xl mx-auto">{t("featuredSubtitle")}</p>
            <div className="divider-gold mt-6 max-w-xs mx-auto" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(loading
              ? Array.from({ length: 6 })
              : items.length === 0
              ? Array.from({ length: 3 })
              : items
            ).map((item, i) => {
              if (loading || items.length === 0) {
                return (
                  <div
                    key={i}
                    className="bg-white rounded-xl border border-border overflow-hidden card-luxury"
                  >
                    <div className="aspect-[4/3] bg-ivory-dark animate-pulse" />
                    <div className="p-5">
                      <div className="h-4 bg-ivory-dark rounded animate-pulse mb-3 w-3/4" />
                      <div className="h-3 bg-ivory-dark rounded animate-pulse mb-2 w-1/2" />
                      <div className="h-3 bg-ivory-dark rounded animate-pulse w-1/3" />
                    </div>
                  </div>
                );
              }

              const typedItem = item as Item;
              const primaryImage =
                typedItem.item_images?.find((img) => img.is_primary) ||
                typedItem.item_images?.[0];
              const title = localized(typedItem, "title", locale);
              const ebayPrice = typedItem.price;
              const directPrice = ebayPrice
                ? Math.round(ebayPrice * 0.9)
                : null;
              const savings = ebayPrice ? Math.round(ebayPrice * 0.1) : null;

              return (
                <div
                  key={typedItem.id}
                  className="bg-white rounded-xl border border-border overflow-hidden card-luxury flex flex-col"
                >
                  <Link
                    href={`/item/${typedItem.slug}`}
                    className="group block"
                  >
                    <div className="aspect-[4/3] relative bg-ivory-dark overflow-hidden">
                      {primaryImage ? (
                        <Image
                          src={getImageUrl(primaryImage.storage_path)}
                          alt={title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-muted/30">
                          <svg
                            className="w-16 h-16"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1}
                              d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 3h18M3 3v18m0-18h18v18H3"
                            />
                          </svg>
                        </div>
                      )}
                      {typedItem.grade && (
                        <span className="absolute top-3 start-3 px-2.5 py-1 bg-navy/90 text-gold text-xs font-semibold rounded">
                          {typedItem.grading_company} {typedItem.grade}
                        </span>
                      )}
                    </div>
                  </Link>
                  <div className="p-5 flex flex-col flex-1">
                    <Link href={`/item/${typedItem.slug}`}>
                      <h3 className="text-navy font-semibold text-sm sm:text-base line-clamp-2 hover:text-gold transition-colors">
                        {title}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-2 mt-2 text-muted text-xs sm:text-sm">
                      {typedItem.country && <span>{typedItem.country}</span>}
                      {typedItem.year && (
                        <>
                          <span className="text-border">|</span>
                          <span>{typedItem.year}</span>
                        </>
                      )}
                    </div>

                    {ebayPrice && (
                      <div className="mt-3 mb-4">
                        <div className="flex items-baseline gap-2">
                          <p className="text-muted text-xs line-through">
                            {t("ebayPrice")}:{" "}
                            {formatPrice(
                              ebayPrice,
                              typedItem.price_currency
                            )}
                          </p>
                        </div>
                        <div className="flex items-baseline gap-2 mt-1">
                          <p className="text-gold text-lg font-bold">
                            {formatPrice(
                              directPrice!,
                              typedItem.price_currency
                            )}
                          </p>
                          <span className="text-success text-xs font-bold bg-success/10 px-2 py-0.5 rounded">
                            {t("saveAmount", {
                              amount: formatPrice(
                                savings!,
                                typedItem.price_currency
                              ),
                            })}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="mt-auto flex flex-col gap-2">
                      <a
                        href={whatsAppUrl(
                          t("whatsappItemMessage", { title })
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() =>
                          trackWhatsAppBuy(
                            title,
                            directPrice || 0,
                            typedItem.price_currency
                          )
                        }
                        className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BD5A] text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        {t("buyDirect")}
                      </a>
                      {typedItem.ebay_url && (
                        <a
                          href={typedItem.ebay_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() =>
                            trackEbayClick(
                              title,
                              ebayPrice || 0,
                              typedItem.price_currency
                            )
                          }
                          className="flex items-center justify-center gap-2 border border-border text-muted hover:text-navy hover:border-navy/30 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
                        >
                          {t("viewOnEbay")}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-16 sm:py-20 bg-navy text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className={cn("text-3xl sm:text-4xl font-bold mb-3", headingFont)}>
              {t("howItWorksTitle")}
            </h2>
            <p className="text-white/60 max-w-xl mx-auto">
              {t("howItWorksSubtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: t("step1Title"),
                desc: t("step1Desc"),
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                ),
              },
              {
                step: "02",
                title: t("step2Title"),
                desc: t("step2Desc"),
                icon: (
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                ),
              },
              {
                step: "03",
                title: t("step3Title"),
                desc: t("step3Desc"),
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                  </svg>
                ),
              },
            ].map((step) => (
              <div key={step.step} className="text-center">
                <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-4 text-gold">
                  {step.icon}
                </div>
                <div className="text-gold text-sm font-bold mb-2">
                  {t("stepLabel", { num: step.step })}
                </div>
                <h3 className={cn("text-xl font-bold mb-2", headingFont)}>
                  {step.title}
                </h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ SECTION ===== */}
      <section className="py-16 sm:py-20 bg-ivory">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className={cn("text-3xl sm:text-4xl font-bold text-navy mb-3", headingFont)}>
              {t("faqTitle")}
            </h2>
            <p className="text-muted max-w-xl mx-auto">{t("faqSubtitle")}</p>
            <div className="divider-gold mt-6 max-w-xs mx-auto" />
          </div>

          <div className="space-y-4">
            {(
              [
                { q: t("faq1Q"), a: t("faq1A") },
                { q: t("faq2Q"), a: t("faq2A") },
                { q: t("faq3Q"), a: t("faq3A") },
                { q: t("faq4Q"), a: t("faq4A") },
                { q: t("faq5Q"), a: t("faq5A") },
              ] as { q: string; a: string }[]
            ).map((faq, i) => (
              <details
                key={i}
                className="group bg-white border border-border rounded-xl overflow-hidden"
              >
                <summary className="flex items-center justify-between cursor-pointer px-6 py-4 text-navy font-semibold hover:bg-cream/50 transition-colors">
                  <span>{faq.q}</span>
                  <svg
                    className="w-5 h-5 text-muted shrink-0 transition-transform group-open:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>
                <div className="px-6 pb-4 text-muted text-sm leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="py-16 sm:py-20 bg-navy text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className={cn("text-3xl sm:text-4xl font-bold mb-4", headingFont)}>
            {t("ctaTitle")}
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto mb-8">
            {t("ctaSubtitle")}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={whatsAppUrl(t("whatsappHeroMessage"))}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppBuy("Final CTA", 0)}
              className="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#20BD5A] text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all hover:scale-105 shadow-lg"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              {t("whatsappCta")}
            </a>
            <a
              href={EBAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEbayClick("Final CTA eBay", 0)}
              className="inline-flex items-center gap-2 border-2 border-gold/40 text-gold hover:bg-gold/10 px-8 py-4 rounded-xl text-lg font-semibold transition-colors"
            >
              {t("visitEbayStore")}
            </a>
          </div>
          <p className="text-white/40 text-sm mt-6">{t("ctaDisclaimer")}</p>
        </div>
      </section>
    </div>
  );
}
