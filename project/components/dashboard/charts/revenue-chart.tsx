"use client"

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent } from '@/components/ui/card';

// Sample data
const data = [
  { date: '2025-05-01', value: 1345.67 },
  { date: '2025-05-02', value: 1567.32 },
  { date: '2025-05-03', value: 1890.45 },
  { date: '2025-05-04', value: 1678.23 },
  { date: '2025-05-05', value: 1456.78 },
  { date: '2025-05-06', value: 1987.34 },
  { date: '2025-05-07', value: 2145.67 },
  { date: '2025-05-08', value: 1876.45 },
  { date: '2025-05-09', value: 1765.34 },
  { date: '2025-05-10', value: 2345.67 },
  { date: '2025-05-11', value: 2456.78 },
  { date: '2025-05-12', value: 2123.45 },
  { date: '2025-05-13', value: 1998.76 },
  { date: '2025-05-14', value: 2345.67 },
];

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export function RevenueChart() {
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
        <LineChart
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
            tickFormatter={(value) => `$${value}`}
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12 }}
            width={60}
            className="text-xs text-muted-foreground"
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <Card className="border-2">
                    <CardContent className="py-2 px-3">
                      <p className="text-xs text-muted-foreground mb-1">{formatDate(label)}</p>
                      <p className="text-sm font-bold">${payload[0].value.toFixed(2)}</p>
                    </CardContent>
                  </Card>
                );
              }
              return null;
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="hsl(var(--chart-1))"
            strokeWidth={2}
            dot={{ r: 4, strokeWidth: 2 }}
            activeDot={{ r: 6, strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}