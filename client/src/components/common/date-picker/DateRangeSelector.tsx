"use client";

import { addDays } from "date-fns";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, FC, useEffect } from "react";
import { DateRange } from "react-day-picker";
import { TimeIntervalEnum } from "@/enums/statistics/TimeInterval";
import { determineTimeInterval, TIME_INTERVALS } from "@/lib/dateUtils";

interface DateRangeSelectorProps {
  onValueChange: (newDateRange: { from: Date; to: Date }) => void;
  date?: DateRange | undefined;
}

//not used. Waiting for better time
export const DateRangeSelector: FC<DateRangeSelectorProps> = ({ onValueChange, date }) => {
  const [timeInterval, setTimeInterval] = useState<TimeIntervalEnum>(TimeIntervalEnum.ONE_WEEK);

  const handleTimeIntervalChange = (value: TimeIntervalEnum) => {
    const today = new Date();
    const selectedInterval = TIME_INTERVALS.find((interval) => interval.value === value);
    if (!selectedInterval) {
      return;
    }
    const fromDate = addDays(today, -selectedInterval.minutes);
    setTimeInterval(value);
    onValueChange({ from: fromDate, to: today });
  };

  useEffect(() => {
    if (date?.from && date.to) {
      const newInterval = determineTimeInterval(date.from, date.to);
      setTimeInterval(newInterval);
    } else {
      setTimeInterval(TimeIntervalEnum.CUSTOM);
    }
  }, [date]);

  return (
    <Select value={timeInterval} onValueChange={handleTimeIntervalChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select interval" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Predefined intervals</SelectLabel>
          {TIME_INTERVALS.map((interval) => (
            <SelectItem key={interval.value} value={interval.value}>
              {interval.label}
            </SelectItem>
          ))}
          <SelectItem value={TimeIntervalEnum.CUSTOM}>Custom Interval</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
