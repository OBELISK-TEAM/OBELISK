"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { parseDate } from "@/lib/dateUtils";
import { getColorInHsl } from "@/lib/colorUtils";
import { StatisticsChartProps, YAxisConfig } from "@/interfaces/stats/statistics-timeline-chart";
import { AggregationInterval } from "@/enums/statistics/AggregationInterval";
import { format } from "date-fns";

const prepareChartData = <T,>(
  data: T[],
  axisX: keyof T,
  yAxes: YAxisConfig<T>[],
  aggregationInterval: AggregationInterval
) => {
  return data.map((item) => {
    const formattedItem: any = {};
    formattedItem[axisX] = parseDate(item[axisX] as any)
      ? formatXAxis(new Date(item[axisX] as any).toISOString(), aggregationInterval)
      : item[axisX];

    yAxes.forEach(({ axisY }) => {
      formattedItem[axisY] = item[axisY];
    });

    return formattedItem;
  });
};

const formatXAxis = (tickItem: string, aggregationInterval: AggregationInterval) => {
  const date = new Date(tickItem);

  if (isNaN(date.getTime())) {
    return tickItem;
  }

  switch (aggregationInterval) {
    case AggregationInterval.FOUR_HOURS:
      return format(date, "MMM dd, yyyy HH:mm");
    case AggregationInterval.DAILY:
      return format(date, "MMM dd, yyyy");
    case AggregationInterval.WEEKLY:
      return format(date, "MMM dd, yyyy");
    case AggregationInterval.MONTHLY:
      return format(date, "MMM yyyy");
    default:
      return format(date, "MMM dd, yyyy HH:mm");
  }
};

export const StatisticsTimelineChart = <T,>({
  data,
  axisX,
  yAxes,
  height = "400px",
  width = "100%",
  type = "natural",
  aggregationInterval = AggregationInterval.DAILY,
}: StatisticsChartProps<T>) => {
  const formattedData = prepareChartData(data, axisX, yAxes, aggregationInterval);

  const chartConfig: { [key: string]: { label: string; color: string } } = {};

  yAxes.forEach((yAxisConfig, index) => {
    const { axisY, labelY, colorY } = yAxisConfig;
    const color = colorY || getColorInHsl(index);
    chartConfig[String(axisY)] = {
      label: labelY,
      color: color,
    };
  });

  return (
    <ResponsiveContainer width={width} height={height}>
      <ChartContainer config={chartConfig}>
        <AreaChart data={formattedData}>
          <defs>
            {yAxes.map((yAxisConfig) => {
              const { axisY } = yAxisConfig;
              const color = chartConfig[String(axisY)].color;
              return (
                <linearGradient
                  key={`gradient-${String(axisY)}`}
                  id={`fill${String(axisY)}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={color} stopOpacity={0.1} />
                </linearGradient>
              );
            })}
          </defs>
          <CartesianGrid vertical={true} strokeDasharray="3 3" />
          <XAxis
            dataKey={String(axisX)}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            style={{ fill: "var(--axis-text-color)" }}
          />
          <YAxis
            label={{
              value: yAxes.map((y) => y.labelY).join(", "),
              angle: -90,
              position: "insideLeft",
              style: { textAnchor: "middle", fill: "var(--axis-text-color)" },
            }}
            tickLine={false}
            axisLine={false}
            style={{ fill: "var(--axis-text-color)" }}
          />
          <Tooltip content={<ChartTooltipContent indicator="line" />} />
          {yAxes.map((yAxisConfig) => {
            const { axisY } = yAxisConfig;
            const gradientId = `fill${String(axisY)}`;
            const color = chartConfig[String(axisY)].color;
            return (
              <Area
                key={String(axisY)}
                type={type}
                dataKey={String(axisY)}
                fill={`url(#${gradientId})`}
                fillOpacity={0.4}
                stroke={color}
                stackId="a"
              />
            );
          })}
        </AreaChart>
      </ChartContainer>
    </ResponsiveContainer>
  );
};
