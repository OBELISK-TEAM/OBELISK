export interface YAxisConfig<T> {
  axisY: keyof T;
  labelY: string;
  colorY?: string;
}

export interface StatisticsChartProps<T> {
  data: T[];
  axisX: keyof T;
  yAxes: YAxisConfig<T>[];
  height?: string;
  width?: string;
}
