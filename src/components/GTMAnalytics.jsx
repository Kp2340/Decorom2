import React, { useEffect } from "react";

/**
 * GTMAnalytics component for deferred GTM / GA4 integration.
 * Defers analytics until after initial load and idle or user interaction
 * to ensure 0 main-thread blocking during critical rendering.
 */
const GTMAnalytics = () => {
  useEffect(() => {
    const trackingId = import.meta.env.VITE_GA_ID;
    if (!trackingId) return;

    const initTracker = () => {
      if (window._gtmInitialized) return;
      window._gtmInitialized = true;

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
    };

    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(() => setTimeout(initTracker, 2000));
    } else {
      setTimeout(initTracker, 3000);
    }

    const events = ["scroll", "touchstart", "mousemove", "keydown"];
    const triggerNow = () => {
      initTracker();
      events.forEach((e) => window.removeEventListener(e, triggerNow));
    };
    events.forEach((e) => window.addEventListener(e, triggerNow, { once: true, passive: true }));

    return () => {
      events.forEach((e) => window.removeEventListener(e, triggerNow));
    };
  }, []);

  return null;
};

export default GTMAnalytics;
