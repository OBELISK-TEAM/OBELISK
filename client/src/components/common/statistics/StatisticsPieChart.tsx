"use client";

import * as React from "react";
import { PieChart, Pie, ResponsiveContainer, Label, TooltipProps } from "recharts";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip } from "@/components/ui/chart";
import { getColorFromEmail } from "@/lib/colorUtils";
import { StatisticsPieChartProps } from "@/interfaces/stats/statistics-pie-chart";
import { timeInHoursAndMinutes } from "@/lib/dateUtils";

function preparePieChartData<T>(data: T[], nameKey: keyof T, valueKey: keyof T) {
  return data.map((item) => {
    const rawValue = Number(item[valueKey]);
    return {
      name: String(item[nameKey]),
      rawValue,
      value: rawValue,
      fill: getColorFromEmail(String(item[nameKey])),
    };
  });
}

export function StatisticsPieChart<T>({
  data,
  nameKey,
  valueKey,
  width = "100%",
  height = "400px",
  innerRadius = 60,
  strokeWidth = 5,
  innerValues,
}: StatisticsPieChartProps<T>) {
  const chartData = preparePieChartData(data, nameKey, valueKey);

  const chartConfig = {
    ...chartData.reduce((acc: any, cur) => {
      acc[cur.name] = {
        label: cur.name,
        color: cur.fill,
      };
      return acc;
    }, {}),
  };

  const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
    if (!active || !payload || payload.length === 0) {
      return null;
    }

    const tooltipPayload = payload[0].payload as { name: string; rawValue: number; fill: string };
    const formattedValue = timeInHoursAndMinutes(tooltipPayload.rawValue);

    return (
      <div className="grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-[30%]" style={{ backgroundColor: tooltipPayload.fill }} />
          <span className="font-mono font-medium tabular-nums text-muted-foreground">{tooltipPayload.name}</span>
          <span className="font-medium text-foreground">{formattedValue}</span>
        </div>
      </div>
    );
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
          <ChartLegend
            content={<ChartLegendContent nameKey="name" />}
            className="flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
          />
        </PieChart>
      </ChartContainer>
    </ResponsiveContainer>
  );
}
