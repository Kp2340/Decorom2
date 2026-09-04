import React from "react";
import { Helmet } from "react-helmet-async";

/**
 * FAQPage JSON-LD schema for AEO (Answer Engine Optimization)
 */
export const FAQStructuredData = ({ faqs }) => {
  if (!faqs || !Array.isArray(faqs) || faqs.length === 0) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((item) => ({
      "@type": "Question",
      "name": item.q || item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.a || item.answer,
      },
    })),
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

/**
 * Product JSON-LD schema for Google Shopping & Rich Snippets
 */
export const ProductStructuredData = ({ product }) => {
  if (!product) return null;

  const price = product.basePrice ?? product.price ?? 999;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name || "Custom Nameplate",
    "image": product.images || [product.image || "https://www.decorom.in/logo/logo.png"],
    "description": product.description || `Custom ${product.name} handcrafted by Decorom in Ahmedabad, Gujarat.`,
    "sku": `DEC-${product.id}`,
    "brand": {
      "@type": "Brand",
      "name": "Decorom",
    },
    "offers": {
      "@type": "Offer",
      "url": typeof window !== "undefined" ? window.location.href : "https://www.decorom.in",
      "priceCurrency": "INR",
      "price": price,
      "priceValidUntil": "2027-12-31",
      "itemCondition": "https://schema.org/NewCondition",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "Decorom",
      },
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

/**
 * BreadcrumbList JSON-LD schema for Google SERP Navigation Hierarchy
 */
export const BreadcrumbStructuredData = ({ items }) => {
  if (!items || items.length === 0) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url,
    })),
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};
