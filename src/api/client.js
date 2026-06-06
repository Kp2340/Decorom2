import axios from "axios";

const BASE_URL = import.meta.env.VITE_APP_URL || "https://api.decorom.in";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("adminToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }
    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        sessionStorage.removeItem("adminToken");
        if (window.location.pathname.startsWith("/admin") && window.location.pathname !== "/admin/login") {
          window.location.href = "/admin/login";
        }
      }
      const errorMessage =
        error.response.data?.message ||
        error.response.data?.error ||
        error.response.data ||
        `HTTP error! status: ${error.response.status}`;
      const customError = new Error(errorMessage);
      customError.status = error.response.status;
      customError.response = error.response.data;
      return Promise.reject(customError);
    } else if (error.request) {
      return Promise.reject(new Error("Network error. Please check your connection."));
    }
    return Promise.reject(error);
  },
);

export default apiClient;
