"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { ActiveUsersResponse } from "@/interfaces/responses/statistics/active-users-response";

interface ActiveUsersChartProps {
  data: ActiveUsersResponse[];
}
export const ActiveUsersChart: React.FC<ActiveUsersChartProps> = ({ data }) => {
  const formattedData = data.map((item) => ({
    date: new Date(item.timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    "active users": item.value,
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart data={formattedData}>
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--chart-stroke)" stopOpacity={0.8} />
            <stop offset="95%" stopColor="var(--chart-stroke)" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" tick={{ fill: "var(--axis-text-color)" }} />
        <YAxis
          label={{
            value: "active users",
            angle: -90,
            position: "insideLeft",
            style: { textAnchor: "middle", fill: "var(--axis-text-color)" },
          }}
          tick={{ fill: "var(--axis-text-color)" }}
        />

        <Tooltip
          formatter={(value: number) => new Intl.NumberFormat().format(value)}
          labelFormatter={(label: string) => label}
          labelClassName={"text-black"}
        />
        <Area type="monotoneY" dataKey="active users" fill="url(#colorValue)" />
      </AreaChart>
    </ResponsiveContainer>
  );
};
