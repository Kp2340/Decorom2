import React, { useMemo } from "react";
import ImageCarousel from "./ImageCarousel";

const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-family='Arial' font-size='24'%3ENo Image%3C/text%3E%3C/svg%3E";

/**
 * ProductImageCarousel
 * - Input: backend `images` array: [{ id, imageUrl, sortOrder }]
 * - Sort by sortOrder
 * - If empty, show placeholder
 */
const ProductImageCarousel = ({ images }) => {
  const urls = useMemo(() => {
    const arr = Array.isArray(images) ? images : [];
    const sorted = [...arr].sort((a, b) => (a?.sortOrder ?? 0) - (b?.sortOrder ?? 0));
    const mapped = sorted
      .map((x) => x?.imageUrl)
      .filter((u) => typeof u === "string" && u.length > 0);
    return mapped.length > 0 ? mapped : [PLACEHOLDER];
  }, [images]);

  return <ImageCarousel images={urls} />;
};

export default ProductImageCarousel;

