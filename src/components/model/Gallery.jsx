import React, { memo } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

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
    return (
      <div className="w-full md:w-1/2 p-6 bg-gray-50 flex flex-col items-center">
        {/* Main Image */}
        <div className="w-full aspect-square bg-white rounded-lg shadow-sm overflow-hidden mb-4 relative">
          <LazyLoadImage
            src={selectedImage}
            alt={productName}
            decoding="async"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Thumbnails Strip */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto w-full py-2 px-1 scrollbar-hide">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => onSelectImage(img)}
                className={`w-16 h-16 rounded-md overflow-hidden border-2 flex-shrink-0 transition-all ${
                  selectedImage === img
                    ? "border-pink-500 scale-105"
                    : "border-gray-200 hover:border-pink-300"
                }`}
              >
                <LazyLoadImage
                  src={img}
                  alt={`View ${idx + 1}`}
                  decoding="async"
                  className="w-full h-full object-cover"
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
