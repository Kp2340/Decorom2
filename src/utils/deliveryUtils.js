import { isFixedPrice } from "./productUtils";

/** Flat delivery charge on fixed-price products. Mirrors PricingService.DELIVERY_CHARGE. */
export const DELIVERY_CHARGE = 150;

export const FREE_DELIVERY_CODE = "FREEDELIVERY";

const IST_OFFSET_MINUTES = 330; // +05:30

/**
 * End of the current day in IST (23:59:59.999), as a Date.
 *
 * Deliberately NOT reusing the END_OF_DAY logic in promoUtils.js: that uses browser-local
 * `setHours`, so a customer outside IST gets their own midnight, and it anchors to a
 * first-visit timestamp in localStorage, so a returning visitor gets a target in the past and
 * the offer silently disappears forever.
 *
 * Used only as a fallback — prefer the server's `deadline` from GET /api/promo/free-delivery so
 * the countdown matches the instant the backend actually enforces.
 */
export const getMidnightIST = (from = Date.now()) => {
  // Shift into IST so the UTC calendar getters read out IST date parts.
  const istNow = new Date(from + IST_OFFSET_MINUTES * 60000);
  const endOfIstDayUtcMs =
    Date.UTC(
      istNow.getUTCFullYear(),
      istNow.getUTCMonth(),
      istNow.getUTCDate(),
      23, 59, 59, 999
    ) - IST_OFFSET_MINUTES * 60000;
  return new Date(endOfIstDayUtcMs);
};

/** Whether the free-delivery offer is still open, per the local IST clock. */
export const isFreeDeliveryOpen = (from = Date.now()) =>
  from <= getMidnightIST(from).getTime();

/**
 * Price breakdown for a product.
 *
 * Mirrors the backend assembly in CheckoutController: subtotal = goods + delivery, and the
 * waiver is a discount against that subtotal — which is why `total` equals the goods price
 * when the offer is open.
 */
export const getDeliveryLines = (product, goodsPrice, offerActive = true) => {
  const charge = isFixedPrice(product) ? DELIVERY_CHARGE : 0;
  const waived = charge > 0 && offerActive;
  const discount = waived ? charge : 0;

  return {
    goodsPrice,
    charge,
    waived,
    discount,
    subtotal: goodsPrice + charge,
    total: goodsPrice + charge - discount,
    appliesDelivery: charge > 0,
  };
};

/** "02:14:07" from a millisecond remainder. */
export const formatCountdown = (ms) => {
  if (!ms || ms <= 0) return "00:00:00";
  const total = Math.floor(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
};
