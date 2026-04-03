"use client";

import { ItemForm } from "@/components/admin/item-form";

export default function NewItemPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy font-[family-name:var(--font-playfair)]">
          Add New Item
        </h1>
        <p className="text-muted text-sm mt-1">Add a banknote or collectible to your gallery</p>
      </div>
      <ItemForm />
    </div>
  );
}
