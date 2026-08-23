import React, { useEffect } from "react";

/**
 * GTMAnalytics component for deferred GTM / GA4 integration.
 * Injects GTM script asynchronously if VITE_GTM_ID env parameter is provided.
 */
const GTMAnalytics = () => {
  useEffect(() => {
    const gtmId = import.meta.env.VITE_GTM_ID;
    if (!gtmId) return;

    // Check if script is already added
    if (document.getElementById("gtm-script")) return;

    const script = document.createElement("script");
    script.id = "gtm-script";
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`;
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
