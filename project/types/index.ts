// Restaurant types
export interface Restaurant {
  id: string;
  name: string;
  description: string;
  address: string;
  positon: {
    lat: number;
    lng: number;
  };
  phone: string;
  email: string;
  logo: string;
  banner: string;
  cuisineType: string[];
  rating: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  categoryId: string;
  available: boolean;
  popular: boolean;
  allergies: string[];
  dietary: string[];
  createdAt: string;
  updatedAt: string;
}

export interface OpeningHours {
  monday: TimeRange[];
  tuesday: TimeRange[];
  wednesday: TimeRange[];
  thursday: TimeRange[];
  friday: TimeRange[];
  saturday: TimeRange[];
  sunday: TimeRange[];
}

export interface TimeRange {
  open: string;
  close: string;
}


export interface MenuCategory {
  id: string;
  name: string;
  description: string;
  order: number;
}

// Order types
export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  paymentMethod: string;
  deliveryAddress: string;
  createdAt: string;
  updatedAt: string;
  estimatedDeliveryTime?: string;
  actualDeliveryTime?: string;
  special_instructions?: string;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
  options: OrderItemOption[];
  specialInstructions?: string;
}

export interface OrderItemOption {
  id: string;
  name: string;
  price: number;
}

export type OrderStatus =
  | "pending"
  | "accepted"
  | "preparing"
  | "ready_for_pickup"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

// Analytics types
export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  topSellingItems: TopSellingItem[];
  ordersOverTime: TimeSeriesData[];
  revenueOverTime: TimeSeriesData[];
  orderStatusDistribution: StatusCount[];
}

export interface TopSellingItem {
  id: string;
  name: string;
  count: number;
  revenue: number;
}

export interface TimeSeriesData {
  date: string;
  value: number;
}

export interface StatusCount {
  status: string;
  count: number;
}

export interface MenuPerformance {
  id: string;
  name: string;
  totalOrders: number;
  revenue: number;
  averageRating: number;
}
