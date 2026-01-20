import React, { memo } from "react";

/**
 * ProductInfo - Product details display (name, description, specs).
 *
 * UX Fixes:
 * - select-none on specs to prevent accidental text selection
 * - Typographic × (multiplication sign) instead of x
 * - Clean grid alignment for mobile
 */
const ProductInfo = memo(({ product }) => {
  // Format size with proper typography (24x60 → 24 × 60)
  const formattedSize = product.size?.replace(/x/gi, " × ") || product.size;

  return (
    <>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h2>
      <p className="text-gray-600 mb-4 text-sm leading-relaxed">
        {product.description}
      </p>

      {/* Product Specs - non-interactive, prevent selection */}
      <div className="grid grid-cols-2 gap-3 text-sm mb-4 select-none">
        <div className="bg-gray-50 rounded-lg px-3 py-2">
          <span className="block text-gray-400 text-xs uppercase tracking-wide mb-0.5">
            Shape
          </span>
          <span className="text-gray-700 font-medium">{product.shape}</span>
        </div>
        <div className="bg-gray-50 rounded-lg px-3 py-2">
          <span className="block text-gray-400 text-xs uppercase tracking-wide mb-0.5">
            Default Size
          </span>
          <span className="text-gray-700 font-medium">{formattedSize}</span>
        </div>
      </div>

      <hr className="my-3 border-gray-200" />
    </>
  );
});

ProductInfo.displayName = "ProductInfo";

export default ProductInfo;
