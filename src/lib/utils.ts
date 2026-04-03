import slugifyLib from "slugify";

export function localized(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  obj: any,
  field: string,
  locale: string
): string {
  return (
    (obj[`${field}_${locale}`] as string) ||
    (obj[`${field}_en`] as string) ||
    ""
  );
}

export function formatPrice(
  price: number | null | undefined,
  currency = "USD"
): string {
  if (price == null) return "";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
}

export function slugify(text: string): string {
  return slugifyLib(text, { lower: true, strict: true, trim: true });
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function getImageUrl(path: string): string {
  if (path.startsWith("http")) return path;
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/item-images/${path}`;
}

export function getConditionLabel(condition: string): string {
  const labels: Record<string, string> = {
    UNC: "Uncirculated",
    AU: "About Uncirculated",
    XF: "Extremely Fine",
    VF: "Very Fine",
    F: "Fine",
    VG: "Very Good",
    G: "Good",
    PR: "Poor",
  };
  return labels[condition] || condition;
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "available":
      return "text-success";
    case "sold":
      return "text-error";
    case "reserved":
      return "text-gold";
    default:
      return "text-muted";
  }
}
