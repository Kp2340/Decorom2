import React, { useEffect, useMemo, useState } from "react";

/**
 * ProductPriceCalculator
 *
 * Rules:
 * - Uses ONLY backend data (basePrice, defaultSize) as the starting point
 * - Parses defaultSize (e.g. "48*12" or "48x12") into width × height
 * - Any calculation starts from basePrice and scales with area
 * - No hardcoded product prices
 */
const parseSize = (sizeStr) => {
  if (!sizeStr || typeof sizeStr !== "string") {
    return { width: 0, height: 0 };
  }

  const match = sizeStr.toLowerCase().match(/(\d+)\s*[x\*]\s*(\d+)/);
  if (!match) {
    return { width: 0, height: 0 };
  }

  return {
    width: Number(match[1]) || 0,
    height: Number(match[2]) || 0,
  };
};

const ProductPriceCalculator = ({ product, onChange }) => {
  const { basePrice = 0, defaultSize } = product || {};

  const defaultDims = useMemo(() => parseSize(defaultSize), [defaultSize]);

  const [width, setWidth] = useState(defaultDims.width || 0);
  const [height, setHeight] = useState(defaultDims.height || 0);
  const [finalPrice, setFinalPrice] = useState(basePrice || 0);

  // Keep local inputs in sync if backend default size changes
  useEffect(() => {
    setWidth(defaultDims.width || 0);
    setHeight(defaultDims.height || 0);
  }, [defaultDims.width, defaultDims.height]);

  useEffect(() => {
    const w = Number(width) || 0;
    const h = Number(height) || 0;
    const isValid = w > 0 && h > 0 && basePrice > 0;

    const defaultArea =
      (defaultDims.width || 0) * (defaultDims.height || 0) || 1;
    const currentArea = w * h || defaultArea;

    const multiplier = currentArea / defaultArea;
    const calculated = Math.round((basePrice || 0) * multiplier);

    setFinalPrice(calculated);

    if (onChange) {
      onChange({
        width: w,
        height: h,
        price: calculated,
        isValid,
      });
    }
  }, [
    width,
    height,
    basePrice,
    defaultDims.width,
    defaultDims.height,
    onChange,
  ]);

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
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            className="w-full border rounded px-2 py-1 border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>
      </div>

      <div className="space-y-1 text-sm text-gray-600 mb-3">
        <p>
          <span className="font-medium">Default Size:</span>{" "}
          {defaultSize || "Not specified"}
        </p>
        <p>
          <span className="font-medium">Base Price:</span> ₹{basePrice || 0}
        </p>
      </div>

      <div className="flex items-center justify-between border-t pt-3">
        <span className="text-gray-600">Calculated Price:</span>
        <span className="text-2xl font-bold text-pink-600">
          ₹{finalPrice || 0}
        </span>
      </div>
    </div>
  );
};

export default ProductPriceCalculator;
