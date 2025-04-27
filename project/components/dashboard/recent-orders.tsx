"use client"

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, MoreVertical, Check, X } from 'lucide-react';
import Link from 'next/link';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Order } from '@/types';

export function RecentOrders({ orders }: { orders: Order[] }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-300 dark:border-yellow-800';
      case 'PREPARING':
        return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-800';
      case 'READY_FOR_PICKUP':
        return 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900 dark:text-orange-300 dark:border-orange-800';
      case 'OUT_FOR_DELIVERY':
        return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900 dark:text-red-300 dark:border-red-800';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
    }
  };

  return (
    <div className="space-y-4 p-4">
      {orders.map((order) => (
        <div key={order.id} className="flex items-center justify-between p-3 rounded-lg border">
          <div className="flex items-start gap-2">
            <div>
              <div className="font-medium">{order.id}</div>
              <div className="text-sm text-muted-foreground">{order.deliveryAddress}</div>
              <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {(() => {
                  const createdAt = new Date(order.createdAt);
                  const now = new Date();
                  const diffMs = now.getTime() - createdAt.getTime();
                  const diffMins = Math.floor(diffMs / 60000);
                  const hours = Math.floor(diffMins / 60);
                  const mins = diffMins % 60;
                  if (hours > 0) {
                  return `${hours}h ${mins}m ago`;
                  }
                  return `${mins}m ago`;
                })()}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="font-medium">LKR {order.totalAmount.toFixed(2)}</div>
               <Badge className={cn("capitalize", getStatusColor(order.status))}>
              {order.status}
            </Badge>
            </div>
          </div>
        </div>
      ))}
    <Link
       className='mt-4'
       href={`/dashboard/orders`}>
      <Button variant="outline" className="w-full mt-4">View All Orders</Button>
    </Link>
    </div>
  );
}