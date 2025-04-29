import api from "./axios";
import { Order } from "../types";
import axios from "axios";

export const createOrder = async (createOrderDto: any): Promise<any> => {
  const response = await axios.post("http://localhost:3004", createOrderDto);
  return response.data;
};

// Get all orders
export const findAllOrders = async (): Promise<Order[]> => {
  const response = await api.get("/orders");
  return response.data;
};

// Get order by ID
export const findOrderById = async (id: string): Promise<Order> => {
  const response = await api.get(`/orders/${id}`);
  return response.data;
};

// Get orders by user ID
export const findOrdersByUser = async (userId: string): Promise<any[]> => {
  const response = await api.get(`http://localhost:3004/user/${userId}`);
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
  const response = await api.patch(`/orders/${id}/status`, updateStatusDto);
  return response.data;
};

// Update payment status
export const updatePaymentStatus = async (
  id: string,
  updatePaymentDto: any
): Promise<Order> => {
  const response = await api.patch(`/orders/${id}/payment`, updatePaymentDto);
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
