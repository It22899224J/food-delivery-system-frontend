"use client"

import {useEffect, useState } from 'react';
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
import { ordersApi } from '@/lib/api-service';



export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('all');
const  restaurantId = localStorage.getItem("restaurantId");
useEffect(() => {
    const fetchOrderData = async () => {
      try {
        if (!restaurantId) {
          console.error("Restaurant ID is missing.");
          return;
        }
        const data = await ordersApi.getByRestaurantId(restaurantId);
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch restaurant data:", error);
      }
    };
    fetchOrderData();
  }, []);

  const getFilteredOrders = (tab: string): Order[] => {
    // First apply search filter
    let filtered = orders.filter(order => 
      order.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    // Then apply status filter
    if (tab === 'all') return filtered;
    if (tab === 'active') {
      return filtered.filter(order => 
        ['PENDING', 'CONFIRMED', 'PREPARING', 'READY_FOR_PICKUP', 'OUT_FOR_DELIVERY'].includes(order.status)
      );
    }
    
    // Filter by specific status
    return filtered.filter(order => order.status === tab);
  };

  const countByStatus = (status: string): number => {
    if (status === 'all') return orders.length;
    if (status === 'active') {
      return orders.filter(order => 
        ['PENDING', 'CONFIRMED', 'PREPARING', 'READY_FOR_PICKUP', 'OUT_FOR_DELIVERY'].includes(order.status)
      ).length;
    }
    return orders.filter(order => order.status === status).length;
  };
  
  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    // Map lowercase status to uppercase for backend compatibility
    const statusMap: Record<string, string> = {
      pending: "PENDING",
      accepted: "CONFIRMED",
      preparing: "PREPARING",
      ready_for_pickup: "READY_FOR_PICKUP",
      out_for_delivery: "ON_THE_WAY",
      delivered: "DELIVERED",
      cancelled: "CANCELLED",
    };
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId
          ? {
              ...order,
              status: statusMap[newStatus] as Order["status"],
              updatedAt: new Date().toISOString(),
            }
          : order
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
              {countByStatus('PENDING')}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="delivered" className="relative">
            Delivered
            <Badge className="ml-2 text-xs bg-primary/10 text-primary border-transparent">
              {countByStatus('DELIVERED')}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="cancelled" className="relative">
            Cancelled
            <Badge className="ml-2 text-xs bg-primary/10 text-primary border-transparent">
              {countByStatus('CANCELLED')}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <OrdersList orders={getFilteredOrders('all')} />
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          <OrdersList orders={getFilteredOrders('active')}  />
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <OrdersList orders={getFilteredOrders('PENDING')}  />
        </TabsContent>

        <TabsContent value="delivered" className="space-y-4">
          <OrdersList orders={getFilteredOrders('DELIVERED')}  />
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-4">
          <OrdersList orders={getFilteredOrders('CANCELLED')}  />
        </TabsContent>
      </Tabs>
    </div>
  );
}