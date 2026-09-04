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

/**
 * Store & LocalBusiness JSON-LD schema for Google AI Overviews & Local Search
 */
export const StoreStructuredData = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": ["Store", "LocalBusiness"],
    "@id": "https://www.decorom.in/#store",
    "name": "Decorom - Premium Custom Nameplates & Home Decor",
    "url": "https://www.decorom.in",
    "logo": "https://www.decorom.in/logo/logo.png",
    "image": "https://www.decorom.in/logo/hero-bg.jpg",
    "description": "Decorom is India's leading manufacturer of handcrafted acrylic, wooden, ACP, LED, and stainless steel door nameplates in Ahmedabad, Gujarat.",
    "telephone": "+91-9016707658",
    "email": "decorom213@gmail.com",
    "priceRange": "₹₹ (₹799 - ₹4999)",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Shop A/7, Second Floor, Shreekunj Shopping Centre, Near HDFC Bank, K.K. Nagar, Ghatlodiya",
      "addressLocality": "Ahmedabad",
      "addressRegion": "Gujarat",
      "postalCode": "380061",
      "addressCountry": "IN",
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "23.0693",
      "longitude": "72.5503",
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        "opens": "09:00",
        "closes": "19:00",
      },
    ],
    "sameAs": [
      "https://www.facebook.com/decoromindia/",
      "https://www.instagram.com/decorom.in/",
    ],
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

/**
 * CollectionPage JSON-LD schema for Google SGE / AI Overviews Category Indexing
 */
export const CollectionPageStructuredData = ({ name, description, url, products = [] }) => {
  if (!name) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": name,
    "description": description || `Browse custom ${name} collection by Decorom.`,
    "url": url || (typeof window !== "undefined" ? window.location.href : "https://www.decorom.in"),
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": products.length,
      "itemListElement": products.slice(0, 12).map((prod, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": prod.name,
        "url": `https://www.decorom.in/product/${prod.id}`,
      })),
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};
