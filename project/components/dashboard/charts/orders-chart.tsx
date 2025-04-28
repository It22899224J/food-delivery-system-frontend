"use client"

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent } from '@/components/ui/card';

// Sample data
const data = [
  { date: '2025-05-01', orders: 67 },
  { date: '2025-05-02', orders: 78 },
  { date: '2025-05-03', orders: 94 },
  { date: '2025-05-04', orders: 84 },
  { date: '2025-05-05', orders: 72 },
  { date: '2025-05-06', orders: 99 },
  { date: '2025-05-07', orders: 107 },
  { date: '2025-05-08', orders: 94 },
  { date: '2025-05-09', orders: 88 },
  { date: '2025-05-10', orders: 117 },
  { date: '2025-05-11', orders: 123 },
  { date: '2025-05-12', orders: 106 },
  { date: '2025-05-13', orders: 100 },
  { date: '2025-05-14', orders: 117 },
];

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export function OrdersChart() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: 10,
            bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis 
            dataKey="date" 
            tickFormatter={formatDate}
            tickLine={false} 
            axisLine={false}
            tick={{ fontSize: 12 }}
            className="text-xs text-muted-foreground"
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12 }}
            width={30}
            className="text-xs text-muted-foreground"
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <Card className="border-2">
                    <CardContent className="py-2 px-3">
                      <p className="text-xs text-muted-foreground mb-1">{formatDate(label)}</p>
                      <p className="text-sm font-bold">{payload[0].value} orders</p>
                    </CardContent>
                  </Card>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="orders" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}