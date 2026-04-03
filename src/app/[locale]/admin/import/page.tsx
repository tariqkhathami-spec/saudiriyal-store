"use client";

import { useState } from "react";
import { ItemForm } from "@/components/admin/item-form";
import type { Item } from "@/lib/supabase/types";

export default function ImportPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [prefill, setPrefill] = useState<Partial<Item> & { imageUrls?: string[] } | null>(null);

  async function handleImport(e: React.FormEvent) {
    e.preventDefault();
    if (!url.includes("ebay.com")) {
      setError("Please enter a valid eBay listing URL");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/ebay-import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!res.ok) throw new Error("Failed to import");

      const data = await res.json();
      setPrefill(data);
    } catch {
      setError("Could not import from eBay. The listing may be private or the URL may be invalid. You can manually enter the details below.");
    }
    setLoading(false);
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy font-[family-name:var(--font-playfair)]">
          Import from eBay
        </h1>
        <p className="text-muted text-sm mt-1">
          Paste an eBay listing URL to auto-fill item details
        </p>
      </div>

      {!prefill && (
        <form onSubmit={handleImport} className="bg-white rounded-2xl border border-border p-6 mb-8 max-w-3xl">
          {error && (
            <div className="p-3 bg-error/10 border border-error/20 rounded-lg text-error text-sm mb-4">
              {error}
            </div>
          )}
          <div className="flex gap-3">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.ebay.com/itm/..."
              className="flex-1 px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold text-base"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gold hover:bg-gold-light text-navy font-semibold rounded-lg transition-all disabled:opacity-50"
            >
              {loading ? "Importing..." : "Import"}
            </button>
          </div>
          <p className="text-muted text-xs mt-3">
            This will attempt to extract the title, description, images, and price from the listing.
            You can review and edit everything before saving.
          </p>
        </form>
      )}

      {prefill && (
        <div>
          <div className="bg-success/10 border border-success/20 rounded-xl p-4 mb-6 max-w-3xl">
            <p className="text-success font-medium text-sm">
              Import successful! Review the details below and click &quot;Add Item&quot; to save.
            </p>
          </div>
          <ItemForm prefill={prefill} />
        </div>
      )}
    </div>
  );
}
