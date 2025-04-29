"use client"

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, MoreVertical, Check, X } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

// Sample data
const recentOrders = [
  {
    id: 'ORD-1234',
    customer: 'John Doe',
    items: 3,
    total: 35.97,
    status: 'pending',
    time: '10 mins ago',
  },
  {
    id: 'ORD-1233',
    customer: 'Jane Smith',
    items: 1,
    total: 18.99,
    status: 'preparing',
    time: '15 mins ago',
  },
  {
    id: 'ORD-1232',
    customer: 'Bob Johnson',
    items: 2,
    total: 27.45,
    status: 'ready',
    time: '20 mins ago',
  },
  {
    id: 'ORD-1231',
    customer: 'Alice Brown',
    items: 4,
    total: 42.50,
    status: 'delivered',
    time: '35 mins ago',
  },
  {
    id: 'ORD-1230',
    customer: 'Sam Wilson',
    items: 2,
    total: 25.98,
    status: 'delivered',
    time: '45 mins ago',
  },
];

export function RecentOrders() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-300 dark:border-yellow-800';
      case 'preparing':
        return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-800';
      case 'ready':
        return 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900 dark:text-orange-300 dark:border-orange-800';
      case 'delivered':
        return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-800';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
    }
  };

  return (
    <div className="space-y-4">
      {recentOrders.map((order) => (
        <div key={order.id} className="flex items-center justify-between p-3 rounded-lg border">
          <div className="flex items-start gap-2">
            <div>
              <div className="font-medium">{order.id}</div>
              <div className="text-sm text-muted-foreground">{order.customer}</div>
              <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {order.time}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="font-medium">${order.total.toFixed(2)}</div>
              <div className="text-xs text-muted-foreground">{order.items} items</div>
            </div>
            <Badge className={cn("capitalize", getStatusColor(order.status))}>
              {order.status}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Check className="mr-2 h-4 w-4" /> Accept
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <X className="mr-2 h-4 w-4" /> Decline
                </DropdownMenuItem>
                <DropdownMenuItem>View Details</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
      <Button variant="outline" className="w-full">View All Orders</Button>
    </div>
  );
}