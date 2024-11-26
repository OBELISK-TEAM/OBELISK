"use client";

import * as React from "react";
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

interface DateRangeSelectorProps {
  currentPreset: string;
  onValueChange: (presetValue: string, newDateRange: { from: Date; to: Date }) => void;
}

export const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({ currentPreset, onValueChange }) => {
  const handlePresetChange = (value: string) => {
    const today = new Date();
    let fromDate: Date;

    switch (value) {
      case "1d":
        fromDate = addDays(today, -1);
        break;
      case "3d":
        fromDate = addDays(today, -3);
        break;
      case "1w":
        fromDate = addDays(today, -7);
        break;
      case "2w":
        fromDate = addDays(today, -14);
        break;
      case "1m":
        fromDate = addDays(today, -30);
        break;
      case "3m":
        fromDate = addDays(today, -90);
        break;
      case "6m":
        fromDate = addDays(today, -180);
        break;
      case "1y":
        fromDate = addDays(today, -365);
        break;
      case "2y":
        fromDate = addDays(today, -730);
        break;
      case "3y":
        fromDate = addDays(today, -1095);
        break;
      default:
        fromDate = addDays(today, -7);
        break;
    }

    onValueChange(value, { from: fromDate, to: today });
  };

  return (
    <Select value={currentPreset} onValueChange={handlePresetChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select interval" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Predefined intervals</SelectLabel>
          <SelectItem value="custom">Custom Interval</SelectItem>
          <SelectItem value="1d">1 day</SelectItem>
          <SelectItem value="3d">3 days</SelectItem>
          <SelectItem value="1w">1 week</SelectItem>
          <SelectItem value="2w">2 weeks</SelectItem>
          <SelectItem value="1m">1 month</SelectItem>
          <SelectItem value="3m">3 months</SelectItem>
          <SelectItem value="6m">6 months</SelectItem>
          <SelectItem value="1y">1 year</SelectItem>
          <SelectItem value="2y">2 years</SelectItem>
          <SelectItem value="3y">3 years</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
