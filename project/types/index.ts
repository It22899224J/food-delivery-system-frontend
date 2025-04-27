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
  menuItems?: MenuItem[];
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
  restaurantId: string;
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
  userId: string;
  restaurantId: string;
  deliveryPersonnelId?: string;
  deliveryFee: number;
  status:
    | "PENDING"
    | "CONFIRMED"
    | "PREPARING"
    | "READY_FOR_PICKUP"
    | "ON_THE_WAY"
    | "DELIVERED"
    | "CANCELLED";
  totalAmount: number;
  deliveryAddress: string;
  deliveryInstructions?: string;
  paymentStatus: "PENDING" | "PAID" | "REFUNDED";
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  itemId: string;
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
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "READY_FOR_PICKUP"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";


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

export type TimeSlotSummary = {
  time: string;
  orders: number;
  revenue: number;
};