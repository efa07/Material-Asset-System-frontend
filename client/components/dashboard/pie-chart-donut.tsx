"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface PieChartDonutProps {
  data: { name: string; value: number; color?: string }[];
  height?: number;
}

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

export function PieChartDonut({ data, height = 300 }: PieChartDonutProps) {
  // Filter out zero values to avoid empty segments cluttered
  const activeData = data.filter((d) => d.value > 0);

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={activeData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {activeData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color || COLORS[index % COLORS.length]}
                strokeWidth={0}
              />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                          {payload[0].name}
                        </span>
                        <span className="font-bold text-muted-foreground">
                          {payload[0].value}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36} 
            iconType="circle"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
