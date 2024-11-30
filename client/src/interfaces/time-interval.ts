import { TimeIntervalEnum } from "@/enums/TimeInterval";

export interface TimeInterval {
  value: TimeIntervalEnum;
  label: string;
  days: number;
}
