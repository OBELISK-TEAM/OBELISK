interface InnerValue {
  label: string;
  value: string;
}

export interface StatisticsPieChartProps<T> {
  data: T[];
  nameKey: keyof T;
  valueKey: keyof T;
  width?: string | number;
  height?: string | number;
  innerRadius?: number | string;
  strokeWidth?: number;
  innerValues?: InnerValue;
  label?: string;
}
