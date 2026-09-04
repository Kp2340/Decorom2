import React, { useEffect, useMemo, useState } from "react";
import { calculateFinalPrice } from "../utils/pricingUtils";
import { isFixedPrice, parseDefaultSize as parseSize } from "../utils/productUtils";
import FreeDeliveryBanner from "./FreeDeliveryBanner";

/**
 * ProductPriceCalculator
 *
 * Rules:
 * - Uses ONLY backend data (basePrice, defaultSize) as the starting point
 * - Mirrors backend Tiered Pricing Logic from PricingService.java
 * - No hardcoded product prices
 *
 * Fixed-price products (customizable === false) bypass all of that: they sell for exactly
 * basePrice at exactly defaultSize, so the size inputs and add-on toggles are replaced with a
 * read-only summary. The backend enforces the same in PricingService.resolveGoodsPrice(), so a
 * crafted request cannot buy a best seller at a different size.
 */
const ProductPriceCalculator = ({ product, onChange, externalDimensions = null }) => {
  const { basePrice = 0, defaultSize, material = "" } = product || {};
  const fixed = isFixedPrice(product);

  const defaultDims = useMemo(() => parseSize(defaultSize), [defaultSize]);

  const [width, setWidth] = useState(defaultDims.width || 0);
  const [height, setHeight] = useState(defaultDims.height || 0);
  const [withLighting, setWithLighting] = useState(false);
  const [withFitting, setWithFitting] = useState(false);
  const [finalPrice, setFinalPrice] = useState(basePrice || 0);

  // Keep local inputs in sync if backend default size changes.
  // Also reset add-on flags so selections don't carry over between products.
  useEffect(() => {
    setWidth(defaultDims.width || 0);
    setHeight(defaultDims.height || 0);
    setWithLighting(false);
    setWithFitting(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id]);

  // When a live nameplate editor drives dimensions (e.g. resizing the preview),
  // keep the calculator's width/height in sync so price stays authoritative.
  // Ignored for fixed SKUs — their size is not negotiable.
  useEffect(() => {
    if (fixed) return;
    if (externalDimensions?.width && externalDimensions?.height) {
      setWidth(externalDimensions.width);
      setHeight(externalDimensions.height);
    }
  }, [externalDimensions, fixed]);

  useEffect(() => {
    // Fixed SKU: report the configured price and size, never a computed one.
    if (fixed) {
      const w = defaultDims.width || 0;
      const h = defaultDims.height || 0;

      setFinalPrice(basePrice);

      if (onChange) {
        onChange({
          width: w,
          height: h,
          price: basePrice,
          withLighting: false,
          withFitting: false,
          material,
          totalSqInch: w * h,
          isValid: basePrice > 0,
          fixedPrice: true,
        });
      }
      return;
    }

    const w = Number(width) || 0;
    const h = Number(height) || 0;

    // Calculate price using synchronized utility
    const calculated = calculateFinalPrice(material, w, h, withLighting, withFitting);

    // New Range: 1x1 to 96x96
    const isValid = w >= 1 && w <= 96 && h >= 1 && h <= 96 && calculated > 0;

    setFinalPrice(calculated);

    if (onChange) {
      onChange({
        width: w,
        height: h,
        price: calculated,
        withLighting,
        withFitting,
        material,
        totalSqInch: w * h,
        isValid,
        fixedPrice: false,
      });
    }
  }, [
    fixed,
    basePrice,
    defaultDims,
    width,
    height,
    withLighting,
    withFitting,
    material,
    onChange,
  ]);

  // Fixed SKU: one price, one size, nothing to configure.
  if (fixed) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-4">
        <h4 className="text-lg font-semibold mb-3 text-gray-800">Best Seller — Fixed Price</h4>

        <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2 mb-3">
          <span className="text-sm font-medium text-gray-600">Size</span>
          <span className="text-sm font-bold text-gray-900">
            {defaultDims.height || "?"}" × {defaultDims.width || "?"}"
          </span>
        </div>

        <p className="mb-3 text-[11px] font-medium uppercase tracking-tight text-gray-500">
          This best seller ships in one standard size at a fixed price.
        </p>

        <FreeDeliveryBanner variant="inline" className="mb-3" />

        <div className="flex items-center justify-between border-t pt-3">
          <span className="font-medium text-gray-600">Price:</span>
          <div className="text-right">
            <span className="text-2xl font-bold text-pink-600">
              ₹{Number(basePrice).toLocaleString()}
            </span>
            <p className="text-[10px] text-gray-400">Inclusive of all taxes</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-4">
      <h4 className="text-lg font-semibold mb-3 text-gray-800">
        Price Calculator
      </h4>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Height (inch)
          </label>
          <input
            type="number"
            min="1"
            max="96"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="w-full border rounded px-2 py-1 border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Width (inch)
          </label>
          <input
            type="number"
            min="1"
            max="96"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            className="w-full border rounded px-2 py-1 border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>
      </div>

      <div className="space-y-3 border-t pt-3 mb-4">
        <label className="flex items-center space-x-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={withLighting}
            onChange={(e) => setWithLighting(e.target.checked)}
            className="w-4 h-4 rounded text-pink-600 focus:ring-pink-500"
          />
          <span className="text-sm text-gray-700 font-medium group-hover:text-black">
            Include LED Lighting (Front/Back)
          </span>
        </label>

        <label className="flex items-center space-x-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={withFitting}
            onChange={(e) => setWithFitting(e.target.checked)}
            className="w-4 h-4 rounded text-pink-600 focus:ring-pink-500"
          />
          <span className="text-sm text-gray-700 font-medium group-hover:text-black">
            Professional Installation (+₹500)
          </span>
        </label>
      </div>

      <div className="space-y-1 text-[10px] text-gray-500 uppercase tracking-tight mb-3">
        <p>Min: 1x1" | Max: 96x96"</p>
        <p>Material: {material || "Standard"}</p>
      </div>

      <div className="flex items-center justify-between border-t pt-3">
        <span className="text-gray-600 font-medium">Total Price:</span>
        <div className="text-right">
          <span className="text-2xl font-bold text-pink-600">
            ₹{finalPrice.toLocaleString()}
          </span>
          <p className="text-[10px] text-gray-400">✓ Inclusive of all taxes</p>
        </div>
      </div>
    </div>
  );
};

export default ProductPriceCalculator;
