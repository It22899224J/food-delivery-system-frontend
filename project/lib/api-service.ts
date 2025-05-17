import axios, { AxiosRequestConfig } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8089";

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
apiClient.interceptors.request.use(
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

export const restaurantApi = {
  getAll: () => apiClient.get("/restaurants").then((res) => res.data),

  getById: (restaurantId: string) =>
    apiClient.get(`/restaurants/${restaurantId}`).then((res) => res.data),

  getByOwnerId: (ownerId: string) =>
    apiClient.get(`/restaurants/owner/${ownerId}`).then((res) => res.data),

  create: (data: any) =>
    apiClient.post("/restaurants", data).then((res) => res.data),

  update: (restaurantId: string, data: any) =>
    apiClient.put(`/restaurants/${restaurantId}`, data).then((res) => res.data),

  delete: (restaurantId: string) =>
    apiClient.delete(`/restaurants/${restaurantId}`).then((res) => res.data),
};

// Menu and food items endpoints
export const menuApi = {
  getAllItems: (restaurantId: string) =>
    apiClient.get(`/restaurants/${restaurantId}/menu`).then((res) => res.data),

  getCategories: (restaurantId: string) =>
    apiClient
      .get(`/restaurants/${restaurantId}/categories`)
      .then((res) => res.data),

  addItem: (restaurantId: string, item: any) =>
    apiClient
      .post(`/restaurants/${restaurantId}/menu`, item)
      .then((res) => res.data),

  updateItem: (restaurantId: string, itemId: string, data: any) =>
    apiClient
      .put(`/restaurants/${restaurantId}/menu/${itemId}`, data)
      .then((res) => res.data),

  deleteItem: (restaurantId: string, itemId: string) =>
    apiClient
      .delete(`/restaurants/${restaurantId}/menu/${itemId}`)
      .then((res) => res.data),

  updateItemAvailability: (
    restaurantId: string,
    itemId: string,
    available: boolean
  ) =>
    apiClient
      .put(`/restaurants/${restaurantId}/menu/${itemId}/availability`, {
        available,
      })
      .then((res) => res.data),
};

// Orders endpoints
export const ordersApi = {
  getByRestaurantId: (restaurantId: string) =>
    apiClient
      .get(`/restaurants/${restaurantId}/orders`)
      .then((res) => res.data),

  updateStatus: (id: string, updateStatusDto: any) =>
    apiClient
      .put(`/restaurants/orders/${id}/status`, updateStatusDto)
      .then((res) => res.data),
};

// Analytics endpoints
export const analyticsApi = {
  getDashboard: (restaurantId: string, period: string = "week") =>
    apiClient
      .get(`/restaurants/${restaurantId}/analytics/dashboard`, {
        params: { period },
      })
      .then((res) => res.data),

  getSalesReport: (restaurantId: string, params: any) =>
    apiClient
      .get(`/restaurants/${restaurantId}/analytics/sales`, {
        params,
      })
      .then((res) => res.data),

  getMenuPerformance: (restaurantId: string, period: string = "month") =>
    apiClient
      .get(`/restaurants/${restaurantId}/analytics/menu-performance`, {
        params: { period },
      })
      .then((res) => res.data),
};

// Food items endpoints
export const foodItemApi = {
  getAll: () => apiClient.get("/food-items").then((res) => res.data),

  getById: (id: string) =>
    apiClient.get(`/food-items/${id}`).then((res) => res.data),

  create: (data: FormData) =>
    apiClient
      .post("/food-items", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => res.data),

  update: (id: string, data: FormData) =>
    apiClient
      .put(`/food-items/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => res.data),

  delete: (id: string) =>
    apiClient.delete(`/food-items/${id}`).then((res) => res.data),
};

export const paymentApi = {
  getAll: () => apiClient.get("/food-items").then((res) => res.data),

  getById: (id: string) =>
    apiClient.get(`/payments/restaurant/${id}`).then((res) => res.data),

  create: (data: FormData) =>
    apiClient
      .post("/food-items", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => res.data),

  update: (id: string, data: FormData) =>
    apiClient
      .put(`/food-items/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => res.data),

  delete: (id: string) =>
    apiClient.delete(`/food-items/${id}`).then((res) => res.data),
};
