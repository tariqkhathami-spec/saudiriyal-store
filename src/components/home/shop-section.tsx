"use client";

import { useTranslations, useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { trackShopSectionClick } from "@/lib/gtm";

const WHATSAPP_NUMBER = "966504820501";
const EBAY_STORE_URL = "https://ebay.us/m/kJKYZ7";

function getWhatsAppUrl(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function ShopSection() {
  const t = useTranslations("home");
  const locale = useLocale();
  const isRtl = locale === "ar";

  const buyMessage =
    locale === "ar"
      ? "السلام عليكم، أريد شراء قطعة من موقعكم saudiriyal.store. أريد الاستفادة من الخصم المباشر (10% PayPal / 15% تحويل)."
      : "Hello, I want to buy an item from your website saudiriyal.store. I'd like to get the direct discount (10% PayPal / 15% bank transfer).";

  const specialOrderMessage =
    locale === "ar"
      ? "السلام عليكم، أبحث عن طلب خاص. أحتاج: [اكتب ما تبحث عنه هنا]"
      : "Hello, I'm looking for a special order. I need: [describe what you're looking for here]";

  return (
    <section className="py-16 sm:py-24 bg-cream">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-8 bg-gold" />
            <span className="text-gold text-xs tracking-[0.2em] uppercase font-semibold">
              {t("shopTitle")}
            </span>
            <div className="h-px w-8 bg-gold" />
          </div>
          <h2
            className={cn(
              "text-3xl sm:text-4xl font-bold text-navy mb-3",
              isRtl
                ? "font-[family-name:var(--font-noto-naskh)]"
                : "font-[family-name:var(--font-playfair)]"
            )}
          >
            {t("shopSubtitle")}
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* eBay Store */}
          <div className="bg-white rounded-2xl border border-border p-6 sm:p-8 flex flex-col items-center text-center card-luxury">
            <div className="w-14 h-14 bg-navy/5 rounded-xl flex items-center justify-center mb-5">
              <svg className="w-7 h-7 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.15c0 .415.336.75.75.75z" />
              </svg>
            </div>
            <h3
              className={cn(
                "text-lg font-bold text-navy mb-2",
                isRtl ? "font-[family-name:var(--font-noto-naskh)]" : "font-[family-name:var(--font-playfair)]"
              )}
            >
              {t("buyEbay")}
            </h3>
            <p className="text-muted text-sm leading-relaxed mb-6 flex-1">
              {t("buyEbayDesc")}
            </p>
            <a
              href={EBAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackShopSectionClick("ebay_store")}
              className="w-full px-5 py-3 bg-navy hover:bg-navy/90 text-ivory font-semibold rounded-lg transition-all text-sm text-center"
            >
              {t("visitEbayStore")}
            </a>
          </div>

          {/* Buy Direct — Up to 15% Off */}
          <div className="bg-white rounded-2xl border-2 border-gold p-6 sm:p-8 flex flex-col items-center text-center relative card-luxury">
            {/* Discount badge */}
            <div className="absolute -top-3 start-1/2 -translate-x-1/2 px-4 py-1 bg-gold text-navy text-xs font-bold rounded-full whitespace-nowrap">
              UP TO 15% OFF
            </div>
            <div className="w-14 h-14 bg-[#25D366]/10 rounded-xl flex items-center justify-center mb-5">
              <svg className="w-7 h-7 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </div>
            <h3
              className={cn(
                "text-lg font-bold text-navy mb-2",
                isRtl ? "font-[family-name:var(--font-noto-naskh)]" : "font-[family-name:var(--font-playfair)]"
              )}
            >
              {t("buyDirect")}
            </h3>
            <p className="text-muted text-sm leading-relaxed mb-6 flex-1">
              {t("buyDirectDesc")}
            </p>
            <a
              href={getWhatsAppUrl(buyMessage)}
              onClick={() => trackShopSectionClick("whatsapp_buy")}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full px-5 py-3 bg-[#25D366] hover:bg-[#20BD5A] text-white font-semibold rounded-lg transition-all text-sm text-center flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              {t("messageWhatsApp")}
            </a>
          </div>

          {/* Special Order */}
          <div className="bg-white rounded-2xl border border-border p-6 sm:p-8 flex flex-col items-center text-center card-luxury">
            <div className="w-14 h-14 bg-gold/10 rounded-xl flex items-center justify-center mb-5">
              <svg className="w-7 h-7 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
              </svg>
            </div>
            <h3
              className={cn(
                "text-lg font-bold text-navy mb-2",
                isRtl ? "font-[family-name:var(--font-noto-naskh)]" : "font-[family-name:var(--font-playfair)]"
              )}
            >
              {t("specialOrder")}
            </h3>
            <p className="text-muted text-sm leading-relaxed mb-6 flex-1">
              {t("specialOrderDesc")}
            </p>
            <a
              href={getWhatsAppUrl(specialOrderMessage)}
              onClick={() => trackShopSectionClick("special_order")}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full px-5 py-3 bg-gold hover:bg-gold-light text-navy font-semibold rounded-lg transition-all text-sm text-center flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              {t("requestSpecialOrder")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
