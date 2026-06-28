// Promo code definitions — keep in sync with backend PromoService.java
// To add a seasonal offer: add an entry here + set isActive: true
// To disable: set isActive: false

export const PROMO_CODES = {
  NEW500: {
    code: "NEW500",
    type: "FLAT",
    value: 500,
    minOrderAmount: 2500,
    eligibility: "NEW_USER_TIMED",
    expiryMode: "END_OF_DAY",
    isActive: true,
    label: "New Visit Offer",
    description: "₹500 off your first order above ₹2,500. Valid till midnight today!",
    badgeColor: "green",
    icon: "🎁",
  },
  FIRST10: {
    code: "FIRST10",
    type: "PERCENT",
    value: 10,
    minOrderAmount: 0,
    eligibility: "NEW_USER",
    expiryMode: "NONE",
    isActive: true,
    label: "First Order Discount",
    description: "10% off on your very first order. No minimum order value.",
    badgeColor: "blue",
    icon: "🌟",
  },
  DIWALI26: {
    code: "DIWALI26",
    type: "PERCENT",
    value: 26,
    minOrderAmount: 0,
    eligibility: "ALL",
    expiryMode: "FIXED_DATE",
    expiryDate: "2026-10-25T23:59:59",
    isActive: false, // Toggle to true during Diwali season
    label: "Diwali Dhamaka Offer",
    description: "26% off sitewide! Limited time Diwali special offer.",
    badgeColor: "orange",
    icon: "🪔",
  },
};

// Priority order for auto-apply (highest priority first)
export const PROMO_PRIORITY = ["NEW500", "DIWALI26", "FIRST10"];
