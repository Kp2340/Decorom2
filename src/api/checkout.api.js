import apiClient from "./client";

export const processCheckout = async (checkoutData) => {
  return await apiClient.post("/checkout", checkoutData);
};
