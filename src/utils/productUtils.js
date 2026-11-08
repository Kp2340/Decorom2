/**
 * A product with `customizable === false` is a fixed SKU — our "best seller" model.
 *
 * It sells for exactly `basePrice` at exactly `defaultSize`: the size is not editable anywhere,
 * the area-based price engine is bypassed, and the backend enforces both in
 * PricingService.resolveGoodsPrice(). Everything else keeps the customisable behaviour.
 *
 * Note the backend field is `customizable`; older payloads may omit it, in which case the
 * product is treated as customisable (the historical default).
 */
export const isFixedPrice = (product) =>
  Boolean(product) && product.customizable === false;

/**
 * The price to display for a product. Fixed SKUs must show `basePrice` verbatim on every
 * surface — the bug that prompted this was the same product showing five different prices
 * because most surfaces recomputed from `defaultSize`.
 */
export const getDisplayPrice = (product, calculatedPrice = 0) => {
  if (!product) return 0;
  if (isFixedPrice(product)) return product.basePrice ?? product.price ?? 0;
  return calculatedPrice > 0 ? calculatedPrice : (product.basePrice ?? product.price ?? 0);
};

/** Parses a stored `defaultSize` such as "24x12" or "24 * 12" into `{ width, height }`. */
export const parseDefaultSize = (sizeStr) => {
  if (!sizeStr || typeof sizeStr !== "string") return { width: 0, height: 0 };
  const match = sizeStr.toLowerCase().match(/(\d+)\s*[x*]\s*(\d+)/);
  if (!match) return { width: 0, height: 0 };
  return { width: Number(match[1]) || 0, height: Number(match[2]) || 0 };
};
