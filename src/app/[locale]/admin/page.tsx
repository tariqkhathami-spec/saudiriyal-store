"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ total: 0, available: 0, sold: 0, featured: 0 });

  useEffect(() => {
    async function fetchStats() {
      const supabase = createClient();
      const { count: total } = await supabase.from("items").select("*", { count: "exact", head: true });
      const { count: available } = await supabase.from("items").select("*", { count: "exact", head: true }).eq("status", "available");
      const { count: sold } = await supabase.from("items").select("*", { count: "exact", head: true }).eq("status", "sold");
      const { count: featured } = await supabase.from("items").select("*", { count: "exact", head: true }).eq("featured", true);
      setStats({
        total: total || 0,
        available: available || 0,
        sold: sold || 0,
        featured: featured || 0,
      });
    }
    fetchStats().catch(() => {});
  }, []);

  const cards = [
    { label: "Total Items", value: stats.total, color: "bg-navy", href: "/admin/items" },
    { label: "Available", value: stats.available, color: "bg-success", href: "/admin/items?status=available" },
    { label: "Sold", value: stats.sold, color: "bg-error", href: "/admin/items?status=sold" },
    { label: "Featured", value: stats.featured, color: "bg-gold", href: "/admin/items?featured=true" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy font-[family-name:var(--font-playfair)]">
          Dashboard
        </h1>
        <p className="text-muted text-sm mt-1">Welcome back! Manage your collection.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="bg-white rounded-xl border border-border p-5 hover:shadow-md transition-shadow"
          >
            <div className={`w-3 h-3 rounded-full ${card.color} mb-3`} />
            <p className="text-2xl font-bold text-navy">{card.value}</p>
            <p className="text-muted text-sm">{card.label}</p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/admin/items/new"
          className="flex items-center gap-4 bg-white rounded-xl border border-border p-5 hover:border-gold/40 hover:shadow-md transition-all"
        >
          <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center">
            <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-navy">Add New Item</p>
            <p className="text-sm text-muted">Add a banknote or collectible to your gallery</p>
          </div>
        </Link>

        <Link
          href="/admin/import"
          className="flex items-center gap-4 bg-white rounded-xl border border-border p-5 hover:border-gold/40 hover:shadow-md transition-all"
        >
          <div className="w-12 h-12 rounded-xl bg-navy/10 flex items-center justify-center">
            <svg className="w-6 h-6 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-navy">Import from eBay</p>
            <p className="text-sm text-muted">Paste an eBay listing URL to auto-fill</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
