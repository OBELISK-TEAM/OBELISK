"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { ActiveUsersResponse } from "@/interfaces/responses/statistics/active-users-response";
import { ChartConfig, ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

interface ActiveUsersChartProps {
  data: ActiveUsersResponse[];
}

const prepareChartData = (data: ActiveUsersResponse[]) => {
  return data.map((item) => ({
    date: new Date(item.timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    "active users": item.value,
  }));
};
export const ActiveUsersChart: React.FC<ActiveUsersChartProps> = ({ data }) => {
  const formattedData = prepareChartData(data);

  const chartConfig = {
    "active users": {
      label: "Active Users",
      color: "hsl(var(--chart-stroke))",
    },
  } satisfies ChartConfig;

  return (
    <ResponsiveContainer width="100%" height={400}>
      <ChartContainer config={chartConfig}>
        <AreaChart data={formattedData}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--chart-stroke)" stopOpacity={0.8} />
              <stop offset="95%" stopColor="var(--chart-stroke)" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={true} horizontal={false} strokeDasharray="3 3" />
          <XAxis dataKey="date" tickLine={false} axisLine={false} />
          <YAxis
            label={{
              value: "active users",
              angle: -90,
              position: "insideLeft",
              style: { textAnchor: "middle", fill: "var(--axis-text-color)" },
            }}
            tickLine={false}
            axisLine={false}
          />

          <Tooltip content={<ChartTooltipContent indicator="line" />} />
          <Area type="natural" dataKey="active users" fill="url(#colorValue)" />
        </AreaChart>
      </ChartContainer>
    </ResponsiveContainer>
  );
};
