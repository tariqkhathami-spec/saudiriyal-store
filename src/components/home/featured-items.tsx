"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cn, localized, formatPrice, getImageUrl } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import type { Item } from "@/lib/supabase/types";

export function FeaturedItems() {
  const t = useTranslations("home");
  const tCol = useTranslations("collection");
  const locale = useLocale();
  const isRtl = locale === "ar";
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchItems() {
      try {
        const supabase = createClient();
        // First try featured items
        const { data: featured } = await supabase
          .from("items")
          .select("*, item_images(*)")
          .eq("featured", true)
          .eq("visible", true)
          .order("sort_order", { ascending: true })
          .limit(6);

        if (featured && featured.length > 0) {
          setItems(featured as Item[]);
        } else {
          // Fallback: show latest items if none are featured
          const { data: latest } = await supabase
            .from("items")
            .select("*, item_images(*)")
            .eq("visible", true)
            .order("created_at", { ascending: false })
            .limit(6);
          setItems((latest as Item[]) || []);
        }
      } catch {
        // Supabase not configured yet
      }
      setLoading(false);
    }
    fetchItems();
  }, []);

  return (
    <section className="py-16 sm:py-24 bg-ivory">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2
            className={cn(
              "text-3xl sm:text-4xl font-bold text-navy mb-3",
              isRtl ? "font-[family-name:var(--font-noto-naskh)]" : "font-[family-name:var(--font-playfair)]"
            )}
          >
            {t("featuredTitle")}
          </h2>
          <p className="text-muted max-w-xl mx-auto">{t("featuredSubtitle")}</p>
          <div className="divider-gold mt-6 max-w-xs mx-auto" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(loading ? Array.from({ length: 3 }) : items.length === 0 ? Array.from({ length: 3 }) : items).map((item, i) => {
            if (loading || items.length === 0) {
              return (
                <div key={i} className="bg-white rounded-xl border border-border overflow-hidden card-luxury">
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
            const primaryImage = typedItem.item_images?.find((img) => img.is_primary) || typedItem.item_images?.[0];
            const title = localized(typedItem, "title", locale);

            return (
              <Link
                key={typedItem.id}
                href={`/item/${typedItem.slug}`}
                className="group bg-white rounded-xl border border-border overflow-hidden card-luxury"
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
                      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 3h18M3 3v18m0-18h18v18H3" />
                      </svg>
                    </div>
                  )}
                  {typedItem.featured && (
                    <span className="absolute top-3 start-3 px-2.5 py-1 bg-gold text-navy text-xs font-semibold rounded">
                      {tCol("featured")}
                    </span>
                  )}
                  {typedItem.status === "sold" && (
                    <div className="absolute inset-0 bg-navy/50 flex items-center justify-center">
                      <span className="bg-error text-white px-4 py-1.5 text-sm font-semibold rounded">SOLD</span>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-navy font-semibold text-sm sm:text-base line-clamp-2 group-hover:text-gold transition-colors">
                    {title}
                  </h3>
                  <div className="flex items-center gap-2 mt-2 text-muted text-xs sm:text-sm">
                    {typedItem.country && <span>{typedItem.country}</span>}
                    {typedItem.year && (
                      <>
                        <span className="text-border">|</span>
                        <span>{typedItem.year}</span>
                      </>
                    )}
                    {typedItem.grade && (
                      <>
                        <span className="text-border">|</span>
                        <span>{typedItem.grading_company} {typedItem.grade}</span>
                      </>
                    )}
                  </div>
                  {typedItem.price && (
                    <div className="mt-3 flex items-baseline gap-2">
                      <p className="text-muted text-xs line-through">
                        {formatPrice(typedItem.price, typedItem.price_currency)}
                      </p>
                      <p className="text-gold font-semibold">
                        {formatPrice(Math.round(typedItem.price * 0.85), typedItem.price_currency)}
                      </p>
                      <span className="text-success text-[10px] font-bold bg-success/10 px-1.5 py-0.5 rounded">
                        -15%
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/collection"
            className="inline-flex items-center gap-2 text-gold hover:text-gold-dark font-semibold transition-colors"
          >
            {t("viewAll")}
            <svg className={cn("w-4 h-4", isRtl && "rotate-180")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
