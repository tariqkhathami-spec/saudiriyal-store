"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function SettingsPage() {
  const [form, setForm] = useState({
    whatsapp_number: "",
    contact_email: "",
    ebay_store_url: "https://www.ebay.com/usr/saudiriyal",
    hero_title_en: "Rare Currency Gallery",
    hero_title_ar: "معرض العملات النادرة",
    hero_subtitle_en: "",
    hero_subtitle_ar: "",
    about_en: "",
    about_ar: "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase.from("site_settings").select("*").eq("id", 1).single();
      if (data) {
        setForm({
          whatsapp_number: data.whatsapp_number || "",
          contact_email: data.contact_email || "",
          ebay_store_url: data.ebay_store_url || "",
          hero_title_en: data.hero_title_en || "",
          hero_title_ar: data.hero_title_ar || "",
          hero_subtitle_en: data.hero_subtitle_en || "",
          hero_subtitle_ar: data.hero_subtitle_ar || "",
          about_en: data.about_en || "",
          about_ar: data.about_ar || "",
        });
      }
    }
    load().catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const supabase = createClient();
    await supabase.from("site_settings").upsert({ id: 1, ...form, updated_at: new Date().toISOString() });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy font-[family-name:var(--font-playfair)]">
          Settings
        </h1>
        <p className="text-muted text-sm mt-1">Update your site contact info and content</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
        {saved && (
          <div className="p-3 bg-success/10 border border-success/20 rounded-xl text-success text-sm">
            Settings saved successfully!
          </div>
        )}

        <section className="bg-white rounded-2xl border border-border p-6">
          <h2 className="text-lg font-bold text-navy mb-5">Contact Information</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-navy mb-1.5 block">WhatsApp Number</label>
              <input
                type="text"
                value={form.whatsapp_number}
                onChange={(e) => update("whatsapp_number", e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/30 text-base"
                placeholder="e.g., 966501234567 (with country code, no +)"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-navy mb-1.5 block">Email</label>
              <input
                type="email"
                value={form.contact_email}
                onChange={(e) => update("contact_email", e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/30 text-base"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-navy mb-1.5 block">eBay Store URL</label>
              <input
                type="url"
                value={form.ebay_store_url}
                onChange={(e) => update("ebay_store_url", e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/30 text-base"
              />
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-border p-6">
          <h2 className="text-lg font-bold text-navy mb-5">Homepage Content</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-navy mb-1.5 block">Hero Title (EN)</label>
              <input
                type="text"
                value={form.hero_title_en}
                onChange={(e) => update("hero_title_en", e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/30 text-base"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-navy mb-1.5 block">Hero Title (AR)</label>
              <input
                type="text"
                value={form.hero_title_ar}
                onChange={(e) => update("hero_title_ar", e.target.value)}
                dir="rtl"
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/30 text-base"
              />
            </div>
          </div>
        </section>

        <button
          type="submit"
          disabled={saving}
          className="px-8 py-3 bg-gold hover:bg-gold-light text-navy font-semibold rounded-lg transition-all disabled:opacity-50 text-base"
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </form>
    </div>
  );
}
