import { PROMO_CODES, PROMO_PRIORITY } from "../config/promos";

const FIRST_VISIT_KEY = "decorom_first_visit_ts";
const IS_RETURNING_KEY = "decorom_is_returning";

// Call once when user lands on the site (e.g. in Checkout mount)
export function initFirstVisit() {
  if (!localStorage.getItem(FIRST_VISIT_KEY)) {
    localStorage.setItem(FIRST_VISIT_KEY, Date.now().toString());
  }
}

export function isNewUser() {
  return localStorage.getItem(IS_RETURNING_KEY) !== "true";
}

// Call from PaymentSuccess after confirmed payment
export function markUserAsReturning() {
  localStorage.setItem(IS_RETURNING_KEY, "true");
}

// Returns a Date representing when the promo expires, or null if it never expires
export function getCountdownTarget(code) {
  const promo = PROMO_CODES[code];
  if (!promo) return null;

  if (promo.expiryMode === "END_OF_DAY") {
    const firstVisitTs = parseInt(localStorage.getItem(FIRST_VISIT_KEY) || Date.now().toString(), 10);
    const visitDate = new Date(firstVisitTs);
    visitDate.setHours(23, 59, 59, 999);
    return visitDate;
  }

  if (promo.expiryMode === "FIXED_DATE" && promo.expiryDate) {
    return new Date(promo.expiryDate);
  }

  return null;
}

export function isWithinPromoWindow(code) {
  const target = getCountdownTarget(code);
  if (!target) return true;
  return new Date() < target;
}

// Returns the best eligible promo code string for the current user + order total, or null
export function getEligiblePromo(orderTotal) {
  const newUser = isNewUser();
  for (const code of PROMO_PRIORITY) {
    const promo = PROMO_CODES[code];
    if (!promo || !promo.isActive) continue;
    if (!isWithinPromoWindow(code)) continue;
    if (orderTotal < promo.minOrderAmount) continue;

    if (promo.eligibility === "NEW_USER" || promo.eligibility === "NEW_USER_TIMED") {
      if (!newUser) continue;
    }

    return code;
  }
  return null;
}

// Returns all promo codes visible as cards to the current user (regardless of minOrder)
export function getVisiblePromos() {
  const newUser = isNewUser();
  return PROMO_PRIORITY.filter((code) => {
    const promo = PROMO_CODES[code];
    if (!promo || !promo.isActive) return false;
    if (!isWithinPromoWindow(code)) return false;

    if (promo.eligibility === "NEW_USER" || promo.eligibility === "NEW_USER_TIMED") {
      return newUser;
    }
    return true;
  });
}

// Compute frontend discount amount — mirrors backend PromoService logic
export function calculateDiscount(promoCode, basePrice) {
  const promo = PROMO_CODES[promoCode];
  if (!promo) return { discountAmount: 0, finalPrice: basePrice };

  let discountAmount = 0;
  if (promo.type === "FLAT") {
    discountAmount = promo.value;
  } else if (promo.type === "PERCENT") {
    discountAmount = Math.round((basePrice * promo.value) / 100);
  }

  discountAmount = Math.min(discountAmount, basePrice);
  const finalPrice = parseFloat((basePrice - discountAmount).toFixed(2));
  return { discountAmount, finalPrice };
}
