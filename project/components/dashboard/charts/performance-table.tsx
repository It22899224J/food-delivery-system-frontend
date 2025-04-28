"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Search, ArrowUpDown } from 'lucide-react';

// Sample data
const menuItems = [
  { 
    id: 1,
    name: 'Classic Cheeseburger',
    category: 'Burgers',
    totalOrders: 345,
    revenue: 3102.55,
    averageRating: 4.7,
    trend: 'up',
    change: 12
  },
  { 
    id: 2,
    name: 'Veggie Burger',
    category: 'Burgers',
    totalOrders: 140,
    revenue: 1398.60,
    averageRating: 4.5,
    trend: 'up',
    change: 8
  },
  { 
    id: 3,
    name: 'French Fries',
    category: 'Sides',
    totalOrders: 290,
    revenue: 1157.10,
    averageRating: 4.8,
    trend: 'down',
    change: 3
  },
  { 
    id: 4,
    name: 'Chocolate Milkshake',
    category: 'Beverages',
    totalOrders: 210,
    revenue: 1047.90,
    averageRating: 4.6,
    trend: 'up',
    change: 5
  },
  { 
    id: 5,
    name: 'Chocolate Brownie',
    category: 'Desserts',
    totalOrders: 120,
    revenue: 718.80,
    averageRating: 4.9,
    trend: 'up',
    change: 15
  },
  { 
    id: 6,
    name: 'Double Bacon Burger',
    category: 'Burgers',
    totalOrders: 115,
    revenue: 1265.00,
    averageRating: 4.4,
    trend: 'down',
    change: 2
  },
  { 
    id: 7,
    name: 'Onion Rings',
    category: 'Sides',
    totalOrders: 95,
    revenue: 427.50,
    averageRating: 4.3,
    trend: 'up',
    change: 7
  },
  { 
    id: 8,
    name: 'Vanilla Milkshake',
    category: 'Beverages',
    totalOrders: 90,
    revenue: 449.10,
    averageRating: 4.5,
    trend: 'down',
    change: 4
  },
];

export function PerformanceTable() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState('totalOrders');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const toggleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('desc');
    }
  };

  const filteredItems = menuItems
    .filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      // @ts-ignore
      const valueA = a[sortKey];
      // @ts-ignore
      const valueB = b[sortKey];
      
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return sortDirection === 'asc' 
          ? valueA.localeCompare(valueB) 
          : valueB.localeCompare(valueA);
      }
      
      return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
    });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search menu items..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="rounded-md border">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b bg-muted/50">
                <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">
                  <Button 
                    variant="ghost" 
                    className="p-0 font-medium flex items-center gap-1"
                    onClick={() => toggleSort('name')}
                  >
                    Item
                    <ArrowUpDown className="h-3.5 w-3.5" />
                  </Button>
                </th>
                <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">
                  Category
                </th>
                <th className="h-10 px-4 text-right align-middle font-medium text-muted-foreground">
                  <Button 
                    variant="ghost" 
                    className="p-0 font-medium flex items-center gap-1 ml-auto"
                    onClick={() => toggleSort('totalOrders')}
                  >
                    Orders
                    <ArrowUpDown className="h-3.5 w-3.5" />
                  </Button>
                </th>
                <th className="h-10 px-4 text-right align-middle font-medium text-muted-foreground">
                  <Button 
                    variant="ghost" 
                    className="p-0 font-medium flex items-center gap-1 ml-auto"
                    onClick={() => toggleSort('revenue')}
                  >
                    Revenue
                    <ArrowUpDown className="h-3.5 w-3.5" />
                  </Button>
                </th>
                <th className="h-10 px-4 text-right align-middle font-medium text-muted-foreground">
                  <Button 
                    variant="ghost" 
                    className="p-0 font-medium flex items-center gap-1 ml-auto"
                    onClick={() => toggleSort('averageRating')}
                  >
                    Rating
                    <ArrowUpDown className="h-3.5 w-3.5" />
                  </Button>
                </th>
                <th className="h-10 px-4 text-right align-middle font-medium text-muted-foreground">
                  Trend
                </th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {filteredItems.map((item) => (
                <tr key={item.id} className="border-b transition-colors hover:bg-muted/50">
                  <td className="p-4 align-middle font-medium">{item.name}</td>
                  <td className="p-4 align-middle">
                    <Badge variant="outline">{item.category}</Badge>
                  </td>
                  <td className="p-4 align-middle text-right">{item.totalOrders}</td>
                  <td className="p-4 align-middle text-right">${item.revenue.toFixed(2)}</td>
                  <td className="p-4 align-middle text-right">{item.averageRating.toFixed(1)}</td>
                  <td className="p-4 align-middle">
                    <div className={`flex items-center justify-end ${
                      item.trend === 'up' ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {item.trend === 'up' ? (
                        <TrendingUp className="h-4 w-4 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 mr-1" />
                      )}
                      {item.change}%
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}