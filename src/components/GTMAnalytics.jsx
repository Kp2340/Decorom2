import React, { useEffect } from "react";

/**
 * GTMAnalytics component for deferred GTM / GA4 integration.
 * Injects GTM script asynchronously if VITE_GTM_ID env parameter is provided.
 */
const GTMAnalytics = () => {
  useEffect(() => {
    const trackingId = import.meta.env.VITE_GA_ID;
    if (!trackingId) return;

    // GA4 Measurement ID (starts with G-)
    if (trackingId.startsWith("G-")) {
      if (document.getElementById("ga4-script")) return;

      const script = document.createElement("script");
      script.id = "ga4-script";
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      function gtag() {
        window.dataLayer.push(arguments);
      }
      window.gtag = gtag;
      gtag("js", new Date());
      gtag("config", trackingId, {
        page_path: window.location.pathname,
        anonymize_ip: true,
      });
      return;
    }

    // Google Tag Manager Container ID (starts with GTM-)
    if (document.getElementById("gtm-script")) return;

    const script = document.createElement("script");
    script.id = "gtm-script";
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${trackingId}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      "gtm.start": new Date().getTime(),
      event: "gtm.js",
    });
  }, []);

  return null;
};

export default GTMAnalytics;
