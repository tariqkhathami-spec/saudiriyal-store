// Google Tag Manager / GA4 event tracking utilities

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
    gtag: (...args: unknown[]) => void;
  }
}

function pushEvent(event: Record<string, unknown>) {
  if (typeof window !== "undefined") {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(event);
  }
}

/** Send event to GA4 via gtag (loaded by GTM Google Tag) */
function sendGA4Event(
  eventName: string,
  params: Record<string, unknown> = {}
) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
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
  sendGA4Event("whatsapp_buy_click", {
    item_name: itemName,
    value,
    currency,
    conversion_type: "purchase_intent",
  });
}

export function trackWhatsAppInquiry(itemName: string, value: number, currency: string = "USD") {
  const conversionValue = Math.round(value * 0.05);
  pushEvent({
    event: "whatsapp_inquiry_click",
    item_name: itemName,
    conversion_value: conversionValue,
    currency,
    conversion_type: "inquiry",
  });
  sendGA4Event("whatsapp_inquiry_click", {
    item_name: itemName,
    value: conversionValue,
    currency,
    conversion_type: "inquiry",
  });
}

export function trackEbayClick(itemName: string, value: number, currency: string = "USD") {
  const conversionValue = Math.round(value * 0.1);
  pushEvent({
    event: "ebay_click",
    item_name: itemName,
    conversion_value: conversionValue,
    currency,
    conversion_type: "ebay_redirect",
  });
  sendGA4Event("ebay_click", {
    item_name: itemName,
    value: conversionValue,
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
  sendGA4Event("contact_form_submit", {
    value: 25,
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
  sendGA4Event("shop_section_click", {
    action,
    value: values[action],
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
  sendGA4Event("whatsapp_fab_click", {
    value: 15,
    currency: "USD",
    conversion_type: "contact",
  });
}
