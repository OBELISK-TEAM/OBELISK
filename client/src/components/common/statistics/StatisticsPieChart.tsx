"use client";

import * as React from "react";
import { PieChart, Pie, ResponsiveContainer, Label, TooltipProps } from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { getColorFromEmail } from "@/lib/colorUtils";
import { StatisticsPieChartProps } from "@/interfaces/stats/statistics-pie-chart";

function formatTime(milliseconds: number): string {
  const totalMinutes = Math.floor(milliseconds / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}

function preparePieChartData<T>(data: T[], nameKey: keyof T, valueKey: keyof T) {
  return data.map((item) => ({
    name: String(item[nameKey]),
    rawValue: Number(item[valueKey]),
    value: Number(item[valueKey]),
    fill: getColorFromEmail(String(item[nameKey])),
  }));
}

export function StatisticsPieChart<T>({
  data,
  nameKey,
  valueKey,
  width = "100%",
  height = "400px",
  innerRadius = 60,
  strokeWidth = 5,
  label = "",
  innerValues,
}: StatisticsPieChartProps<T>) {
  const chartData = preparePieChartData(data, nameKey, valueKey);

  // this is only created because ChartContainer requires it, but it's not used
  const chartConfig = {
    pie: {
      label,
      icon: undefined,
    },
  };

  const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
    if (active && payload && payload.length > 0) {
      const d = payload[0].payload as { name: string; rawValue: number };
      return (
        <div className="rounded-md bg-popover p-2 text-sm text-foreground shadow-md">
          {d.name}: <strong>{formatTime(d.rawValue)}</strong>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width={width} height={height}>
      <ChartContainer config={chartConfig}>
        <PieChart>
          <ChartTooltip cursor={false} content={<CustomTooltip />} />
          <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={innerRadius} strokeWidth={strokeWidth}>
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox && innerValues) {
                  const { cx, cy } = viewBox;

                  return (
                    <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle">
                      <tspan x={cx} y={cy} className="fill-foreground text-3xl font-bold">
                        {innerValues.value.toLocaleString()}
                      </tspan>
                      <tspan x={cx} y={(cy || 0) + 24} className="fill-muted-foreground">
                        {innerValues.label.toLocaleString()}
                      </tspan>
                    </text>
                  );
                }
                return null;
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
    </ResponsiveContainer>
  );
}
