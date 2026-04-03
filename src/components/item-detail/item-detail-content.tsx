"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cn, localized, formatPrice, getImageUrl, getConditionLabel, getStatusColor } from "@/lib/utils";
import Image from "next/image";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import type { Item, ItemImage } from "@/lib/supabase/types";

export function ItemDetailContent({ item }: { item: Item }) {
  const t = useTranslations("item");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const isRtl = locale === "ar";

  const images = (item.item_images || []).sort((a: ItemImage, b: ItemImage) => a.sort_order - b.sort_order);
  const primaryImage = images.find((img: ItemImage) => img.is_primary) || images[0];
  const [selectedImage, setSelectedImage] = useState(primaryImage);

  const title = localized(item, "title", locale);
  const description = localized(item, "description", locale);

  const whatsappNumber = "966504820501";
  const directPrice = item.price ? Math.round(item.price * 0.9) : null;
  const savings = item.price && directPrice ? item.price - directPrice : null;

  const buyDirectMessage = locale === "ar"
    ? `السلام عليكم، أريد شراء هذه القطعة بالسعر المباشر (خصم 10%):\n${item.title_en}\nالسعر: $${directPrice?.toLocaleString()}\nالرابط: https://saudiriyal.store/${locale}/item/${item.slug}`
    : `Hello, I want to buy this item at the direct price (10% off):\n${item.title_en}\nPrice: $${directPrice?.toLocaleString()}\nLink: https://saudiriyal.store/${locale}/item/${item.slug}`;

  const whatsappBuyUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(buyDirectMessage)}`;

  const inquiryMessage = locale === "ar"
    ? `السلام عليكم، أريد الاستفسار عن: ${item.title_en}`
    : `Hello, I'm interested in: ${item.title_en} (${item.slug})`;
  const whatsappInquiryUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(inquiryMessage)}`;

  const specs = [
    { label: t("country"), value: item.country },
    { label: t("year"), value: item.year },
    { label: t("denomination"), value: item.denomination },
    { label: t("currency"), value: item.currency },
    { label: t("type"), value: item.type },
    { label: t("condition"), value: item.condition ? getConditionLabel(item.condition) : null },
    { label: t("gradingCompany"), value: item.grading_company },
    { label: t("grade"), value: item.grade },
    { label: t("certNumber"), value: item.certification_number },
  ].filter((s) => s.value);

  return (
    <div className="bg-ivory min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-navy/5 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-sm text-muted">
            <Link href="/" className="hover:text-gold transition-colors">
              {tCommon("back")}
            </Link>
            <span>/</span>
            <Link href="/collection" className="hover:text-gold transition-colors">
              Collection
            </Link>
            <span>/</span>
            <span className="text-navy truncate max-w-xs">{title}</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div>
            {/* Main Image */}
            <div className="aspect-[4/3] relative bg-white rounded-xl border border-border overflow-hidden mb-4">
              {selectedImage ? (
                <Zoom>
                  <Image
                    src={getImageUrl(selectedImage.storage_path)}
                    alt={title}
                    fill
                    className="object-contain"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                </Zoom>
              ) : (
                <div className="flex items-center justify-center h-full text-muted/20">
                  <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 3h18M3 3v18m0-18h18v18H3" />
                  </svg>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img: ItemImage) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(img)}
                    className={cn(
                      "w-20 h-20 flex-shrink-0 relative rounded-lg border-2 overflow-hidden transition-colors",
                      selectedImage?.id === img.id ? "border-gold" : "border-border hover:border-gold/40"
                    )}
                  >
                    <Image
                      src={getImageUrl(img.storage_path)}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Item Info */}
          <div>
            {/* Status Badge */}
            <div className="flex items-center gap-3 mb-4">
              <span
                className={cn(
                  "px-3 py-1 text-xs font-semibold rounded-full",
                  item.status === "available"
                    ? "bg-success/10 text-success"
                    : item.status === "sold"
                    ? "bg-error/10 text-error"
                    : "bg-gold/10 text-gold-dark"
                )}
              >
                {t(item.status)}
              </span>
              {item.featured && (
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gold/10 text-gold-dark">
                  Featured
                </span>
              )}
            </div>

            {/* Title */}
            <h1
              className={cn(
                "text-2xl sm:text-3xl lg:text-4xl font-bold text-navy mb-4",
                isRtl ? "font-[family-name:var(--font-noto-naskh)]" : "font-[family-name:var(--font-playfair)]"
              )}
            >
              {title}
            </h1>

            {/* Pricing */}
            {item.price ? (
              <div className="bg-white rounded-xl border border-border p-5 mb-6">
                {/* eBay Price */}
                <div className="flex items-center justify-between pb-4 border-b border-border">
                  <div>
                    <p className="text-muted text-xs mb-1">{t("ebayPrice")}</p>
                    <p className="text-navy font-bold text-xl">
                      {formatPrice(item.price, item.price_currency)}
                    </p>
                  </div>
                  {item.ebay_url && (
                    <a
                      href={item.ebay_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 border border-navy text-navy hover:bg-navy hover:text-ivory rounded-lg font-semibold transition-colors text-sm"
                    >
                      {t("viewOnEbay")}
                    </a>
                  )}
                </div>

                {/* Direct Price — 10% Off */}
                <div className="flex items-center justify-between pt-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-muted text-xs">{t("directPrice")}</p>
                      <span className="px-2 py-0.5 bg-gold/10 text-gold-dark text-xs font-bold rounded-full">
                        -10%
                      </span>
                    </div>
                    <p className="text-gold font-bold text-2xl">
                      {formatPrice(directPrice!, item.price_currency)}
                    </p>
                    {savings && (
                      <p className="text-success text-xs font-medium mt-0.5">
                        {t("save")} {formatPrice(savings, item.price_currency)}
                      </p>
                    )}
                  </div>
                  <a
                    href={whatsappBuyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 bg-[#25D366] hover:bg-[#20BD5A] text-white font-semibold rounded-lg transition-colors text-sm flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    {t("buyDirectWhatsApp")}
                  </a>
                </div>
              </div>
            ) : (
              <p className="text-muted italic mb-6">{t("contactToInquire")}</p>
            )}

            {/* Specs */}
            <div className="bg-white rounded-xl border border-border p-5 mb-6">
              <h2 className="text-navy font-semibold mb-4">{t("specifications")}</h2>
              <dl className="grid grid-cols-2 gap-3">
                {specs.map((spec) => (
                  <div key={spec.label}>
                    <dt className="text-muted text-xs">{spec.label}</dt>
                    <dd className="text-navy font-medium text-sm mt-0.5">{String(spec.value)}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Description */}
            {description && (
              <div className="mb-6">
                <h2 className="text-navy font-semibold mb-3">{t("description")}</h2>
                <p className="text-muted leading-relaxed whitespace-pre-line">{description}</p>
              </div>
            )}

            {/* Inquiry CTA */}
            <div>
              <a
                href={whatsappInquiryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-navy text-navy hover:bg-navy hover:text-ivory rounded-lg font-semibold transition-colors text-sm"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                {t("whatsappInquiry")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
