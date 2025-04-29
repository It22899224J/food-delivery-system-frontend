import api from './axios';
import { RegisterDriverData, RegisterUserData } from "../types";

const API_BASE_URL = "http://localhost:3012"; 

export const authApi = {
  // Register a new user (customer, restaurant admin, or delivery personnel)
  register: async (userData: RegisterUserData | RegisterDriverData) => {
    const response = await api.post(`${API_BASE_URL}/auth/register`, userData);
    return response.data;
  },

  // Authenticate a user and return JWT token
  login: async (email: string, password: string) => {
    const response = await api.post(`${API_BASE_URL}/auth/login`, { email, password });
    return response.data;
  },

  // Authenticate a driver and return JWT token
  driverLogin: async (email: string, password: string) => {
    const response = await api.post(`${API_BASE_URL}/auth/driver/login`, { email, password });
    return response.data;
  },

  // Delete a user by ID (Admin only)
  deleteUser: async (id: string) => {
    const response = await api.delete(`${API_BASE_URL}/auth/users/${id}`);
    return response.data;
  },

  // Update user details by ID
  updateUser: async (id: string, userData: any) => {
    const response = await api.patch(`${API_BASE_URL}/auth/users/${id}`, userData);
    return response.data;
  },

  // Retrieve user details by ID
  getUserById: async (id: string) => {
    const response = await api.get(`${API_BASE_URL}/auth/users/${id}`);
    return response.data;
  },

  // Retrieve all users (Admin only)
  getAllUsers: async () => {
    const response = await api.get(`${API_BASE_URL}/auth/users`);
    return response.data;
  }
};

export default authApi;