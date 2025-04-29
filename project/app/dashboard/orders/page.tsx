"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Calendar,
  Search,
  Filter,
  ArrowUpDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Order, OrderStatus } from '@/types';
import { OrdersList } from '@/components/dashboard/orders-list';

// Sample orders data
const sampleOrders: Order[] = [
  {
    id: 'ORD-1234',
    customerId: 'CUST-001',
    customerName: 'John Doe',
    customerPhone: '555-123-4567',
    status: 'pending',
    items: [
      { id: 'ITEM-1', menuItemId: 'item1', name: 'Classic Cheeseburger', quantity: 2, price: 8.99, options: [] },
      { id: 'ITEM-2', menuItemId: 'item3', name: 'French Fries', quantity: 1, price: 3.99, options: [] },
    ],
    subtotal: 21.97,
    tax: 1.76,
    deliveryFee: 2.99,
    total: 26.72,
    paymentMethod: 'credit_card',
    deliveryAddress: '123 Main St, Anytown, USA',
    createdAt: '2025-05-18T14:23:00Z',
    updatedAt: '2025-05-18T14:23:00Z',
    special_instructions: 'No pickles please'
  },
  {
    id: 'ORD-1233',
    customerId: 'CUST-002',
    customerName: 'Jane Smith',
    customerPhone: '555-987-6543',
    status: 'accepted',
    items: [
      { id: 'ITEM-3', menuItemId: 'item2', name: 'Veggie Burger', quantity: 1, price: 9.99, options: [] },
      { id: 'ITEM-4', menuItemId: 'item4', name: 'Chocolate Milkshake', quantity: 1, price: 4.99, options: [] },
    ],
    subtotal: 14.98,
    tax: 1.20,
    deliveryFee: 2.99,
    total: 19.17,
    paymentMethod: 'paypal',
    deliveryAddress: '456 Oak St, Anytown, USA',
    createdAt: '2025-05-18T13:45:00Z',
    updatedAt: '2025-05-18T13:50:00Z',
    estimatedDeliveryTime: '2025-05-18T14:30:00Z'
  },
  {
    id: 'ORD-1232',
    customerId: 'CUST-003',
    customerName: 'Robert Johnson',
    customerPhone: '555-456-7890',
    status: 'preparing',
    items: [
      { id: 'ITEM-5', menuItemId: 'item1', name: 'Classic Cheeseburger', quantity: 1, price: 8.99, options: [] },
      { id: 'ITEM-6', menuItemId: 'item3', name: 'French Fries', quantity: 1, price: 3.99, options: [] },
      { id: 'ITEM-7', menuItemId: 'item5', name: 'Chocolate Brownie', quantity: 1, price: 5.99, options: [] },
    ],
    subtotal: 18.97,
    tax: 1.52,
    deliveryFee: 2.99,
    total: 23.48,
    paymentMethod: 'credit_card',
    deliveryAddress: '789 Pine St, Anytown, USA',
    createdAt: '2025-05-18T13:10:00Z',
    updatedAt: '2025-05-18T13:15:00Z',
    estimatedDeliveryTime: '2025-05-18T14:00:00Z'
  },
  {
    id: 'ORD-1231',
    customerId: 'CUST-004',
    customerName: 'Sarah Williams',
    customerPhone: '555-789-0123',
    status: 'ready_for_pickup',
    items: [
      { id: 'ITEM-8', menuItemId: 'item2', name: 'Veggie Burger', quantity: 2, price: 9.99, options: [] },
      { id: 'ITEM-9', menuItemId: 'item4', name: 'Chocolate Milkshake', quantity: 2, price: 4.99, options: [] },
    ],
    subtotal: 29.96,
    tax: 2.40,
    deliveryFee: 0,
    total: 32.36,
    paymentMethod: 'cash',
    deliveryAddress: 'Pickup',
    createdAt: '2025-05-18T12:35:00Z',
    updatedAt: '2025-05-18T13:00:00Z'
  },
  {
    id: 'ORD-1230',
    customerId: 'CUST-005',
    customerName: 'Michael Brown',
    customerPhone: '555-234-5678',
    status: 'out_for_delivery',
    items: [
      { id: 'ITEM-10', menuItemId: 'item1', name: 'Classic Cheeseburger', quantity: 3, price: 8.99, options: [] },
      { id: 'ITEM-11', menuItemId: 'item3', name: 'French Fries', quantity: 2, price: 3.99, options: [] },
      { id: 'ITEM-12', menuItemId: 'item4', name: 'Chocolate Milkshake', quantity: 3, price: 4.99, options: [] },
    ],
    subtotal: 43.94,
    tax: 3.52,
    deliveryFee: 2.99,
    total: 50.45,
    paymentMethod: 'credit_card',
    deliveryAddress: '321 Elm St, Anytown, USA',
    createdAt: '2025-05-18T12:00:00Z',
    updatedAt: '2025-05-18T12:30:00Z',
    estimatedDeliveryTime: '2025-05-18T13:30:00Z'
  },
  {
    id: 'ORD-1229',
    customerId: 'CUST-006',
    customerName: 'Emily Davis',
    customerPhone: '555-345-6789',
    status: 'delivered',
    items: [
      { id: 'ITEM-13', menuItemId: 'item2', name: 'Veggie Burger', quantity: 1, price: 9.99, options: [] },
      { id: 'ITEM-14', menuItemId: 'item5', name: 'Chocolate Brownie', quantity: 1, price: 5.99, options: [] },
    ],
    subtotal: 15.98,
    tax: 1.28,
    deliveryFee: 2.99,
    total: 20.25,
    paymentMethod: 'credit_card',
    deliveryAddress: '654 Cedar St, Anytown, USA',
    createdAt: '2025-05-18T11:15:00Z',
    updatedAt: '2025-05-18T12:15:00Z',
    estimatedDeliveryTime: '2025-05-18T12:15:00Z',
    actualDeliveryTime: '2025-05-18T12:10:00Z'
  },
  {
    id: 'ORD-1228',
    customerId: 'CUST-007',
    customerName: 'James Wilson',
    customerPhone: '555-456-7890',
    status: 'cancelled',
    items: [
      { id: 'ITEM-15', menuItemId: 'item1', name: 'Classic Cheeseburger', quantity: 1, price: 8.99, options: [] },
    ],
    subtotal: 8.99,
    tax: 0.72,
    deliveryFee: 2.99,
    total: 12.70,
    paymentMethod: 'paypal',
    deliveryAddress: '987 Birch St, Anytown, USA',
    createdAt: '2025-05-18T10:45:00Z',
    updatedAt: '2025-05-18T10:55:00Z'
  },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(sampleOrders);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('all');

  const getFilteredOrders = (tab: string): Order[] => {
    // First apply search filter
    let filtered = orders.filter(order => 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerPhone.includes(searchQuery)
    );
    
    // Then apply status filter
    if (tab === 'all') return filtered;
    if (tab === 'active') {
      return filtered.filter(order => 
        ['pending', 'accepted', 'preparing', 'ready_for_pickup', 'out_for_delivery'].includes(order.status)
      );
    }
    
    // Filter by specific status
    return filtered.filter(order => order.status === tab);
  };

  const countByStatus = (status: string): number => {
    if (status === 'all') return orders.length;
    if (status === 'active') {
      return orders.filter(order => 
        ['pending', 'accepted', 'preparing', 'ready_for_pickup', 'out_for_delivery'].includes(order.status)
      ).length;
    }
    return orders.filter(order => order.status === status).length;
  };
  
  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId ? { ...order, status: newStatus, updatedAt: new Date().toISOString() } : order
      )
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
        <p className="text-muted-foreground">
          Manage incoming and past orders.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by order ID, customer name, or phone..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            Date Range
          </Button>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Select defaultValue="newest">
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="highest">Highest Total</SelectItem>
              <SelectItem value="lowest">Lowest Total</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="all" className="relative">
            All Orders
            <Badge className="ml-2 text-xs bg-primary/10 text-primary border-transparent">
              {countByStatus('all')}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="active" className="relative">
            Active
            <Badge className="ml-2 text-xs bg-primary/10 text-primary border-transparent">
              {countByStatus('active')}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="pending" className="relative">
            Pending
            <Badge className="ml-2 text-xs bg-primary/10 text-primary border-transparent">
              {countByStatus('pending')}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="delivered" className="relative">
            Delivered
            <Badge className="ml-2 text-xs bg-primary/10 text-primary border-transparent">
              {countByStatus('delivered')}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="cancelled" className="relative">
            Cancelled
            <Badge className="ml-2 text-xs bg-primary/10 text-primary border-transparent">
              {countByStatus('cancelled')}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <OrdersList orders={getFilteredOrders('all')} onStatusUpdate={updateOrderStatus} />
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          <OrdersList orders={getFilteredOrders('active')} onStatusUpdate={updateOrderStatus} />
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <OrdersList orders={getFilteredOrders('pending')} onStatusUpdate={updateOrderStatus} />
        </TabsContent>

        <TabsContent value="delivered" className="space-y-4">
          <OrdersList orders={getFilteredOrders('delivered')} onStatusUpdate={updateOrderStatus} />
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-4">
          <OrdersList orders={getFilteredOrders('cancelled')} onStatusUpdate={updateOrderStatus} />
        </TabsContent>
      </Tabs>
    </div>
  );
}