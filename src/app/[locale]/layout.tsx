import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Playfair_Display, Inter, Noto_Naskh_Arabic, IBM_Plex_Sans_Arabic } from "next/font/google";
import { routing } from "@/i18n/routing";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppFab } from "@/components/layout/whatsapp-fab";
import "../globals.css";

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
    default: "Saudi Riyal Collection — Rare Currency & Banknote Gallery",
    template: "%s | Saudi Riyal Collection",
  },
  description:
    "Discover a curated collection of rare banknotes, coins, and medals from Saudi Arabia, the Middle East, and beyond. Professionally graded by PMG and NGC.",
  metadataBase: new URL("https://saudiriyal.store"),
  openGraph: {
    type: "website",
    siteName: "Saudi Riyal Collection",
    locale: "en_US",
    alternateLocale: "ar_SA",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
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

  return (
    <html
      lang={locale}
      dir={isRtl ? "rtl" : "ltr"}
      className={`${playfair.variable} ${inter.variable} ${notoNaskh.variable} ${ibmPlexAr.variable} h-full antialiased`}
    >
      <body
        className={`min-h-full flex flex-col ${
          isRtl ? "font-[family-name:var(--font-ibm-plex-ar)]" : "font-[family-name:var(--font-inter)]"
        }`}
      >
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
