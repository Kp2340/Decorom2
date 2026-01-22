import React, { memo } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

/**
 * ProductCard - Displays a single product in the gallery grid.
 * Wrapped with React.memo to prevent re-renders when product prop is unchanged.
 *
 * Image Memory Note:
 * Even with lazy loading, decoded images consume memory (4 bytes/pixel).
 * A 1000x1000 image = 4MB in memory regardless of file size.
 * decoding="async" offloads decoding from main thread.
 *
 * TODO: Replace src with CDN URL helper when available for responsive images.
 */
const ProductCard = memo(({ product, onClick }) => {
  // Handle image: use thumbnailUrl from backend, fallback to link for backwards compatibility
  const imageSrc =
    product.thumbnailUrl ||
    (Array.isArray(product.link) ? product.link[0] : product.link);

  return (
    <div
      className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col cursor-pointer group"
      onClick={() => onClick(product)}
    >
      {/* Image Container - Fixed aspect ratio prevents layout shift */}
      <div className="relative w-full" style={{ paddingBottom: "100%" }}>
        <LazyLoadImage
          src={imageSrc}
          alt={product.name}
          decoding="async"
          className="absolute inset-0 w-full h-full object-contain bg-gray-100 group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
          {product.name}
        </h3>
        <div className="text-gray-600 text-sm mb-4 space-y-1">
          {product.material && <p>Material: {product.material}</p>}
          {product.shape && <p>Shape: {product.shape}</p>}
          {(product.defaultSize || product.size) && (
            <p>Size: {product.defaultSize || product.size}</p>
          )}
        </div>

        <p className="text-pink-600 font-bold text-lg mb-3">
          ₹{product.basePrice || product.price}
        </p>

        <button className="mt-auto bg-green-500 hover:bg-green-600 text-white font-medium py-2 rounded-md transition-colors w-full">
          View Details
        </button>
      </div>
    </div>
  );
});

ProductCard.displayName = "ProductCard";

export default ProductCard;
