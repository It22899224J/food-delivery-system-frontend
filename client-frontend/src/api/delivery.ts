import api from "./axios";
import axios from "axios";
import { DeliveryDriver, Delivery, CreateDelivery, UpdateDelivery } from "../types";

const DELIVERY_API_URL = "http://localhost:3002";

// Create a new delivery
export const createDelivery = async (createDeliveryDto: CreateDelivery): Promise<Delivery> => {
  const response = await axios.post(`${DELIVERY_API_URL}/deliveries`, createDeliveryDto);
  return response.data;
};

// Get all deliveries
export const findAllDeliveries = async (): Promise<Delivery[]> => {
  const response = await api.get(`${DELIVERY_API_URL}/deliveries`);
  return response.data;
};

// Get delivery by ID
export const findDeliveryById = async (id: string): Promise<Delivery> => {
  const response = await api.get(`${DELIVERY_API_URL}/deliveries/${id}`);
  return response.data;
};

// Update delivery
export const updateDelivery = async (id: string, updateDto: UpdateDelivery): Promise<Delivery> => {
  const response = await api.patch(`${DELIVERY_API_URL}/deliveries/${id}`, updateDto);
  return response.data;
};

// Driver endpoints
export const createDriver = async (createDriverDto: Omit<DeliveryDriver, 'createdAt' | 'updatedAt' | 'totalDeliveries' | 'activeDeliveryId'>): Promise<DeliveryDriver> => {
  const response = await axios.post(`${DELIVERY_API_URL}/drivers`, createDriverDto);
  return response.data;
};

// Get all drivers
export const findAllDrivers = async (available?: boolean): Promise<DeliveryDriver[]> => {
  const url = available 
    ? `${DELIVERY_API_URL}/drivers?available=true`
    : `${DELIVERY_API_URL}/drivers`;
  const response = await api.get(url);
  return response.data;
};

// Get driver by ID
export const findDriverById = async (id: string): Promise<DeliveryDriver> => {
  const response = await api.get(`${DELIVERY_API_URL}/drivers/${id}`);
  return response.data;
};

// Update driver
export const updateDriver = async (id: string, updateDto: Partial<DeliveryDriver>): Promise<DeliveryDriver> => {
  const response = await api.patch(`${DELIVERY_API_URL}/drivers/${id}`, updateDto);
  return response.data;
};

// Update driver availability
export const updateDriverAvailability = async (id: string, isAvailable: boolean): Promise<DeliveryDriver> => {
  const response = await api.patch(`${DELIVERY_API_URL}/drivers/${id}/availability`, { isAvailable });
  return response.data;
};

// Update driver location
export const updateDriverLocation = async (id: string, location: { latitude: number; longitude: number }): Promise<DeliveryDriver> => {
  const response = await api.patch(`${DELIVERY_API_URL}/drivers/${id}/location`, location);
  return response.data;
};

// Get delivery by order ID
export const findDeliveryByOrderId = async (orderId: string): Promise<Delivery> => {
  const response = await api.get(`${DELIVERY_API_URL}/deliveries/orders/${orderId}`);
  return response.data;
};

export const findDeliveryByDriverId = async (driverId: string): Promise<Delivery[]> => {
  const response = await api.get(`${DELIVERY_API_URL}/deliveries/drivers/${driverId}`);
  return response.data;
};