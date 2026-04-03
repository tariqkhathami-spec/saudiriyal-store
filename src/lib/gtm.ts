// Google Tag Manager / GA4 event tracking utilities

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

function pushEvent(event: Record<string, unknown>) {
  if (typeof window !== "undefined") {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(event);
  }
}

export function trackWhatsAppBuy(itemName: string, value: number, currency: string = "USD") {
  pushEvent({
    event: "whatsapp_buy_click",
    item_name: itemName,
    conversion_value: value,
    currency,
    conversion_type: "purchase_intent",
  });
}

export function trackWhatsAppInquiry(itemName: string, value: number, currency: string = "USD") {
  pushEvent({
    event: "whatsapp_inquiry_click",
    item_name: itemName,
    conversion_value: Math.round(value * 0.05),
    currency,
    conversion_type: "inquiry",
  });
}

export function trackEbayClick(itemName: string, value: number, currency: string = "USD") {
  pushEvent({
    event: "ebay_click",
    item_name: itemName,
    conversion_value: Math.round(value * 0.1),
    currency,
    conversion_type: "ebay_redirect",
  });
}

export function trackContactFormSubmit() {
  pushEvent({
    event: "contact_form_submit",
    conversion_value: 25,
    currency: "USD",
    conversion_type: "lead",
  });
}

export function trackShopSectionClick(action: "ebay_store" | "whatsapp_buy" | "special_order") {
  const values = { ebay_store: 10, whatsapp_buy: 50, special_order: 75 };
  pushEvent({
    event: "shop_section_click",
    action,
    conversion_value: values[action],
    currency: "USD",
    conversion_type: action === "special_order" ? "lead" : "click",
  });
}

export function trackWhatsAppFab() {
  pushEvent({
    event: "whatsapp_fab_click",
    conversion_value: 15,
    currency: "USD",
    conversion_type: "contact",
  });
}
