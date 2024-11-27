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
import { TimeIntervalEnum } from "@/enums/TimeInterval";
import { determineTimeInterval, TIME_INTERVALS } from "@/lib/dateUtils";

interface DateRangeSelectorProps {
  onValueChange: (newDateRange: { from: Date; to: Date }) => void;
  date?: DateRange | undefined;
}

export const DateRangeSelector: FC<DateRangeSelectorProps> = ({ onValueChange, date }) => {
  const [timeInterval, setTimeInterval] = useState<TimeIntervalEnum>(TimeIntervalEnum.ONE_WEEK);

  const handleTimeIntervalChange = (value: TimeIntervalEnum) => {
    const today = new Date();
    let fromDate: Date;

    if (value === TimeIntervalEnum.CUSTOM) {
      onValueChange({ from: date?.from || today, to: today });
      setTimeInterval(value);
      return;
    }

    const selectedInterval = TIME_INTERVALS.find((interval) => interval.value === value);
    if (selectedInterval) {
      fromDate = addDays(today, -selectedInterval.days);
      setTimeInterval(value);
      onValueChange({ from: fromDate, to: today });
    } else {
      const defaultInterval = TIME_INTERVALS.find((interval) => interval.value === TimeIntervalEnum.ONE_WEEK);
      if (defaultInterval) {
        fromDate = addDays(today, -defaultInterval.days);
        setTimeInterval(TimeIntervalEnum.ONE_WEEK);
        onValueChange({ from: fromDate, to: today });
      }
    }
  };

  useEffect(() => {
    if (date?.from && date.to) {
      const newInterval = determineTimeInterval(date.from, date.to);
      setTimeInterval(newInterval);
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
