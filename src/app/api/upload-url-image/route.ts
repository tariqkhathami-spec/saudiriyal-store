import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { imageUrl, itemId, index } = await req.json();

    if (!imageUrl || !itemId) {
      return NextResponse.json({ error: "Missing imageUrl or itemId" }, { status: 400 });
    }

    // Download the image
    const imgResponse = await fetch(imageUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    if (!imgResponse.ok) {
      return NextResponse.json({ error: "Failed to download image" }, { status: 502 });
    }

    const contentType = imgResponse.headers.get("content-type") || "image/jpeg";
    const ext = contentType.includes("png") ? "png" : contentType.includes("webp") ? "webp" : "jpg";
    const buffer = await imgResponse.arrayBuffer();

    const path = `${itemId}/${Date.now()}-${index || 0}.${ext}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabaseAdmin.storage
      .from("item-images")
      .upload(path, Buffer.from(buffer), {
        contentType,
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    // Create item_images record
    const { error: dbError } = await supabaseAdmin.from("item_images").insert({
      item_id: itemId,
      storage_path: path,
      is_primary: index === 0,
      sort_order: index || 0,
    });

    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, path });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Upload failed" }, { status: 500 });
  }
}
