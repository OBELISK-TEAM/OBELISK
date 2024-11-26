import { ChartComponentType } from "@/types/statistics/ChartComponent";

type BaseStatisticsCardProps = {
  title: string;
  description: string;
  datePickerPrefix?: string;
  children?: React.ReactNode;
};

type WithChart<T> = {
  ChartComponent: ChartComponentType<T>;
  chartData: T;
};

type WithoutChart = {
  ChartComponent?: undefined;
  chartData?: undefined;
};

export type StatisticsCardProps<T> = BaseStatisticsCardProps & (WithChart<T> | WithoutChart);
