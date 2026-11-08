import React, { useMemo } from "react";
import ImageCarousel from "./ImageCarousel";
import { PLACEHOLDER_IMAGE, toImageUrls } from "../utils/imageUtils";

/**
 * ProductImageCarousel
 * - Inputs:
 *   - `images`: backend image array [{ id, imageUrl, sortOrder }] or string URLs
 *   - `videoUrl`: optional video URL for video-first presentation
 * - Sorts images and mounts ImageCarousel with video-first hero slot
 */
const ProductImageCarousel = ({ images, videoUrl = null }) => {
  const urls = useMemo(() => {
    const normalized = toImageUrls(images);
    return normalized.length > 0 ? normalized : [PLACEHOLDER_IMAGE];
  }, [images]);

  return <ImageCarousel images={urls} videoUrl={videoUrl} />;
};

export default ProductImageCarousel;
