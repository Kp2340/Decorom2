import axios from "axios";

const BASE_URL = import.meta.env.VITE_APP_URL || "https://api.decorom.in";

// Create axios instance
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Add JWT token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // If body is FormData, remove Content-Type to let browser set it with boundary
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor - Handle errors with backend error messages
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Handle error response
    if (error.response) {
      // Server responded with error status
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
      // Request made but no response received
      const customError = new Error(
        "Network error. Please check your connection.",
      );
      return Promise.reject(customError);
    } else {
      // Something else happened
      return Promise.reject(error);
    }
  },
);

export default apiClient;
