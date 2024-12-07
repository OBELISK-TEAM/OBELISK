import { StatisticsChartProps } from "@/interfaces/stats/statistics-timeline-chart";

export interface StatisticsCardProps<T> {
  title: string;
  description: string;
  datePickerPrefix?: string;
  Chart?: React.ReactElement<StatisticsChartProps<T>>;
  children?: React.ReactNode;
}
