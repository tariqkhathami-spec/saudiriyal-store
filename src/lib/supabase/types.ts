export type ItemType = "banknote" | "coin" | "medal" | "other";
export type AvailabilityStatus = "available" | "sold" | "reserved";
export type ItemCondition = "UNC" | "AU" | "XF" | "VF" | "F" | "VG" | "G" | "PR";

export interface Item {
  id: string;
  title_en: string;
  title_ar: string | null;
  description_en: string | null;
  description_ar: string | null;
  short_description_en: string | null;
  short_description_ar: string | null;
  type: ItemType;
  country: string;
  region: string | null;
  year: number | null;
  denomination: string | null;
  currency: string | null;
  condition: ItemCondition | null;
  grading_company: string | null;
  grade: string | null;
  certification_number: string | null;
  price: number | null;
  price_currency: string;
  status: AvailabilityStatus;
  ebay_url: string | null;
  ebay_item_id: string | null;
  slug: string;
  meta_title_en: string | null;
  meta_title_ar: string | null;
  meta_description_en: string | null;
  meta_description_ar: string | null;
  featured: boolean;
  visible: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  item_images?: ItemImage[];
}

export interface ItemImage {
  id: string;
  item_id: string;
  storage_path: string;
  alt_text_en: string | null;
  alt_text_ar: string | null;
  is_primary: boolean;
  sort_order: number;
  width: number | null;
  height: number | null;
  created_at: string;
}

export interface Country {
  code: string;
  name_en: string;
  name_ar: string;
  region_en: string | null;
  region_ar: string | null;
  sort_order: number;
}

export interface EbayFeedback {
  id: string;
  positive_count: number;
  total_count: number;
  positive_percentage: number;
  member_since: string;
  items_sold: number;
  followers: number;
  rating_description: number;
  rating_communication: number;
  rating_shipping_time: number;
  rating_shipping_cost: number;
  recent_feedback: FeedbackEntry[];
  updated_at: string;
}

export interface FeedbackEntry {
  buyer: string;
  message: string;
  date: string;
  item_title: string;
}

export interface SiteSettings {
  id: number;
  whatsapp_number: string | null;
  ebay_store_url: string;
  contact_email: string | null;
  about_en: string | null;
  about_ar: string | null;
  hero_title_en: string | null;
  hero_title_ar: string | null;
  hero_subtitle_en: string | null;
  hero_subtitle_ar: string | null;
  updated_at: string;
}
