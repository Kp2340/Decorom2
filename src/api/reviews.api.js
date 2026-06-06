import apiClient from "./client";

export const getReviews = async () => {
  return await apiClient.get("/api/reviews");
};

export const createReview = async (review) => {
  return await apiClient.post("/api/admin/reviews", review);
};

export const deleteReview = async (id) => {
  return await apiClient.delete(`/api/admin/reviews/${id}`);
};
