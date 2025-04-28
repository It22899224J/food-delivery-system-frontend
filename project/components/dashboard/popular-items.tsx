"use client"

import Image from 'next/image';
import { TrendingUp, TrendingDown } from 'lucide-react';

// Sample data
const popularItems = [
  {
    id: 1,
    name: 'Spicy Chicken Burger',
    sales: 78,
    revenue: 645.54,
    trend: 'up',
    change: 12,
    image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=100'
  },
  {
    id: 2,
    name: 'Classic Pepperoni Pizza',
    sales: 65,
    revenue: 520.00,
    trend: 'up',
    change: 8,
    image: 'https://images.pexels.com/photos/2147491/pexels-photo-2147491.jpeg?auto=compress&cs=tinysrgb&w=100'
  },
  {
    id: 3,
    name: 'French Fries',
    sales: 54,
    revenue: 216.00,
    trend: 'down',
    change: 3,
    image: 'https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg?auto=compress&cs=tinysrgb&w=100'
  },
  {
    id: 4,
    name: 'Vegetable Salad',
    sales: 42,
    revenue: 336.00,
    trend: 'up',
    change: 6,
    image: 'https://images.pexels.com/photos/257816/pexels-photo-257816.jpeg?auto=compress&cs=tinysrgb&w=100'
  },
];

export function PopularItems() {
  return (
    <div className="space-y-4">
      {popularItems.map((item) => (
        <div key={item.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
          <div className="relative h-12 w-12 rounded-md overflow-hidden">
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium truncate">{item.name}</div>
            <div className="text-sm text-muted-foreground">{item.sales} sold</div>
          </div>
          <div className="text-right">
            <div className="font-medium">${item.revenue.toFixed(2)}</div>
            <div className={`text-xs flex items-center justify-end ${
              item.trend === 'up' ? 'text-green-500' : 'text-red-500'
            }`}>
              {item.trend === 'up' ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              {item.change}%
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}