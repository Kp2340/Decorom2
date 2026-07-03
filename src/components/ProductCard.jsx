import React, { memo, useMemo } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import {
  BLUR_PLACEHOLDER,
  PLACEHOLDER_IMAGE,
  responsiveImageProps,
  toImageUrls,
} from "../utils/imageUtils";

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
import { calculateFinalPrice } from "../utils/pricingUtils";

const parseSize = (sizeStr) => {
  if (!sizeStr || typeof sizeStr !== "string") return { w: 0, h: 0 };
  const match = sizeStr.toLowerCase().match(/(\d+(?:\.\d+)?)\s*[x*]\s*(\d+(?:\.\d+)?)/);
  return match ? { w: parseFloat(match[1]), h: parseFloat(match[2]) } : { w: 0, h: 0 };
};

const ProductCard = memo(({ product, onClick }) => {
  const { w, h } = useMemo(() => parseSize(product.defaultSize || product.size), [product]);
  const calculatedPrice = useMemo(() => {
    return calculateFinalPrice(product.material, w, h);
  }, [product.material, w, h]);

  const displayPrice = calculatedPrice > 0 ? calculatedPrice : (product.basePrice || product.price || 0);

  
  const primaryImage = useMemo(() => {
    const urls = toImageUrls(product);
    return urls[0] || PLACEHOLDER_IMAGE;
  }, [product]);


  const { src, srcSet, sizes } = useMemo(
    () => responsiveImageProps(primaryImage),
    [primaryImage],
  );

  return (
    <div
      className="bg-white rounded-xl shadow-sm hover:shadow-lg border border-gray-100 transition-all duration-300 overflow-hidden flex flex-col cursor-pointer group focus:outline-none focus:ring-2 focus:ring-pink-400 h-full"
      onClick={() => onClick(product)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick(product);
        }
      }}
      tabIndex={0}
    >
      {/* Image Container - Fixed aspect ratio prevents layout shift */}
      <div className="relative w-full aspect-[3/4] bg-gray-100">
        <LazyLoadImage
          src={src}
          srcSet={srcSet}
          sizes={sizes}
          placeholderSrc={BLUR_PLACEHOLDER}
          alt={product.name}
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Product Info */}
      <div className="p-3 sm:p-4 flex flex-col flex-1 gap-2">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 leading-snug line-clamp-2">
          {product.name}
        </h3>
        {/* flex-1 pushes price + button to the bottom, aligning all cards in a row */}
        <div className="text-gray-600 text-xs sm:text-sm space-y-0.5 flex-1">
          {product.material && <p>Material: {product.material}</p>}
          {product.shape && <p>Shape: {product.shape}</p>}
          {(product.defaultSize || product.size) && (
            <p>Size: {product.defaultSize || product.size}</p>
          )}
        </div>

        <p className="text-pink-600 font-bold text-lg sm:text-xl">
          ₹{displayPrice.toLocaleString()}
        </p>

        <button className="bg-black text-white font-semibold py-2.5 rounded-lg transition-transform duration-300 hover:-translate-y-0.5 active:scale-95">
          View Details
        </button>
      </div>
    </div>
  );
});

ProductCard.displayName = "ProductCard";

export default ProductCard;
