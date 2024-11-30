"use client";

import { HTMLAttributes } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DateRangeSelector } from "@/components/common/date-picker/DateRangeSelector";
import { useDateRange } from "@/hooks/stats/useDateRange";

interface DatePickerWithRangeProps extends HTMLAttributes<HTMLDivElement> {
  prefix: string;
}

export function DateRangePicker({ className, prefix }: DatePickerWithRangeProps) {
  const { date, setDate } = useDateRange({ prefix });

  const formatDateRange = () => {
    if (!date?.from) {
      return "Choose a date";
    }
    const fromFormatted = format(date.from, "LLL dd, y");
    const toFormatted = date.to ? format(date.to, "LLL dd, y") : "Present";
    return `${fromFormatted} - ${toFormatted}`;
  };

  return (
    <div className={cn("flex gap-4", className)}>
      <DateRangeSelector onValueChange={setDate} date={date} />
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id={`${prefix}-date-picker`}
            variant="outline"
            className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {formatDateRange()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
