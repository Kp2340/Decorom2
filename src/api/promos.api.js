import apiClient from "./client";

export const validatePromoCode = async (promoCode, orderTotal) => {
  const response = await apiClient.post("/api/promo/validate", { promoCode, orderTotal });
  return response;
};

/**
 * Current state of the free-delivery offer for fixed-price products.
 * Returns { code, active, deliveryCharge, deadline } where deadline is an ISO offset string.
 */
export const getFreeDeliveryOffer = async () => {
  const response = await apiClient.get("/api/promo/free-delivery");
  return response;
};
