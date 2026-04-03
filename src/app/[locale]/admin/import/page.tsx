"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ImportPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{
    success: boolean;
    item: { id: string; title_en: string; slug: string; price: number; price_currency: string };
    imagesUploaded: number;
  } | null>(null);
  const router = useRouter();

  async function handleImport(e: React.FormEvent) {
    e.preventDefault();
    if (!url.includes("ebay.com")) {
      setError("Please enter a valid eBay listing URL");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/ebay-import-full", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to import");
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || "Could not import from eBay. The listing may be private or the URL may be invalid.");
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
          Paste an eBay listing URL — item and photos will be imported automatically
        </p>
      </div>

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
            className="px-6 py-3 bg-gold hover:bg-gold-light text-navy font-semibold rounded-lg transition-all disabled:opacity-50 min-w-[140px]"
          >
            {loading ? (
              <span className="flex items-center gap-2 justify-center">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Importing...
              </span>
            ) : (
              "Import"
            )}
          </button>
        </div>
        <p className="text-muted text-xs mt-3">
          One click — extracts all details, downloads photos, and creates the item automatically.
        </p>
      </form>

      {result && (
        <div className="bg-white rounded-2xl border border-border p-6 max-w-3xl">
          <div className="bg-success/10 border border-success/20 rounded-xl p-4 mb-6">
            <p className="text-success font-semibold text-base">
              Item imported successfully!
            </p>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-muted">Title</span>
              <span className="font-medium text-navy text-right max-w-[70%]">{result.item.title_en}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-muted">Price</span>
              <span className="font-medium text-navy">
                {result.item.price ? `${result.item.price_currency} ${result.item.price.toLocaleString()}` : "Not set"}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-muted">Photos uploaded</span>
              <span className="font-medium text-navy">{result.imagesUploaded}</span>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => router.push(`/en/admin/items/${result.item.id}/edit`)}
              className="px-5 py-2.5 bg-navy hover:bg-navy/90 text-white font-medium rounded-lg transition-all text-sm"
            >
              Edit Item
            </button>
            <button
              onClick={() => router.push("/en/admin/items")}
              className="px-5 py-2.5 border border-border hover:bg-cream text-navy font-medium rounded-lg transition-all text-sm"
            >
              All Items
            </button>
            <button
              onClick={() => {
                setResult(null);
                setUrl("");
              }}
              className="px-5 py-2.5 bg-gold hover:bg-gold-light text-navy font-medium rounded-lg transition-all text-sm"
            >
              Import Another
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
