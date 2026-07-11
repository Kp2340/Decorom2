import React, { memo } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import {
  BLUR_PLACEHOLDER,
  PLACEHOLDER_IMAGE,
  responsiveImageProps,
} from "../../utils/imageUtils";

/**
 * Gallery - Product image gallery with main image and thumbnails.
 * Extracted from ProductDetailsModal for better separation of concerns.
 *
 * Props:
 * - images: Array of image URLs
 * - selectedImage: Currently selected image URL
 * - onSelectImage: Callback when thumbnail is clicked
 * - productName: Alt text for images
 */
const Gallery = memo(
  ({ images, selectedImage, onSelectImage, productName }) => {
    const current = selectedImage || images?.[0] || PLACEHOLDER_IMAGE;
    const { src, srcSet, sizes } = responsiveImageProps(current);

    return (
      <div className="w-full md:w-1/2 p-4 md:p-6 bg-gray-50 flex flex-col items-center">
        {/* Main Image */}
        <div className="w-full aspect-square bg-white rounded-2xl shadow-sm overflow-hidden mb-4 relative">
          <LazyLoadImage
            src={src}
            srcSet={srcSet}
            sizes={sizes}
            placeholderSrc={BLUR_PLACEHOLDER}
            alt={productName}
            decoding="async"
            className="w-full h-full object-contain transition-transform duration-500"
            effect="blur"
          />
        </div>

        {/* Thumbnails Strip */}
        {images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto w-full py-2 px-1 scrollbar-hide">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => onSelectImage(img)}
                className={`w-16 h-16 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                  selectedImage === img
                    ? "border-pink-500 scale-105"
                    : "border-gray-200 hover:border-pink-300"
                }`}
              >
                <LazyLoadImage
                  src={img}
                  placeholderSrc={BLUR_PLACEHOLDER}
                  alt={`View ${idx + 1}`}
                  decoding="async"
                  className="w-full h-full object-cover"
                  effect="blur"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    );
  },
);

Gallery.displayName = "Gallery";

export default Gallery;
