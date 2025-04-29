import axios from "axios";

// Create axios instance with custom config
const api = axios.create({
  baseURL: "http://localhost:3000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem("token");

    // If token exists, add it to request headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized error
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Handle token refresh logic here if needed
      // const refreshToken = localStorage.getItem('refreshToken');
      // try {
      //   const newToken = await refreshAccessToken(refreshToken);
      //   localStorage.setItem('token', newToken);
      //   originalRequest.headers.Authorization = `Bearer ${newToken}`;
      //   return api(originalRequest);
      // } catch (refreshError) {
      //   localStorage.removeItem('token');
      //   window.location.href = '/login';
      //   return Promise.reject(refreshError);
      // }
    }

    // Handle other errors
    if (error.response?.status === 404) {
      // Handle 404 Not Found error
      console.error("Resource not found");
    } else if (error.response?.status === 500) {
      // Handle 500 Internal Server Error
      console.error("Server error");
    }

    return Promise.reject(error);
  }
);

export default api;
