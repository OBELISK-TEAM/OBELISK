import { StatisticsChartProps } from "@/interfaces/stats/statistics-timeline-chart";
import { HTMLProps } from "react";

export interface StatisticsCardProps<T> {
  title: string;
  description: string;
  datePickerPrefix?: string;
  Chart?: React.ReactElement<StatisticsChartProps<T>>;
  children?: React.ReactNode;
  className?: HTMLProps<HTMLElement>["className"];
}
