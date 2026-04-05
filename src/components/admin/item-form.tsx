"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import { slugify, cn } from "@/lib/utils";
import { COUNTRIES, CONDITIONS, ITEM_TYPES, AVAILABILITY_STATUSES, GRADING_COMPANIES } from "@/lib/constants";
import type { Item } from "@/lib/supabase/types";

interface Props {
  item?: Item | null;
  prefill?: Partial<Item> & { imageUrls?: string[] };
}

export function ItemForm({ item, prefill }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>(prefill?.imageUrls || []);
  const [externalImageUrls] = useState<string[]>(prefill?.imageUrls || []);

  const [form, setForm] = useState({
    title_en: item?.title_en || prefill?.title_en || "",
    title_ar: item?.title_ar || "",
    description_en: item?.description_en || prefill?.description_en || "",
    description_ar: item?.description_ar || "",
    type: item?.type || prefill?.type || "banknote",
    country: item?.country || prefill?.country || "",
    year: item?.year?.toString() || prefill?.year?.toString() || "",
    denomination: item?.denomination || prefill?.denomination || "",
    currency: item?.currency || prefill?.currency || "",
    condition: item?.condition || prefill?.condition || "",
    grading_company: item?.grading_company || prefill?.grading_company || "",
    grade: item?.grade || prefill?.grade || "",
    certification_number: item?.certification_number || prefill?.certification_number || "",
    price: item?.price?.toString() || prefill?.price?.toString() || "",
    price_currency: item?.price_currency || "USD",
    status: item?.status || "available",
    featured: item?.featured || false,
    visible: item?.visible !== false,
    ebay_url: item?.ebay_url || prefill?.ebay_url || "",
  });

  function update(field: string, value: string | boolean) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    setImageFiles((prev) => [...prev, ...files]);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => setImagePreviews((prev) => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    });
  }

  function removeImage(index: number) {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  }

  function moveImage(index: number, direction: "up" | "down") {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= imagePreviews.length) return;
    setImagePreviews((prev) => {
      const arr = [...prev];
      [arr[index], arr[newIndex]] = [arr[newIndex], arr[index]];
      return arr;
    });
    setImageFiles((prev) => {
      if (prev.length === 0) return prev;
      const arr = [...prev];
      if (index < arr.length && newIndex < arr.length) {
        [arr[index], arr[newIndex]] = [arr[newIndex], arr[index]];
      }
      return arr;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title_en) {
      setError("Title (English) is required");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const supabase = createClient();
      const slug = item?.slug || slugify(form.title_en);

      const itemData = {
        title_en: form.title_en,
        title_ar: form.title_ar || null,
        description_en: form.description_en || null,
        description_ar: form.description_ar || null,
        type: form.type,
        country: form.country || null,
        year: form.year ? parseInt(form.year) : null,
        denomination: form.denomination || null,
        currency: form.currency || null,
        condition: form.condition || null,
        grading_company: form.grading_company || null,
        grade: form.grade || null,
        certification_number: form.certification_number || null,
        price: form.price ? parseFloat(form.price) : null,
        price_currency: form.price_currency,
        status: form.status,
        featured: form.featured,
        visible: form.visible,
        ebay_url: form.ebay_url || null,
        ebay_item_id: prefill?.ebay_item_id || item?.ebay_item_id || null,
        slug,
        updated_at: new Date().toISOString(),
      };

      let itemId = item?.id;

      if (item) {
        const { error } = await supabase.from("items").update(itemData).eq("id", item.id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("items")
          .insert({ ...itemData, created_at: new Date().toISOString() })
          .select()
          .single();
        if (error) throw error;
        itemId = data.id;
      }

      // Upload new images (from file picker)
      if (imageFiles.length > 0 && itemId) {
        for (let i = 0; i < imageFiles.length; i++) {
          const file = imageFiles[i];
          const ext = file.name.split(".").pop() || "jpg";
          const path = `${itemId}/${Date.now()}-${i}.${ext}`;

          const { error: uploadError } = await supabase.storage
            .from("item-images")
            .upload(path, file, { cacheControl: "3600", upsert: false });

          if (!uploadError) {
            await supabase.from("item_images").insert({
              item_id: itemId,
              storage_path: path,
              is_primary: i === 0 && !item,
              sort_order: i,
            });
          }
        }
      }

      // Upload external URL images (from eBay import)
      if (externalImageUrls.length > 0 && imageFiles.length === 0 && itemId && !item) {
        for (let i = 0; i < externalImageUrls.length; i++) {
          try {
            await fetch("/api/upload-url-image", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                imageUrl: externalImageUrls[i],
                itemId,
                index: i,
              }),
            });
          } catch {
            // Continue with other images if one fails
          }
        }
      }

      router.replace("/admin/items");
    } catch (err: any) {
      setError(err.message || "Failed to save item");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
      {error && (
        <div className="p-4 bg-error/10 border border-error/20 rounded-xl text-error text-sm">
          {error}
        </div>
      )}

      {/* Basic Info */}
      <section className="bg-white rounded-2xl border border-border p-6">
        <h2 className="text-lg font-bold text-navy mb-5">Basic Information</h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-navy mb-1.5 block">
              Title (English) <span className="text-error">*</span>
            </label>
            <input
              type="text"
              value={form.title_en}
              onChange={(e) => update("title_en", e.target.value)}
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold text-base"
              placeholder="e.g., Saudi Arabia 10 Riyals P4 1954"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-navy mb-1.5 block">
              Title (Arabic) <span className="text-muted text-xs">optional</span>
            </label>
            <input
              type="text"
              value={form.title_ar}
              onChange={(e) => update("title_ar", e.target.value)}
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold text-base"
              dir="rtl"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-navy mb-1.5 block">Description (English)</label>
            <textarea
              value={form.description_en}
              onChange={(e) => update("description_en", e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold resize-none"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-navy mb-1.5 block">
              Description (Arabic) <span className="text-muted text-xs">optional</span>
            </label>
            <textarea
              value={form.description_ar}
              onChange={(e) => update("description_ar", e.target.value)}
              rows={4}
              dir="rtl"
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold resize-none"
            />
          </div>
        </div>
      </section>

      {/* Classification */}
      <section className="bg-white rounded-2xl border border-border p-6">
        <h2 className="text-lg font-bold text-navy mb-5">Classification</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-navy mb-1.5 block">Type</label>
            <select
              value={form.type}
              onChange={(e) => update("type", e.target.value)}
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/30 text-base"
            >
              {ITEM_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label_en}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-navy mb-1.5 block">Country</label>
            <select
              value={form.country}
              onChange={(e) => update("country", e.target.value)}
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/30 text-base"
            >
              <option value="">Select Country</option>
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.name_en}>{c.name_en}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-navy mb-1.5 block">Year</label>
            <input
              type="number"
              value={form.year}
              onChange={(e) => update("year", e.target.value)}
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/30 text-base"
              placeholder="e.g., 1954"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-navy mb-1.5 block">Denomination</label>
            <input
              type="text"
              value={form.denomination}
              onChange={(e) => update("denomination", e.target.value)}
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/30 text-base"
              placeholder="e.g., 10 Riyals"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-navy mb-1.5 block">Currency</label>
            <input
              type="text"
              value={form.currency}
              onChange={(e) => update("currency", e.target.value)}
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/30 text-base"
              placeholder="e.g., Saudi Riyal"
            />
          </div>
        </div>
      </section>

      {/* Grading */}
      <section className="bg-white rounded-2xl border border-border p-6">
        <h2 className="text-lg font-bold text-navy mb-5">Grading & Condition</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-navy mb-1.5 block">Condition</label>
            <select
              value={form.condition}
              onChange={(e) => update("condition", e.target.value)}
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/30 text-base"
            >
              <option value="">Select Condition</option>
              {CONDITIONS.map((c) => (
                <option key={c.value} value={c.value}>{c.label_en}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-navy mb-1.5 block">Grading Company</label>
            <select
              value={form.grading_company}
              onChange={(e) => update("grading_company", e.target.value)}
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/30 text-base"
            >
              <option value="">Select</option>
              {GRADING_COMPANIES.map((g) => (
                <option key={g.value} value={g.value}>{g.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-navy mb-1.5 block">Grade</label>
            <input
              type="text"
              value={form.grade}
              onChange={(e) => update("grade", e.target.value)}
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/30 text-base"
              placeholder="e.g., 65 EPQ"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-navy mb-1.5 block">Certification #</label>
            <input
              type="text"
              value={form.certification_number}
              onChange={(e) => update("certification_number", e.target.value)}
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/30 text-base"
            />
          </div>
        </div>
      </section>

      {/* Pricing & Status */}
      <section className="bg-white rounded-2xl border border-border p-6">
        <h2 className="text-lg font-bold text-navy mb-5">Pricing & Status</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-navy mb-1.5 block">Price (USD)</label>
            <input
              type="number"
              step="0.01"
              value={form.price}
              onChange={(e) => update("price", e.target.value)}
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/30 text-base"
              placeholder="Leave empty for 'Contact for price'"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-navy mb-1.5 block">Availability</label>
            <select
              value={form.status}
              onChange={(e) => update("status", e.target.value)}
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/30 text-base"
            >
              {AVAILABILITY_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>{s.label_en}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-navy mb-1.5 block">eBay URL</label>
            <input
              type="url"
              value={form.ebay_url}
              onChange={(e) => update("ebay_url", e.target.value)}
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/30 text-base"
              placeholder="https://www.ebay.com/itm/..."
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-6 mt-5">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => update("featured", e.target.checked)}
              className="w-5 h-5 rounded border-border text-gold focus:ring-gold/30"
            />
            <span className="text-sm font-medium text-navy">Featured Item</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.visible}
              onChange={(e) => update("visible", e.target.checked)}
              className="w-5 h-5 rounded border-border text-gold focus:ring-gold/30"
            />
            <span className="text-sm font-medium text-navy">Visible on Site</span>
          </label>
        </div>
      </section>

      {/* Images */}
      <section className="bg-white rounded-2xl border border-border p-6">
        <h2 className="text-lg font-bold text-navy mb-5">Photos</h2>
        <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-gold/40 transition-colors">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageSelect}
            className="hidden"
            id="image-upload"
          />
          <label htmlFor="image-upload" className="cursor-pointer">
            <svg className="w-12 h-12 text-muted/30 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 3h18M3 3v18m0-18h18v18H3" />
            </svg>
            <p className="text-navy font-medium">Click to upload photos</p>
            <p className="text-muted text-sm mt-1">or drag and drop</p>
          </label>
        </div>

        {imagePreviews.length > 0 && (
          <>
            <p className="text-muted text-xs mt-4 mb-2">Drag photos to reorder. First photo = primary image shown on listings.</p>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {imagePreviews.map((preview, i) => (
                <div key={i} className={cn("relative aspect-square rounded-lg overflow-hidden bg-ivory-dark", i === 0 && "ring-2 ring-gold")}>
                  <img src={preview} alt="" className="w-full h-full object-cover" />
                  {i === 0 && (
                    <span className="absolute top-1 start-1 px-1.5 py-0.5 bg-gold text-navy text-[10px] font-bold rounded">
                      Primary
                    </span>
                  )}
                  <div className="absolute top-1 end-1 flex flex-col gap-0.5">
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="w-6 h-6 bg-error text-white rounded-full flex items-center justify-center text-xs hover:bg-red-700"
                    >
                      &times;
                    </button>
                  </div>
                  <div className="absolute bottom-1 end-1 flex gap-0.5">
                    {i > 0 && (
                      <button
                        type="button"
                        onClick={() => moveImage(i, "up")}
                        className="w-6 h-6 bg-navy/80 text-white rounded flex items-center justify-center text-xs hover:bg-navy"
                        title="Move left"
                      >
                        &#8592;
                      </button>
                    )}
                    {i < imagePreviews.length - 1 && (
                      <button
                        type="button"
                        onClick={() => moveImage(i, "down")}
                        className="w-6 h-6 bg-navy/80 text-white rounded flex items-center justify-center text-xs hover:bg-navy"
                        title="Move right"
                      >
                        &#8594;
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      {/* Submit */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="px-8 py-3 bg-gold hover:bg-gold-light text-navy font-semibold rounded-lg transition-all disabled:opacity-50 text-base"
        >
          {saving ? "Saving..." : item ? "Update Item" : "Add Item"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 border border-border text-muted hover:text-navy rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
