export interface Restaurant {
  id: string;
  name: string;
  image: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  restaurantId: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface OrderItem {
  itemId: string;
  quantity: number;
  price: number;
  specialInstructions?: string;
}

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
  orderId: string;
  itemId: string;
  quantity: number;
  price: number;
  specialInstructions?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "customer" | "driver";
  phone?: string;
  addresses?: string[];
}

export interface Driver extends User {
  isAvailable: boolean;
  currentOrders: Order[];
  completedOrders: Order[];
  location?: {
    lat: number;
    lng: number;
  };
}


export type DeliveryStatus =
  | "PENDING"
  | "ASSIGNED"
  | "PICKED_UP"
  | "IN_TRANSIT"
  | "DELIVERED"
  | "CANCELLED";

export type VehicleType = "BIKE" | "CAR" | "VAN";

export interface Location {
  lat: number;
  lng: number;
}

export interface DeliveryDriver {
  id: string;
  name: string;
  email: string;
  contact: string;
  vehicleType: VehicleType;
  licensePlate: string;
  isAvailable: boolean;
  currentLocation?: Location;
  rating?: number;
  totalDeliveries: number;
  activeDeliveryId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Delivery {
  id: string;
  orderId: string;
  driverId: string;
  driver: DeliveryDriver;
  status: DeliveryStatus;
  assignedAt?: string;
  pickedUpAt?: string;
  deliveredAt?: string;
  currentLocation?: Location;
  startLocation: Location;
  endLocation: Location;
  estimatedTime?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDelivery {
  orderId: string;
  startLocation: {
    lat: number;
    lng: number;
  };
  endLocation: {
    lat: number;
    lng: number;
  };
  estimatedTime?: number;
}

export interface UpdateDelivery {
  status?: DeliveryStatus;
  currentLocation?: {
    lat: number;
    lng: number;
  };
  estimatedTime?: number;
}