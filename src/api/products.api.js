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

export const getFeaturedProducts = async () => {
  const response = await apiClient.get("/api/products/featured");
  return response;
};

// Fetches the full catalog in one request for client-side search/filter/wishlist
// lookups. Reuses the existing paginated endpoint with a large size — relies on
// the backend's existing 10-min product-list cache, no new endpoint needed.
export const getAllProductsForSearch = async () => {
  const data = await getProducts(0, 300);
  return data?.content ?? (Array.isArray(data) ? data : []);
};
