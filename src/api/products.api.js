import apiClient from "./client";

export const getProducts = async (
  page = 0,
  size = 12,
  material = "",
  shape = "",
) => {
  let url = `/api/products?page=${page}&size=${size}`;
  if (material) url += `&material=${material}`;
  if (shape) url += `&shape=${shape}`;
  const response = await apiClient.get(url);
  return response;
};

export const getProductById = async (id) => {
  const response = await apiClient.get(`/api/products/${id}`);
  return response;
};
