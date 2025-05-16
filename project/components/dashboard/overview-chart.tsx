"use client"

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import { Order} from '@/types';

type ChartView = 'orders' | 'revenue';
type Props = {
  orders: Order[]
}
  export function OverviewChart({ orders: propData }: Props) {

  const data = aggregateOrdersByTimeSlot(propData);
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

function aggregateOrdersByTimeSlot(propData: Order[]) {
  const slots: { [key: string]: { revenue: number; orders: number } } = {};

  propData.forEach(order => {
    const date = new Date(order.createdAt);
    const hour = date.getHours();
    const slotStartHour = Math.floor(hour / 3) * 3;
    const slotLabel = `${slotStartHour.toString().padStart(2, '0')}:00`;

    if (!slots[slotLabel]) {
      slots[slotLabel] = { revenue: 0, orders: 0 };
    }

    slots[slotLabel].orders += 1;
    slots[slotLabel].revenue += order.totalAmount ?? 0;
  });

  // Fill missing slots with zeroes for full 24-hour coverage
  const result = Array.from({ length: 8 }, (_, i) => {
    const label = `${(i * 3).toString().padStart(2, '0')}:00`;
    return {
      time: label,
      orders: slots[label]?.orders || 0,
      revenue: slots[label]?.revenue || 0,
    };
  });

  return result;
}


