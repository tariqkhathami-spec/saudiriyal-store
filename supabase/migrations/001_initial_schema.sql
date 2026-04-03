-- Saudi Riyal Collection - Database Schema
-- Run this in the Supabase SQL Editor

-- Items table
CREATE TABLE IF NOT EXISTS items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title_en TEXT NOT NULL,
  title_ar TEXT,
  description_en TEXT,
  description_ar TEXT,
  short_description_en TEXT,
  short_description_ar TEXT,
  type TEXT NOT NULL DEFAULT 'banknote' CHECK (type IN ('banknote', 'coin', 'medal', 'other')),
  country TEXT,
  region TEXT,
  year INTEGER,
  denomination TEXT,
  currency TEXT,
  condition TEXT CHECK (condition IN ('UNC', 'AU', 'XF', 'VF', 'F', 'VG', 'G', 'PR', NULL)),
  grading_company TEXT,
  grade TEXT,
  certification_number TEXT,
  price DECIMAL(10,2),
  price_currency TEXT DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'sold', 'reserved')),
  ebay_url TEXT,
  ebay_item_id TEXT,
  slug TEXT UNIQUE NOT NULL,
  meta_title_en TEXT,
  meta_title_ar TEXT,
  meta_description_en TEXT,
  meta_description_ar TEXT,
  featured BOOLEAN DEFAULT FALSE,
  visible BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Item images table
CREATE TABLE IF NOT EXISTS item_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id UUID REFERENCES items(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  alt_text_en TEXT,
  alt_text_ar TEXT,
  is_primary BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  width INTEGER,
  height INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- eBay feedback table
CREATE TABLE IF NOT EXISTS ebay_feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  positive_count INTEGER DEFAULT 216,
  total_count INTEGER DEFAULT 547,
  positive_percentage DECIMAL(5,2) DEFAULT 100.00,
  member_since TEXT DEFAULT 'January 2012',
  items_sold INTEGER DEFAULT 216,
  followers INTEGER DEFAULT 165,
  rating_description DECIMAL(3,2) DEFAULT 5.00,
  rating_communication DECIMAL(3,2) DEFAULT 5.00,
  rating_shipping_time DECIMAL(3,2) DEFAULT 5.00,
  rating_shipping_cost DECIMAL(3,2) DEFAULT 5.00,
  recent_feedback JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Site settings (singleton)
CREATE TABLE IF NOT EXISTS site_settings (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  whatsapp_number TEXT,
  ebay_store_url TEXT DEFAULT 'https://www.ebay.com/usr/saudiriyal',
  contact_email TEXT,
  about_en TEXT,
  about_ar TEXT,
  hero_title_en TEXT DEFAULT 'Rare Currency Gallery',
  hero_title_ar TEXT DEFAULT 'معرض العملات النادرة',
  hero_subtitle_en TEXT,
  hero_subtitle_ar TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_items_country ON items(country);
CREATE INDEX IF NOT EXISTS idx_items_year ON items(year);
CREATE INDEX IF NOT EXISTS idx_items_status ON items(status);
CREATE INDEX IF NOT EXISTS idx_items_featured ON items(featured) WHERE featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_items_slug ON items(slug);
CREATE INDEX IF NOT EXISTS idx_items_visible ON items(visible) WHERE visible = TRUE;
CREATE INDEX IF NOT EXISTS idx_items_type ON items(type);
CREATE INDEX IF NOT EXISTS idx_item_images_item_id ON item_images(item_id);

-- Enable Row Level Security
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE ebay_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public read access for all tables
CREATE POLICY "Public read items" ON items FOR SELECT USING (true);
CREATE POLICY "Public read item_images" ON item_images FOR SELECT USING (true);
CREATE POLICY "Public read ebay_feedback" ON ebay_feedback FOR SELECT USING (true);
CREATE POLICY "Public read site_settings" ON site_settings FOR SELECT USING (true);

-- Authenticated users can manage all tables
CREATE POLICY "Auth manage items" ON items FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth manage item_images" ON item_images FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth manage ebay_feedback" ON ebay_feedback FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth manage site_settings" ON site_settings FOR ALL USING (auth.role() = 'authenticated');

-- Seed initial site settings
INSERT INTO site_settings (id, ebay_store_url) VALUES (1, 'https://www.ebay.com/usr/saudiriyal') ON CONFLICT (id) DO NOTHING;

-- Seed initial eBay feedback
INSERT INTO ebay_feedback (positive_count, total_count, positive_percentage, member_since, items_sold, followers)
VALUES (216, 547, 100.00, 'January 2012', 216, 165);

-- Create storage bucket (run this separately in Supabase Dashboard > Storage)
-- Create a bucket named "item-images" with public access
