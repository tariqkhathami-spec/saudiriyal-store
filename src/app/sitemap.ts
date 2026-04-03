import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://saudiriyal.store";
  const locales = ["en", "ar"];
  const pages = ["", "/collection", "/about", "/contact", "/trust"];

  const entries: MetadataRoute.Sitemap = [];

  // Static pages
  for (const locale of locales) {
    for (const page of pages) {
      entries.push({
        url: `${base}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === "" ? "daily" : "weekly",
        priority: page === "" ? 1.0 : 0.8,
      });
    }
  }

  // Dynamic item pages from the database
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: items } = await supabase
      .from("items")
      .select("slug, updated_at")
      .eq("visible", true)
      .order("created_at", { ascending: false });

    if (items) {
      for (const item of items) {
        for (const locale of locales) {
          entries.push({
            url: `${base}/${locale}/item/${item.slug}`,
            lastModified: new Date(item.updated_at),
            changeFrequency: "weekly",
            priority: 0.9,
          });
        }
      }
    }
  } catch {
    // Database not available, skip dynamic pages
  }

  return entries;
}
