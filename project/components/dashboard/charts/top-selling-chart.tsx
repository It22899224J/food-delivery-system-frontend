"use client"

import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent } from '@/components/ui/card';

// Sample data
const data = [
  { name: 'Classic Cheeseburger', value: 345 },
  { name: 'French Fries', value: 290 },
  { name: 'Chocolate Milkshake', value: 210 },
  { name: 'Veggie Burger', value: 140 },
  { name: 'Chocolate Brownie', value: 120 },
];

export function TopSellingChart() {
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
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            fill="#8884d8"
            paddingAngle={2}
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
            <Cell key="cell-0" fill="hsl(var(--chart-1))" />
            <Cell key="cell-1" fill="hsl(var(--chart-2))" />
            <Cell key="cell-2" fill="hsl(var(--chart-3))" />
            <Cell key="cell-3" fill="hsl(var(--chart-4))" />
            <Cell key="cell-4" fill="hsl(var(--chart-5))" />
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <Card className="border-2">
                    <CardContent className="py-2 px-3">
                      <p className="text-xs text-muted-foreground mb-1">{data.name}</p>
                      <p className="text-sm font-bold">{data.value} sold</p>
                    </CardContent>
                  </Card>
                );
              }
              return null;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}