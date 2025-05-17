import api from "./axios";
import { Order } from "../types";

const API_BASE_URL = "http://localhost:8089/orders"; 

export const createOrder = async (createOrderDto: any): Promise<any> => {
  const response = await api.post(`${API_BASE_URL}`, createOrderDto);
  return response.data;
};

// Get all orders
export const findAllOrders = async (): Promise<Order[]> => {
  const response = await api.get(`${API_BASE_URL}/orders`);
  return response.data;
};

// Get order by ID
export const findOrderById = async (id: string): Promise<Order> => {
  const response = await api.get(`${API_BASE_URL}/${id}`);
  return response.data;
};

// Get orders by user ID
export const findOrdersByUser = async (userId: string): Promise<any[]> => {
  const response = await api.get(`${API_BASE_URL}/user/${userId}`);
  return response.data;
};

// Get orders by restaurant ID
export const findOrdersByRestaurant = async (
  restaurantId: string
): Promise<Order[]> => {
  const response = await api.get(`/orders/restaurant/${restaurantId}`);
  return response.data;
};

// Update order status
export const updateOrderStatus = async (
  id: string,
  updateStatusDto: any
): Promise<Order> => {
  const response = await api.patch(`${API_BASE_URL}/${id}/status`, updateStatusDto);
  return response.data;
};

// Update payment status
export const updatePaymentStatus = async (
  id: string,
  updatePaymentDto: any
): Promise<Order> => {
  const response = await api.patch(`${API_BASE_URL}/${id}/payment`, updatePaymentDto);
  return response.data;
};

// Cancel order
export const cancelOrder = async (
  id: string,
  cancelledBy: string
): Promise<Order> => {
  const response = await api.patch(`/orders/${id}/cancel`, { cancelledBy });
  return response.data;
};
