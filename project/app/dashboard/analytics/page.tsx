"use client"

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { DollarSign, TrendingUp, ShoppingCart, Utensils } from 'lucide-react';
import { TopSellingChart } from '@/components/dashboard/charts/top-selling-chart';
import { RevenueChart } from '@/components/dashboard/charts/revenue-chart';
import { OrdersChart } from '@/components/dashboard/charts/orders-chart';
import { PerformanceTable } from '@/components/dashboard/charts/performance-table';

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('7d');
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Track your restaurant's performance and sales metrics.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select
            defaultValue="7d"
            onValueChange={setDateRange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="year">This year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">Export</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$24,556.89</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              +20.1% from previous period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Orders
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,678</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              +15.3% from previous period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Order Value
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$14.63</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              +2.4% from previous period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Menu Items Sold
            </CardTitle>
            <Utensils className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3,489</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              +12.7% from previous period
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="items">Menu Items</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Revenue Over Time</CardTitle>
                <CardDescription>
                  Daily revenue for the selected period
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <RevenueChart />
              </CardContent>
            </Card>
            
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Top Selling Items</CardTitle>
                <CardDescription>
                  Based on number of orders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TopSellingChart />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="orders" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Orders Over Time</CardTitle>
                <CardDescription>
                  Daily orders for the selected period
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <OrdersChart />
              </CardContent>
            </Card>
            
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Order Distribution</CardTitle>
                <CardDescription>
                  Order distribution by time of day
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <p className="text-muted-foreground">Chart visualization will appear here</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Peak Hours</CardTitle>
              <CardDescription>
                Number of orders by hour of day
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center">
                <p className="text-muted-foreground">Hour-by-hour chart will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="items" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Menu Item Performance</CardTitle>
              <CardDescription>
                Revenue and popularity by menu item
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PerformanceTable />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}