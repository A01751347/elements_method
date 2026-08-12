"use client";

/**
 * Client-side tracking: pixel loading (under consent) + conversion events.
 *
 * The tracking IDs come from the runtime config resolved on the server
 * (site_settings → env fallback) and passed into the CookieBanner. Scripts load
 * only after the visitor grants the matching consent category:
 *   - analytics  → GA4, GTM
 *   - marketing  → Meta Pixel, Google Ads, LinkedIn
 *
 * Events (page_view, Lead, Purchase) are mirrored to every loaded provider via
 * the `track*` helpers, which no-op safely when nothing is loaded.
 */

export interface TrackingConfig {
  gaMeasurementId: string;
  metaPixelId: string;
  googleAdsId: string;
  googleAdsPurchaseLabel: string;
  linkedinPartnerId: string;
  gtmContainerId: string;
}

export interface ConsentState {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
    fbq?: any;
    _fbq?: any;
    lintrk?: (...args: any[]) => void;
    _linkedin_data_partner_ids?: string[];
    __emTracking?: TrackingConfig;
  }
}

const CONFIG_KEY = "__emTracking";

function has(id: string | undefined | null): id is string {
  return typeof id === "string" && id.trim().length > 0;
}

function appendScript(attrs: { src?: string; text?: string; id: string }) {
  if (document.querySelector(`script[data-pixel="${attrs.id}"]`)) return;
  const s = document.createElement("script");
  s.dataset.pixel = attrs.id;
  if (attrs.src) {
    s.async = true;
    s.src = attrs.src;
  }
  if (attrs.text) s.text = attrs.text;
  document.head.appendChild(s);
}

/** Ensure the shared gtag() stub + dataLayer exist (used by GA4 and Google Ads). */
function ensureGtag() {
  if (typeof window.gtag === "function") return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  window.gtag("js", new Date());
}

/**
 * Load whatever pixels the granted consent + configured IDs allow.
 * Stores the config on window so track*() helpers can reach the labels later.
 */
export function loadPixels(config: TrackingConfig, consent: ConsentState) {
  if (typeof window === "undefined") return;
  window[CONFIG_KEY] = config;

  // ── Analytics category ──────────────────────────────────────────────
  if (consent.analytics) {
    if (has(config.gaMeasurementId)) {
      appendScript({
        src: `https://www.googletagmanager.com/gtag/js?id=${config.gaMeasurementId}`,
        id: "ga",
      });
      ensureGtag();
      window.gtag!("config", config.gaMeasurementId, { anonymize_ip: true });
    }
    if (has(config.gtmContainerId)) {
      window.dataLayer = window.dataLayer || [];
      appendScript({
        text: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${config.gtmContainerId}');`,
        id: "gtm",
      });
    }
  }

  // ── Marketing category ──────────────────────────────────────────────
  if (consent.marketing) {
    if (has(config.googleAdsId)) {
      appendScript({
        src: `https://www.googletagmanager.com/gtag/js?id=${config.googleAdsId}`,
        id: "google-ads",
      });
      ensureGtag();
      window.gtag!("config", config.googleAdsId);
    }
    if (has(config.metaPixelId)) {
      appendScript({
        text: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${config.metaPixelId}');fbq('track','PageView');`,
        id: "meta",
      });
    }
    if (has(config.linkedinPartnerId)) {
      appendScript({
        text: `_linkedin_partner_id='${config.linkedinPartnerId}';window._linkedin_data_partner_ids=window._linkedin_data_partner_ids||[];window._linkedin_data_partner_ids.push(_linkedin_partner_id);`,
        id: "linkedin",
      });
      appendScript({
        src: "https://snap.licdn.com/li.lms-analytics/insight.min.js",
        id: "linkedin-load",
      });
    }
  }
}

function cfg(): TrackingConfig | undefined {
  return typeof window !== "undefined" ? window[CONFIG_KEY] : undefined;
}

/** SPA page view — fire on route change (GA4 + Meta). */
export function trackPageView(url?: string) {
  const c = cfg();
  if (!c) return;
  if (typeof window.gtag === "function" && has(c.gaMeasurementId)) {
    window.gtag("event", "page_view", url ? { page_path: url } : {});
  }
  if (typeof window.fbq === "function") {
    window.fbq("track", "PageView");
  }
}

/** Lead — apply / contact form submitted. */
export function trackLead(detail: { source?: string; value?: number } = {}) {
  const c = cfg();
  if (!c) return;
  if (typeof window.gtag === "function" && has(c.gaMeasurementId)) {
    window.gtag("event", "generate_lead", {
      currency: "MXN",
      value: detail.value ?? 0,
      lead_source: detail.source,
    });
  }
  if (typeof window.fbq === "function") {
    window.fbq("track", "Lead", { content_name: detail.source });
  }
}

/** Purchase — checkout completed. */
export function trackPurchase(detail: {
  value: number;
  currency?: string;
  transactionId?: string;
}) {
  const c = cfg();
  if (!c) return;
  const currency = detail.currency ?? "MXN";
  if (typeof window.gtag === "function") {
    if (has(c.gaMeasurementId)) {
      window.gtag("event", "purchase", {
        value: detail.value,
        currency,
        transaction_id: detail.transactionId,
      });
    }
    if (has(c.googleAdsId) && has(c.googleAdsPurchaseLabel)) {
      window.gtag("event", "conversion", {
        send_to: `${c.googleAdsId}/${c.googleAdsPurchaseLabel}`,
        value: detail.value,
        currency,
        transaction_id: detail.transactionId,
      });
    }
  }
  if (typeof window.fbq === "function") {
    window.fbq("track", "Purchase", { value: detail.value, currency });
  }
}
