import axios, { AxiosRequestConfig } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/";

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Restaurant profile endpoints
export const restaurantApi = {
  getAll: () => 
    apiClient.get('/restaurants').then((res) => res.data),

  getById: (restaurantId: string) =>
    apiClient.get(`/restaurants/${restaurantId}`).then((res) => res.data),

  create: (data: any) =>
    apiClient.post('/restaurants', data).then((res) => res.data),

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
  getAll: (restaurantId: string, params: any = {}) =>
    apiClient
      .get(`/restaurants/${restaurantId}/orders`, { params })
      .then((res) => res.data),

  getById: (restaurantId: string, orderId: string) =>
    apiClient
      .get(`/restaurants/${restaurantId}/orders/${orderId}`)
      .then((res) => res.data),

  updateStatus: (restaurantId: string, orderId: string, status: string) =>
    apiClient
      .put(`/restaurants/${restaurantId}/orders/${orderId}/status`, { status })
      .then((res) => res.data),

  acceptOrder: (restaurantId: string, orderId: string, estimatedTime: number) =>
    apiClient
      .post(`/restaurants/${restaurantId}/orders/${orderId}/accept`, {
        estimatedTime,
      })
      .then((res) => res.data),

  rejectOrder: (restaurantId: string, orderId: string, reason: string) =>
    apiClient
      .post(`/restaurants/${restaurantId}/orders/${orderId}/reject`, { reason })
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
  getAll: () => 
    apiClient.get('/food-items').then((res) => res.data),

  getById: (id: string) =>
    apiClient.get(`/food-items/${id}`).then((res) => res.data),

  create: (data: FormData) =>
    apiClient.post('/food-items', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then((res) => res.data),

  update: (id: string, data: FormData) =>
    apiClient.put(`/food-items/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then((res) => res.data),

  delete: (id: string) =>
    apiClient.delete(`/food-items/${id}`).then((res) => res.data),
};
