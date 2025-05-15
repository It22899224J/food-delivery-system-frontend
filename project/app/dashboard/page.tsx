import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { DollarSign, ShoppingCart, Utensils, TrendingUp, Clock } from 'lucide-react';
import { OverviewChart } from '@/components/dashboard/overview-chart';
import { RecentOrders } from '@/components/dashboard/recent-orders';
import { PopularItems } from '@/components/dashboard/popular-items';
import { use } from 'react';

export default function DashboardPage() {

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <Tabs defaultValue="today" className="w-full ">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground my-4">
              Overview of your restaurant's performance and recent activity.
            </p>
          </div>
          <TabsContent value="today" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Revenue Overview</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <OverviewChart />
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>
                    You have 5 orders requiring attention
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentOrders />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="week">
            <div className="h-[400px] flex items-center justify-center text-muted-foreground">
              Weekly statistics will appear here
            </div>
          </TabsContent>
          <TabsContent value="month">
            <div className="h-[400px] flex items-center justify-center text-muted-foreground">
              Monthly statistics will appear here
            </div>
          </TabsContent>
          <TabsContent value="year">
            <div className="h-[400px] flex items-center justify-center text-muted-foreground">
              Yearly statistics will appear here
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$4,231.89</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              +20.1% from last period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              +12.2% from last period
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
            <div className="text-2xl font-bold">$17.24</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              +4.3% from last period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Popular Items</CardTitle>
            <Utensils className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">234</div>
            <p className="text-xs text-muted-foreground">items sold today</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Order Status</CardTitle>
            <CardDescription>
              Current order distribution by status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="bg-yellow-100 dark:bg-yellow-900 border-yellow-300 dark:border-yellow-700 text-yellow-600 dark:text-yellow-400 h-8 w-8 rounded-full p-0 flex items-center justify-center"
                >
                  <Clock className="h-4 w-4" />
                </Badge>
                <div>
                  <div className="text-sm font-medium">Pending</div>
                  <div className="text-xs text-muted-foreground">12 orders</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="bg-blue-100 dark:bg-blue-900 border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400 h-8 w-8 rounded-full p-0 flex items-center justify-center"
                >
                  <ShoppingCart className="h-4 w-4" />
                </Badge>
                <div>
                  <div className="text-sm font-medium">Preparing</div>
                  <div className="text-xs text-muted-foreground">8 orders</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="bg-orange-100 dark:bg-orange-900 border-orange-300 dark:border-orange-700 text-orange-600 dark:text-orange-400 h-8 w-8 rounded-full p-0 flex items-center justify-center"
                >
                  <ShoppingCart className="h-4 w-4" />
                </Badge>
                <div>
                  <div className="text-sm font-medium">Ready</div>
                  <div className="text-xs text-muted-foreground">5 orders</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="bg-green-100 dark:bg-green-900 border-green-300 dark:border-green-700 text-green-600 dark:text-green-400 h-8 w-8 rounded-full p-0 flex items-center justify-center"
                >
                  <ShoppingCart className="h-4 w-4" />
                </Badge>
                <div>
                  <div className="text-sm font-medium">Delivered</div>
                  <div className="text-xs text-muted-foreground">43 orders</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Popular Items</CardTitle>
            <CardDescription>Your top selling menu items</CardDescription>
          </CardHeader>
          <CardContent>
            <PopularItems />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}