import React, { useMemo } from "react";
import ImageCarousel from "./ImageCarousel";
import { PLACEHOLDER_IMAGE, toImageUrls } from "../utils/imageUtils";

/**
 * ProductImageCarousel
 * - Input: backend `images` array: [{ id, imageUrl, sortOrder }]
 * - Sort by sortOrder
 * - If empty, show placeholder
 */
const ProductImageCarousel = ({ images }) => {
  const urls = useMemo(() => {
    const normalized = toImageUrls(images);
    return normalized.length > 0 ? normalized : [PLACEHOLDER_IMAGE];
  }, [images]);

  return <ImageCarousel images={urls} />;
};

export default ProductImageCarousel;
