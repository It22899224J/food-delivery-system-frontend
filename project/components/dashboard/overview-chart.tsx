"use client"

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent } from '@/components/ui/card';

// Sample data
const data = [
  { time: '00:00', orders: 4, revenue: 67 },
  { time: '03:00', orders: 3, revenue: 41 },
  { time: '06:00', orders: 7, revenue: 86 },
  { time: '09:00', orders: 18, revenue: 215 },
  { time: '12:00', orders: 25, revenue: 325 },
  { time: '15:00', orders: 22, revenue: 280 },
  { time: '18:00', orders: 28, revenue: 374 },
  { time: '21:00', orders: 16, revenue: 204 },
];

type ChartView = 'orders' | 'revenue';

export function OverviewChart() {
  const [mounted, setMounted] = useState(false);
  const [view, setView] = useState<ChartView>('revenue');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center">
        <div className="flex space-x-1 rounded-lg bg-muted p-1 text-xs font-medium">
          <button
            onClick={() => setView('revenue')}
            className={`rounded-md px-2.5 py-1.5 transition-colors ${
              view === 'revenue' ? 'bg-background shadow-sm' : ''
            }`}
          >
            Revenue
          </button>
          <button
            onClick={() => setView('orders')}
            className={`rounded-md px-2.5 py-1.5 transition-colors ${
              view === 'orders' ? 'bg-background shadow-sm' : ''
            }`}
          >
            Orders
          </button>
        </div>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              className="text-xs text-muted-foreground"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              className="text-xs text-muted-foreground"
              tickFormatter={(value) => `${view === 'revenue' ? '$' : ''}${value}`}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <Card className="border-2">
                      <CardContent className="py-2 px-3">
                        <p className="text-xs text-muted-foreground mb-1">{label}</p>
                        <p className="text-sm font-bold">
                          {view === 'revenue' ? '$' : ''}
                          {payload[0].value}
                          {view === 'revenue' ? '' : ' orders'}
                        </p>
                      </CardContent>
                    </Card>
                  );
                }
                return null;
              }}
            />
            <Line
              type="monotone"
              dataKey={view}
              strokeWidth={2}
              activeDot={{ r: 6 }}
              className="stroke-primary"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}