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

export interface Order {
  id: string;
  items: CartItem[];
  restaurantId: string;
  restaurantName: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered';
  total: number;
  deliveryAddress: string;
  createdAt: string;
  estimatedDeliveryTime?: string;
  driverId?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'driver';
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