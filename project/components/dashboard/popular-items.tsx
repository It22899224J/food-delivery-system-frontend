"use client"

import Image from 'next/image';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { MenuItem } from '@/types';

// Sample data

export function PopularItems({ items }: { items: MenuItem[] }) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        item.popular && (
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
            <div className="text-sm text-muted-foreground">{item.createdAt} </div>
          </div>
          <div className="text-right">
            <div className="font-medium">${item.price.toFixed(2)}</div>
            {/* <div className={`text-xs flex items-center justify-end ${
              item.trend === 'up' ? 'text-green-500' : 'text-red-500'
            }`}>
              {item.trend === 'up' ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              {item.change}%
            </div> */}
          </div>
        </div>
      )))}
    </div>
  );
}