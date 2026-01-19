import React, { useId } from "react"

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface AreaChartGradientProps<T extends Record<string, any>> {
  data: T[];
  xKey: keyof T;
  yKey: keyof T;
  height?: number;
  stroke?: string;
  hideGrid?: boolean;
}

export function AreaChartGradient<T extends Record<string, any>>({
  data,
  xKey,
  yKey,
  height = 260,
  stroke = 'hsl(var(--chart-1))',
  hideGrid,
}: AreaChartGradientProps<T>) {
  const gradientId = useId();

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ left: 0, right: 0, top: 12, bottom: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={stroke} stopOpacity={0.35} />
              <stop offset="100%" stopColor={stroke} stopOpacity={0} />
            </linearGradient>
          </defs>
          {!hideGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="hsl(var(--border))"
              opacity={0.6}
            />
          )}
          <XAxis
            dataKey={xKey as string}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: 'hsl(var(--foreground))' }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: 'hsl(var(--foreground))' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '14px',
              boxShadow: '0 14px 45px -30px rgba(47,17,120,0.35)',
              padding: '10px 12px',
            }}
            labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 600 }}
            formatter={(value: any) => [value as string, yKey as string]}
          />
          <Area
            type="monotone"
            dataKey={yKey as string}
            stroke={stroke}
            strokeWidth={2.6}
            fill={`url(#${gradientId})`}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
