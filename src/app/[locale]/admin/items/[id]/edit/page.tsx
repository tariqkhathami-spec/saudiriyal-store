"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ItemForm } from "@/components/admin/item-form";
import type { Item } from "@/lib/supabase/types";

export default function EditItemPage() {
  const params = useParams();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const supabase = createClient();
      const { data } = await supabase
        .from("items")
        .select("*, item_images(*)")
        .eq("id", params.id)
        .single();
      setItem(data as Item);
      setLoading(false);
    }
    fetch().catch(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!item) {
    return <p className="text-muted text-center py-20">Item not found</p>;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy font-[family-name:var(--font-playfair)]">
          Edit Item
        </h1>
        <p className="text-muted text-sm mt-1">{item.title_en}</p>
      </div>
      <ItemForm item={item} />
    </div>
  );
}
