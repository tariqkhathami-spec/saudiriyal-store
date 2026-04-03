"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import { formatPrice, getImageUrl, cn } from "@/lib/utils";
import Image from "next/image";
import type { Item } from "@/lib/supabase/types";

export default function AdminItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function fetchItems() {
    const supabase = createClient();
    const { data } = await supabase
      .from("items")
      .select("*, item_images(*)")
      .order("created_at", { ascending: false });
    setItems((data as Item[]) || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchItems().catch(() => setLoading(false));
  }, []);

  async function toggleStatus(item: Item) {
    const supabase = createClient();
    const newStatus = item.status === "available" ? "sold" : "available";
    await supabase.from("items").update({ status: newStatus }).eq("id", item.id);
    fetchItems();
  }

  async function toggleFeatured(item: Item) {
    const supabase = createClient();
    await supabase.from("items").update({ featured: !item.featured }).eq("id", item.id);
    fetchItems();
  }

  async function toggleVisibility(item: Item) {
    const supabase = createClient();
    await supabase.from("items").update({ visible: !item.visible }).eq("id", item.id);
    fetchItems();
  }

  async function deleteItem(item: Item) {
    if (deletingId === item.id) {
      // Second tap = confirmed
      setDeletingId(null);
      const supabase = createClient();
      await supabase.from("items").delete().eq("id", item.id);
      fetchItems();
    } else {
      // First tap = show confirm state
      setDeletingId(item.id);
      // Auto-reset after 4 seconds if not confirmed
      setTimeout(() => setDeletingId((prev) => (prev === item.id ? null : prev)), 4000);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-navy font-[family-name:var(--font-playfair)]">
            All Items
          </h1>
          <p className="text-muted text-sm mt-1">{items.length} items in collection</p>
        </div>
        <Link
          href="/admin/items/new"
          className="px-4 py-2 bg-gold hover:bg-gold-light text-navy font-semibold rounded-lg transition-colors text-sm"
        >
          + Add New
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-border p-4 animate-pulse">
              <div className="h-6 bg-ivory-dark rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-xl border border-border p-12 text-center">
          <p className="text-muted mb-4">No items yet. Add your first collectible!</p>
          <Link
            href="/admin/items/new"
            className="inline-flex px-6 py-2.5 bg-gold hover:bg-gold-light text-navy font-semibold rounded-lg transition-colors text-sm"
          >
            Add First Item
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const primaryImage = item.item_images?.find((img) => img.is_primary) || item.item_images?.[0];
            return (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-border p-4"
              >
                {/* Top row: thumbnail + info */}
                <div className="flex items-center gap-4">
                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded-lg bg-ivory-dark overflow-hidden flex-shrink-0 relative">
                    {primaryImage ? (
                      <Image
                        src={getImageUrl(primaryImage.storage_path)}
                        alt={item.title_en}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted/20">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 3h18M3 3v18m0-18h18v18H3" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-navy text-sm truncate">{item.title_en}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs flex-wrap">
                      <span className={cn(
                        "px-2 py-0.5 rounded-full font-medium",
                        item.status === "available" ? "bg-success/10 text-success" :
                        item.status === "sold" ? "bg-error/10 text-error" : "bg-gold/10 text-gold-dark"
                      )}>
                        {item.status}
                      </span>
                      {item.featured && (
                        <span className="px-2 py-0.5 rounded-full bg-gold/10 text-gold-dark font-medium">
                          featured
                        </span>
                      )}
                      {!item.visible && (
                        <span className="px-2 py-0.5 rounded-full bg-muted/10 text-muted font-medium">
                          hidden
                        </span>
                      )}
                      {item.price && (
                        <span className="text-muted">{formatPrice(item.price)}</span>
                      )}
                    </div>
                  </div>

                  {/* Actions — desktop only (hidden on mobile) */}
                  <div className="hidden sm:flex items-center gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => toggleStatus(item)}
                      title="Toggle sold/available"
                      className="p-2 rounded-lg hover:bg-ivory transition-colors text-muted hover:text-navy"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => toggleFeatured(item)}
                      title="Toggle featured"
                      className={cn(
                        "p-2 rounded-lg hover:bg-ivory transition-colors",
                        item.featured ? "text-gold" : "text-muted hover:text-gold"
                      )}
                    >
                      <svg className="w-4 h-4" fill={item.featured ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => toggleVisibility(item)}
                      title="Toggle visibility"
                      className="p-2 rounded-lg hover:bg-ivory transition-colors text-muted hover:text-navy"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {item.visible ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                        )}
                      </svg>
                    </button>
                    <Link
                      href={`/admin/items/${item.id}/edit`}
                      className="p-2 rounded-lg hover:bg-ivory transition-colors text-muted hover:text-navy"
                      title="Edit"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                      </svg>
                    </Link>
                    <button
                      onClick={() => deleteItem(item)}
                      className={cn(
                        "p-2 rounded-lg transition-colors",
                        deletingId === item.id
                          ? "bg-error text-white"
                          : "hover:bg-error/10 text-muted hover:text-error"
                      )}
                      title={deletingId === item.id ? "Tap again to confirm" : "Delete"}
                    >
                      {deletingId === item.id ? (
                        <span className="text-xs font-bold px-1">Confirm?</span>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Actions — mobile only (shown below item info) */}
                <div className="flex sm:hidden items-center gap-1 mt-3 pt-3 border-t border-border overflow-x-auto">
                  <button
                    onClick={() => toggleStatus(item)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-ivory text-muted active:bg-navy/10 text-xs font-medium whitespace-nowrap min-h-[44px]"
                  >
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                    </svg>
                    {item.status === "available" ? "Sold" : "Available"}
                  </button>
                  <button
                    onClick={() => toggleFeatured(item)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-2 rounded-lg bg-ivory active:bg-navy/10 text-xs font-medium whitespace-nowrap min-h-[44px]",
                      item.featured ? "text-gold" : "text-muted"
                    )}
                  >
                    <svg className="w-4 h-4 flex-shrink-0" fill={item.featured ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                    </svg>
                    Star
                  </button>
                  <button
                    onClick={() => toggleVisibility(item)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-ivory text-muted active:bg-navy/10 text-xs font-medium whitespace-nowrap min-h-[44px]"
                  >
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {item.visible ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      )}
                    </svg>
                    {item.visible ? "Hide" : "Show"}
                  </button>
                  <Link
                    href={`/admin/items/${item.id}/edit`}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-ivory text-muted active:bg-navy/10 text-xs font-medium whitespace-nowrap min-h-[44px]"
                  >
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteItem(item)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap min-h-[44px]",
                      deletingId === item.id
                        ? "bg-error text-white active:bg-error/90"
                        : "bg-error/10 text-error active:bg-error/20"
                    )}
                  >
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                    {deletingId === item.id ? "Tap to Confirm" : "Delete"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
