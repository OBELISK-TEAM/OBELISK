import { TimeIntervalEnum } from "@/enums/statistics/TimeInterval";

export interface TimeInterval {
  value: TimeIntervalEnum;
  label: string;
  days: number;
}
