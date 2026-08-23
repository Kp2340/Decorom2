import apiClient from "./client";

export const loginAdmin = async (email, password) => {
  const response = await apiClient.post("/api/admin/login", {
    email,
    password,
  });
  return response;
};

// formData should be FormData with:
// - data: JSON string of ProductCreateRequest
// - images: one or more image files
export const createProduct = async (formData) => {
  const response = await apiClient.post("/api/admin/products", formData);
  return response;
};

export const updateProduct = async (id, formData) => {
  const response = await apiClient.put(`/api/admin/products/${id}`, formData);
  return response;
};

export const deleteProduct = async (id) => {
  const response = await apiClient.delete(`/api/admin/products/${id}`);
  return response;
};

export const addProductImages = async (productId, formData) => {
  // formData should contain image files with field name "images"
  const response = await apiClient.post(
    `/api/admin/products/${productId}/images`,
    formData,
    {
      headers: {
        // Don't set Content-Type - let axios/browser set it for multipart/form-data
      },
    },
  );
  return response;
};

export const deleteProductImage = async (productId, imageId) => {
  const response = await apiClient.delete(
    `/api/admin/products/${productId}/images/${imageId}`,
  );
  return response;
};

export const reorderProductImages = async (productId, imageIdsInOrder) => {
  const response = await apiClient.put(
    `/api/admin/products/${productId}/images/reorder`,
    imageIdsInOrder,
  );
  return response;
};
