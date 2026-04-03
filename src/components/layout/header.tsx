"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export function Header() {
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");
  const tSite = useTranslations("site");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isRtl = locale === "ar";

  const navLinks = [
    { href: "/", label: t("home") },
    { href: "/collection", label: t("collection") },
    { href: "/about", label: t("about") },
    { href: "/trust", label: t("trust") },
    { href: "/contact", label: t("contact") },
  ];

  function switchLocale() {
    const newLocale = locale === "en" ? "ar" : "en";
    router.replace(pathname, { locale: newLocale });
  }

  return (
    <header className="sticky top-0 z-50 bg-navy/95 backdrop-blur-sm border-b border-gold/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center group-hover:bg-gold/30 transition-colors">
              <span className="text-gold font-bold text-sm sm:text-base">SR</span>
            </div>
            <div className="hidden sm:block">
              <p className={cn(
                "text-ivory text-sm font-semibold tracking-wide",
                isRtl ? "font-[family-name:var(--font-noto-naskh)]" : "font-[family-name:var(--font-playfair)]"
              )}>
                {tSite("name")}
              </p>
              <p className="text-gold/70 text-xs">{tSite("tagline")}</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-2 text-sm rounded-md transition-colors",
                  pathname === link.href
                    ? "text-gold bg-gold/10"
                    : "text-ivory/80 hover:text-gold hover:bg-gold/5"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <button
              onClick={switchLocale}
              className="px-3 py-1.5 text-xs sm:text-sm text-gold border border-gold/30 rounded-md hover:bg-gold/10 transition-colors"
              aria-label="Switch language"
            >
              {tCommon("language")}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-ivory/80 hover:text-gold"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-navy border-t border-gold/10">
          <nav className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "block px-3 py-2.5 text-sm rounded-md transition-colors",
                  pathname === link.href
                    ? "text-gold bg-gold/10"
                    : "text-ivory/80 hover:text-gold hover:bg-gold/5"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
