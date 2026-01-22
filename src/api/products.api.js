import apiClient from "./client";

export const getProducts = async (page = 0, size = 12) => {
  const response = await apiClient.get(`/api/products?page=${page}&size=${size}`);
  return response;
};

export const getProductById = async (id) => {
  const response = await apiClient.get(`/api/products/${id}`);
  return response;
};
