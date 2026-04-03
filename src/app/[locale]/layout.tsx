import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Playfair_Display, Inter, Noto_Naskh_Arabic, IBM_Plex_Sans_Arabic } from "next/font/google";
import Script from "next/script";
import { routing } from "@/i18n/routing";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppFab } from "@/components/layout/whatsapp-fab";
import "../globals.css";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID;

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const notoNaskh = Noto_Naskh_Arabic({
  subsets: ["arabic"],
  variable: "--font-noto-naskh",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const ibmPlexAr = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-ibm-plex-ar",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Saudi Riyal Collection — Rare Banknotes, Coins & Currency for Sale | PMG Graded",
    template: "%s | Saudi Riyal Collection",
  },
  description:
    "Buy rare Saudi Arabian banknotes, Ottoman currency, Middle Eastern coins & medals. PMG & NGC graded. 100% authentic with 10% off direct purchase. Trusted eBay seller since 2012 with 100% positive feedback. Free worldwide shipping.",
  metadataBase: new URL("https://saudiriyal.store"),
  keywords: [
    "rare banknotes for sale",
    "Saudi Riyal collection",
    "Saudi Arabian currency",
    "rare currency dealer",
    "PMG graded banknotes",
    "NGC graded coins",
    "Ottoman banknotes",
    "Middle East currency",
    "collectible banknotes",
    "rare paper money",
    "numismatic dealer",
    "buy rare banknotes online",
    "Saudi Arabia banknote",
    "Palestine banknote",
    "Jordan banknote",
    "Iraq banknote",
    "عملات نادرة للبيع",
    "ريال سعودي نادر",
    "أوراق نقدية نادرة",
    "عملات عثمانية",
    "مجموعة عملات",
  ],
  openGraph: {
    type: "website",
    siteName: "Saudi Riyal Collection",
    locale: "en_US",
    alternateLocale: "ar_SA",
    title: "Saudi Riyal Collection — Rare Banknotes & Currency for Sale",
    description: "Buy rare PMG graded banknotes from Saudi Arabia, Ottoman Empire & Middle East. 10% off direct purchases. 100% authentic, worldwide shipping.",
    url: "https://saudiriyal.store",
  },
  twitter: {
    card: "summary_large_image",
    title: "Saudi Riyal Collection — Rare Banknotes for Sale",
    description: "Buy rare PMG graded banknotes. 10% off direct purchases. Trusted eBay seller since 2012.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://saudiriyal.store",
    languages: {
      en: "https://saudiriyal.store/en",
      ar: "https://saudiriyal.store/ar",
    },
  },
  verification: {
    google: "pending",
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const isRtl = locale === "ar";

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Store",
        "@id": "https://saudiriyal.store/#store",
        name: "Saudi Riyal Collection",
        alternateName: "مجموعة الريال السعودي",
        description: "Buy rare banknotes, coins and medals from Saudi Arabia, Ottoman Empire and the Middle East. PMG and NGC graded. Trusted eBay seller since 2012.",
        url: "https://saudiriyal.store",
        logo: "https://saudiriyal.store/logo.png",
        telephone: "+966504820501",
        address: {
          "@type": "PostalAddress",
          addressCountry: "SA",
        },
        priceRange: "$50 - $50,000",
        currenciesAccepted: "USD, SAR",
        paymentAccepted: "PayPal, Bank Transfer, WhatsApp Direct",
        openingHoursSpecification: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          opens: "00:00",
          closes: "23:59",
        },
        sameAs: [
          "https://ebay.us/m/kJKYZ7",
          "https://www.ebay.com/usr/saudiriyal",
        ],
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "5.0",
          bestRating: "5",
          ratingCount: "216",
        },
      },
      {
        "@type": "Person",
        "@id": "https://saudiriyal.store/#owner",
        name: "Abdullah Al Khathami",
        alternateName: "عبدالله الخثعمي",
        jobTitle: "Numismatic Dealer & Collector",
        worksFor: { "@id": "https://saudiriyal.store/#store" },
      },
      {
        "@type": "WebSite",
        "@id": "https://saudiriyal.store/#website",
        url: "https://saudiriyal.store",
        name: "Saudi Riyal Collection",
        alternateName: "مجموعة الريال السعودي",
        publisher: { "@id": "https://saudiriyal.store/#store" },
        inLanguage: ["en", "ar"],
      },
    ],
  };

  return (
    <html
      lang={locale}
      dir={isRtl ? "rtl" : "ltr"}
      className={`${playfair.variable} ${inter.variable} ${notoNaskh.variable} ${ibmPlexAr.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {GTM_ID && (
          <Script id="gtag-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA4_ID}');`}
          </Script>
        )}
        {GTM_ID && (
          <Script id="gtm" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID}');`}
          </Script>
        )}
      </head>
      <body
        className={`min-h-full flex flex-col ${
          isRtl ? "font-[family-name:var(--font-ibm-plex-ar)]" : "font-[family-name:var(--font-inter)]"
        }`}
      >
        {GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <WhatsAppFab />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
