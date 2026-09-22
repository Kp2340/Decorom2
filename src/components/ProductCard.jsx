import React, { memo, useMemo } from "react";
import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Heart } from "lucide-react";
import {
  BLUR_PLACEHOLDER,
  PLACEHOLDER_IMAGE,
  responsiveImageProps,
  toImageUrls,
} from "../utils/imageUtils";
import { useWishlist } from "../wishlist/WishlistContext";
import { BEST_SELLER_IDS } from "../config/bestSellers";

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
import { isFixedPrice, getDisplayPrice } from "../utils/productUtils";

const parseSize = (sizeStr) => {
  if (!sizeStr || typeof sizeStr !== "string") return { w: 0, h: 0 };
  const match = sizeStr.toLowerCase().match(/(\d+(?:\.\d+)?)\s*[x*]\s*(\d+(?:\.\d+)?)/);
  return match ? { w: parseFloat(match[1]), h: parseFloat(match[2]) } : { w: 0, h: 0 };
};

const ProductCard = memo(({ product, onClick }) => {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(product.id);
  const isBestSeller = BEST_SELLER_IDS.includes(product.id);
  const isLed = Boolean(product.hasLight);
  const fixedPrice = isFixedPrice(product);
  const { w, h } = useMemo(() => parseSize(product.defaultSize || product.size), [product]);
  const calculatedPrice = useMemo(() => {
    // A fixed SKU is never priced by area — computing it here is what made this card disagree
    // with the product page for the same product.
    if (fixedPrice) return 0;
    return calculateFinalPrice(product.material, w, h);
  }, [fixedPrice, product.material, w, h]);

  const displayPrice = getDisplayPrice(product, calculatedPrice);

  
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
      className="bg-white rounded-xl shadow-xs border border-slate-200 product-card-lift overflow-hidden flex flex-col cursor-pointer group focus:outline-none focus:ring-2 focus:ring-[#E59500] h-full"
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
      <div className="relative w-full aspect-[3/4] bg-slate-100 overflow-hidden">
        <Link
          to={`/products/${product.id}`}
          onClick={(e) => {
            if (onClick) {
              e.preventDefault();
              onClick(product);
            }
          }}
          tabIndex={-1}
          aria-hidden="true"
          className="block w-full h-full"
        >
          <LazyLoadImage
            src={src}
            srcSet={srcSet}
            sizes={sizes}
            placeholderSrc={BLUR_PLACEHOLDER}
            alt={product.name}
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {(isBestSeller || isLed) && (
          <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1">
            {isBestSeller && (
              <span className="px-2 py-0.5 rounded-md bg-[#E59500] text-white text-[10px] font-bold uppercase tracking-wider shadow-xs">
                Best Seller
              </span>
            )}
            {isLed && (
              <span className="px-2 py-0.5 rounded-md bg-cyan-950/90 text-cyan-200 border border-cyan-400/30 text-[10px] font-bold uppercase tracking-wider shadow-xs flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                LED Backlit
              </span>
            )}
          </div>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={wishlisted}
          className="absolute top-2.5 right-2.5 z-10 p-2 rounded-full bg-white/95 backdrop-blur-xs shadow-xs hover:bg-white text-slate-400 hover:text-[#E59500] transition-colors cursor-pointer"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${wishlisted ? "fill-[#E59500] text-[#E59500]" : "currentColor"}`}
          />
        </button>
      </div>

      {/* Product Info — Flipkart-Style Hierarchy: Price TOP, Name, Specs, Reviews, CTA */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 gap-1.5">
        {/* Dominant Price at Top */}
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-xl sm:text-2xl font-bold text-[#2C3E50] tracking-tight">
            ₹{displayPrice.toLocaleString("en-IN")}
          </span>
        </div>

        {/* Product Name */}
        <h3 className="text-sm sm:text-base font-semibold text-[#2C3E50] leading-snug line-clamp-2 min-h-[2.5rem] group-hover:text-[#E59500] transition-colors">
          <Link
            to={`/products/${product.id}`}
            onClick={(e) => {
              if (onClick) {
                e.preventDefault();
                onClick(product);
              }
            }}
          >
            {product.name}
          </Link>
        </h3>

        {/* Specs/Customization Type */}
        <div className="text-xs text-[#334155] space-y-0.5 flex-1">
          {product.material && <p className="truncate"><span className="text-slate-400">Material:</span> {product.material}</p>}
          {(product.defaultSize || product.size) && (
            <p className="truncate"><span className="text-slate-400">Size:</span> {product.defaultSize || product.size}"</p>
          )}
        </div>

        {/* Primary CTA Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClick(product);
          }}
          className="mt-auto pt-2 w-full bg-white hover:bg-[#E59500] text-[#E59500] hover:text-white border border-[#E59500] font-semibold text-xs sm:text-sm py-2.5 px-3 rounded-lg shadow-xs transition-all duration-200 text-center cursor-pointer"
        >
          Order Now
        </button>
      </div>
    </div>
  );
});

ProductCard.displayName = "ProductCard";

export default ProductCard;
