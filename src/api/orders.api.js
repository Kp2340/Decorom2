import apiClient from "./client";

export const submitCustomInquiry = (formData) =>
  apiClient.post("/api/orders/custom-inquiry", formData);

export const getPublicOrder = (orderId) =>
  apiClient.get(`/api/orders/public/${orderId}`);

export const initiatePayment = (orderId, stage) =>
  apiClient.post(`/api/orders/public/initiate-payment/${orderId}?stage=${stage}`);
