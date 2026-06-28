import apiClient from "./client";

export const validatePromoCode = async (promoCode, orderTotal) => {
  const response = await apiClient.post("/api/promo/validate", { promoCode, orderTotal });
  return response;
};
