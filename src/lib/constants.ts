export const COUNTRIES = [
  { code: "SA", name_en: "Saudi Arabia", name_ar: "المملكة العربية السعودية" },
  { code: "PS", name_en: "Palestine", name_ar: "فلسطين" },
  { code: "JO", name_en: "Jordan", name_ar: "الأردن" },
  { code: "IQ", name_en: "Iraq", name_ar: "العراق" },
  { code: "AF", name_en: "Afghanistan", name_ar: "أفغانستان" },
  { code: "LY", name_en: "Libya", name_ar: "ليبيا" },
  { code: "TR", name_en: "Turkey / Ottoman", name_ar: "تركيا / عثمانية" },
  { code: "EG", name_en: "Egypt", name_ar: "مصر" },
  { code: "SY", name_en: "Syria", name_ar: "سوريا" },
  { code: "LB", name_en: "Lebanon", name_ar: "لبنان" },
  { code: "KW", name_en: "Kuwait", name_ar: "الكويت" },
  { code: "BH", name_en: "Bahrain", name_ar: "البحرين" },
  { code: "QA", name_en: "Qatar", name_ar: "قطر" },
  { code: "AE", name_en: "UAE", name_ar: "الإمارات" },
  { code: "OM", name_en: "Oman", name_ar: "عُمان" },
  { code: "YE", name_en: "Yemen", name_ar: "اليمن" },
  { code: "PK", name_en: "Pakistan", name_ar: "باكستان" },
  { code: "IN", name_en: "India", name_ar: "الهند" },
  { code: "OTHER", name_en: "Other", name_ar: "أخرى" },
] as const;

export const CONDITIONS = [
  { value: "UNC", label_en: "Uncirculated (UNC)", label_ar: "غير متداولة" },
  { value: "AU", label_en: "About Uncirculated (AU)", label_ar: "شبه غير متداولة" },
  { value: "XF", label_en: "Extremely Fine (XF)", label_ar: "ممتازة جداً" },
  { value: "VF", label_en: "Very Fine (VF)", label_ar: "جيدة جداً" },
  { value: "F", label_en: "Fine (F)", label_ar: "جيدة" },
  { value: "VG", label_en: "Very Good (VG)", label_ar: "مقبولة جداً" },
  { value: "G", label_en: "Good (G)", label_ar: "مقبولة" },
  { value: "PR", label_en: "Poor (PR)", label_ar: "ضعيفة" },
] as const;

export const ITEM_TYPES = [
  { value: "banknote", label_en: "Banknote", label_ar: "ورقة نقدية" },
  { value: "coin", label_en: "Coin", label_ar: "عملة معدنية" },
  { value: "medal", label_en: "Medal", label_ar: "ميدالية" },
  { value: "other", label_en: "Other", label_ar: "أخرى" },
] as const;

export const AVAILABILITY_STATUSES = [
  { value: "available", label_en: "Available", label_ar: "متاح" },
  { value: "sold", label_en: "Sold", label_ar: "مباع" },
  { value: "reserved", label_en: "Reserved", label_ar: "محجوز" },
] as const;

export const GRADING_COMPANIES = [
  { value: "PMG", label: "PMG (Paper Money Guaranty)" },
  { value: "NGC", label: "NGC (Numismatic Guaranty Company)" },
  { value: "PCGS", label: "PCGS (Professional Coin Grading Service)" },
  { value: "other", label: "Other" },
] as const;

export const SITE_CONFIG = {
  name: "Saudi Riyal Collection",
  nameAr: "مجموعة الريال السعودي",
  tagline: "Rare Currency & Banknote Gallery",
  taglineAr: "معرض العملات والأوراق النقدية النادرة",
  owner: "Abdullah Al Khathami",
  ownerAr: "عبدالله الخثعمي",
  ebayUrl: "https://www.ebay.com/usr/saudiriyal",
  ebayUsername: "saudiriyal",
  domain: "saudiriyal.store",
} as const;
