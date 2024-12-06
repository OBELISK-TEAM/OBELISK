import { CurveType } from "recharts/types/shape/Curve";
import { AggregationInterval } from "@/enums/statistics/AggregationInterval";

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
  type?: CurveType | undefined;
  aggregationInterval?: AggregationInterval;
}

/* type= 'basis' |
    'basisClosed' |
    'basisOpen' |
    'bumpX' |
    'bumpY' |
    'bump' |
    'linear' |
    'linearClosed' |
    'natural' |
    'monotoneX' |
    'monotoneY' |
    'monotone' |
    'step' |
    'stepBefore' |
    'stepAfter' |
     CurveFactory; */
