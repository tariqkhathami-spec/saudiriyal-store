import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { SITE_CONFIG } from "@/lib/constants";

export function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const tSite = useTranslations("site");
  const locale = useLocale();
  const year = new Date().getFullYear();
  const isRtl = locale === "ar";

  return (
    <footer className="bg-navy text-ivory/70">
      <div className="divider-gold" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Image
                src="/logo.webp"
                alt={tSite("name")}
                width={80}
                height={80}
                className="w-9 h-9 rounded-full object-cover"
              />
              <span className={`text-ivory font-semibold ${isRtl ? "font-[family-name:var(--font-noto-naskh)]" : "font-[family-name:var(--font-playfair)]"}`}>
                {tSite("name")}
              </span>
            </div>
            <p className="text-sm text-ivory/50 leading-relaxed max-w-xs">
              {tSite("tagline")}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-ivory text-sm font-semibold mb-4 uppercase tracking-wider">
              {t("quickLinks")}
            </h3>
            <ul className="space-y-2.5">
              {[
                { href: "/collection", label: tNav("collection") },
                { href: "/about", label: tNav("about") },
                { href: "/trust", label: tNav("trust") },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-ivory/50 hover:text-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-ivory text-sm font-semibold mb-4 uppercase tracking-wider">
              {t("contact")}
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-ivory/50 hover:text-gold transition-colors"
                >
                  {tNav("contact")}
                </Link>
              </li>
              <li>
                <a
                  href={SITE_CONFIG.ebayUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-ivory/50 hover:text-gold transition-colors"
                >
                  {t("followEbay")}
                </a>
              </li>
            </ul>
          </div>

          {/* Trust Badge */}
          <div>
            <div className="bg-gold/5 border border-gold/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-gold" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                </svg>
                <span className="text-gold text-sm font-semibold">100% Positive</span>
              </div>
              <p className="text-xs text-ivory/40">eBay Trusted Seller since 2012</p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 border-t border-ivory/10 text-center">
          <p className="text-xs text-ivory/30">
            &copy; {year} {tSite("name")}. {t("rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
