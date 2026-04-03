"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { cn, localized, formatPrice, getImageUrl } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { COUNTRIES, CONDITIONS, ITEM_TYPES, AVAILABILITY_STATUSES } from "@/lib/constants";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import type { Item } from "@/lib/supabase/types";

interface Props {
  filters: Record<string, string | string[] | undefined>;
}

export function CollectionContent({ filters }: Props) {
  const t = useTranslations("collection");
  const locale = useLocale();
  const isRtl = locale === "ar";
  const router = useRouter();
  const pathname = usePathname();

  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const country = (filters.country as string) || "";
  const type = (filters.type as string) || "";
  const condition = (filters.condition as string) || "";
  const status = (filters.status as string) || "";
  const search = (filters.search as string) || "";
  const sort = (filters.sort as string) || "newest";
  const page = parseInt((filters.page as string) || "1", 10);
  const perPage = 12;

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      let query = supabase
        .from("items")
        .select("*, item_images(*)", { count: "exact" })
        .eq("visible", true);

      if (country) query = query.ilike("country", `%${country}%`);
      if (type) query = query.eq("type", type);
      if (condition) query = query.eq("condition", condition);
      if (status) query = query.eq("status", status);
      if (search) {
        query = query.or(
          `title_en.ilike.%${search}%,title_ar.ilike.%${search}%,country.ilike.%${search}%,denomination.ilike.%${search}%`
        );
      }

      switch (sort) {
        case "oldest":
          query = query.order("created_at", { ascending: true });
          break;
        case "priceHigh":
          query = query.order("price", { ascending: false, nullsFirst: false });
          break;
        case "priceLow":
          query = query.order("price", { ascending: true, nullsFirst: false });
          break;
        case "yearNew":
          query = query.order("year", { ascending: false, nullsFirst: false });
          break;
        case "yearOld":
          query = query.order("year", { ascending: true, nullsFirst: false });
          break;
        default:
          query = query.order("created_at", { ascending: false });
      }

      const from = (page - 1) * perPage;
      query = query.range(from, from + perPage - 1);

      const { data, count } = await query;
      setItems((data as Item[]) || []);
      setTotal(count || 0);
    } catch {
      // Supabase not configured
      setItems([]);
    }
    setLoading(false);
  }, [country, type, condition, status, search, sort, page]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams();
    const currentFilters: Record<string, string> = {
      country,
      type,
      condition,
      status,
      search,
      sort,
    };
    currentFilters[key] = value;
    if (key !== "page") currentFilters.page = "1";
    else currentFilters.page = value;

    Object.entries(currentFilters).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });

    router.replace(`${pathname}?${params.toString()}`);
  }

  const totalPages = Math.ceil(total / perPage);

  return (
    <div className="bg-ivory min-h-screen">
      {/* Header */}
      <div className="bg-navy py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1
            className={cn(
              "text-3xl sm:text-4xl lg:text-5xl font-bold text-ivory mb-3",
              isRtl ? "font-[family-name:var(--font-noto-naskh)]" : "font-[family-name:var(--font-playfair)]"
            )}
          >
            {t("title")}
          </h1>
          <p className="text-ivory/50 max-w-xl mx-auto">{t("subtitle")}</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Search + Filter Toggle */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1 relative">
            <svg className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="text"
              defaultValue={search}
              placeholder={t("searchPlaceholder")}
              className="w-full ps-10 pe-4 py-2.5 border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold text-sm"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  updateFilter("search", (e.target as HTMLInputElement).value);
                }
              }}
            />
          </div>
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="sm:w-auto px-4 py-2.5 border border-border rounded-lg bg-white hover:border-gold/40 transition-colors text-sm font-medium flex items-center gap-2 justify-center"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
            </svg>
            {t("filters")}
          </button>
          <select
            value={sort}
            onChange={(e) => updateFilter("sort", e.target.value)}
            className="px-3 py-2.5 border border-border rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/30"
          >
            <option value="newest">{t("newest")}</option>
            <option value="oldest">{t("oldest")}</option>
            <option value="priceHigh">{t("priceHigh")}</option>
            <option value="priceLow">{t("priceLow")}</option>
            <option value="yearNew">{t("yearNew")}</option>
            <option value="yearOld">{t("yearOld")}</option>
          </select>
        </div>

        {/* Filters Panel */}
        {filtersOpen && (
          <div className="bg-white border border-border rounded-xl p-4 sm:p-6 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-medium text-muted mb-1.5 block">{t("country")}</label>
                <select
                  value={country}
                  onChange={(e) => updateFilter("country", e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30"
                >
                  <option value="">{t("allCountries")}</option>
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.name_en}>
                      {isRtl ? c.name_ar : c.name_en}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted mb-1.5 block">{t("type")}</label>
                <select
                  value={type}
                  onChange={(e) => updateFilter("type", e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30"
                >
                  <option value="">{t("allTypes")}</option>
                  {ITEM_TYPES.map((it) => (
                    <option key={it.value} value={it.value}>
                      {isRtl ? it.label_ar : it.label_en}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted mb-1.5 block">{t("condition")}</label>
                <select
                  value={condition}
                  onChange={(e) => updateFilter("condition", e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30"
                >
                  <option value="">{t("allConditions")}</option>
                  {CONDITIONS.map((c) => (
                    <option key={c.value} value={c.value}>
                      {isRtl ? c.label_ar : c.label_en}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted mb-1.5 block">{t("availability")}</label>
                <select
                  value={status}
                  onChange={(e) => updateFilter("status", e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30"
                >
                  <option value="">{t("allStatuses")}</option>
                  {AVAILABILITY_STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {isRtl ? s.label_ar : s.label_en}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {(country || type || condition || status) && (
              <button
                onClick={() => {
                  router.replace(pathname);
                }}
                className="mt-4 text-sm text-gold hover:text-gold-dark font-medium"
              >
                {t("clearFilters")}
              </button>
            )}
          </div>
        )}

        {/* Results count */}
        <p className="text-sm text-muted mb-4">
          {t("showing")} {Math.min((page - 1) * perPage + 1, total)}–{Math.min(page * perPage, total)} {t("of")} {total} {t("items")}
        </p>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-border overflow-hidden">
                <div className="aspect-[4/3] bg-ivory-dark animate-pulse" />
                <div className="p-4">
                  <div className="h-4 bg-ivory-dark rounded animate-pulse mb-2 w-3/4" />
                  <div className="h-3 bg-ivory-dark rounded animate-pulse w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16">
            <svg className="w-16 h-16 text-muted/20 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <p className="text-muted">{t("noResults")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {items.map((item) => {
              const primaryImage = item.item_images?.find((img) => img.is_primary) || item.item_images?.[0];
              const title = localized(item, "title", locale);

              return (
                <Link
                  key={item.id}
                  href={`/item/${item.slug}`}
                  className="group bg-white rounded-xl border border-border overflow-hidden card-luxury"
                >
                  <div className="aspect-[4/3] relative bg-ivory-dark overflow-hidden">
                    {primaryImage ? (
                      <Image
                        src={getImageUrl(primaryImage.storage_path)}
                        alt={title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted/20">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 3h18M3 3v18m0-18h18v18H3" />
                        </svg>
                      </div>
                    )}
                    {item.featured && (
                      <span className="absolute top-2 start-2 px-2 py-0.5 bg-gold text-navy text-xs font-semibold rounded">
                        {t("featured")}
                      </span>
                    )}
                    {item.status === "sold" && (
                      <div className="absolute inset-0 bg-navy/40 flex items-center justify-center">
                        <span className="bg-error text-white px-3 py-1 text-xs font-semibold rounded">SOLD</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-navy font-semibold text-sm line-clamp-2 group-hover:text-gold transition-colors mb-1.5">
                      {title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-1.5 text-muted text-xs">
                      {item.country && <span>{item.country}</span>}
                      {item.year && (
                        <>
                          <span className="text-border">·</span>
                          <span>{item.year}</span>
                        </>
                      )}
                      {item.grade && (
                        <>
                          <span className="text-border">·</span>
                          <span>{item.grading_company} {item.grade}</span>
                        </>
                      )}
                    </div>
                    {item.price ? (
                      <div className="mt-2 flex items-baseline gap-2">
                        <p className="text-muted text-xs line-through">
                          {formatPrice(item.price, item.price_currency)}
                        </p>
                        <p className="text-gold font-semibold text-sm">
                          {formatPrice(Math.round(item.price * 0.85), item.price_currency)}
                        </p>
                        <span className="text-success text-[10px] font-bold bg-success/10 px-1.5 py-0.5 rounded">
                          -15%
                        </span>
                      </div>
                    ) : (
                      <p className="text-muted text-xs mt-2 italic">Contact for price</p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-10">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => updateFilter("page", p.toString())}
                className={cn(
                  "w-10 h-10 rounded-lg text-sm font-medium transition-colors",
                  p === page
                    ? "bg-gold text-navy"
                    : "bg-white border border-border text-muted hover:border-gold/40"
                )}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
