"use client";
import { HTMLAttributes, useState } from "react";
import { addDays, format, endOfDay, startOfDay, isToday } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DateRangeSelector } from "@/components/common/date-picker/DateRangeSelector";
import { parseDate } from "@/lib/dateUtils";

interface DatePickerWithRangeProps extends HTMLAttributes<HTMLDivElement> {
  prefix: string;
}

export function DatePickerWithRange({ className, prefix }: DatePickerWithRangeProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [date, setDate] = useState<DateRange | undefined>(() => {
    const fromDate = parseDate(searchParams.get(`${prefix}-start-date`));
    const toDate = parseDate(searchParams.get(`${prefix}-end-date`));
    if (fromDate && toDate) {
      const now = new Date();
      return {
        from: startOfDay(fromDate),
        to: toDate > now ? now : toDate,
      };
    }
    return {
      from: startOfDay(addDays(new Date(), -7)),
      to: new Date(),
    };
  });

  const updateQueryParams = (newDate: DateRange | undefined) => {
    if (!newDate) {
      return;
    }
    let { from, to } = newDate;
    const now = new Date();
    if (from) {
      from = startOfDay(from);
    }
    if (to) {
      to = endOfDay(to);
      if (to > now) {
        to = now;
      }
    }
    if (from && to && from > to) {
      from = to;
    }
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    if (from) {
      params.set(`${prefix}-start-date`, from.toISOString());
    } else {
      params.delete(`${prefix}-start-date`);
    }

    if (to) {
      params.set(`${prefix}-end-date`, to.toISOString());
    } else {
      params.delete(`${prefix}-end-date`);
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleDateRangeSelectorChange = (newDateRange: { from: Date; to: Date }) => {
    const convertedDateRange = {
      from: startOfDay(newDateRange.from),
      to: newDateRange.to > new Date() ? new Date() : newDateRange.to,
    };
    setDate(convertedDateRange);
    updateQueryParams(convertedDateRange);
  };

  const handleDateRangePickerChange = (selectedDate: DateRange | undefined) => {
    if (selectedDate && selectedDate.to) {
      const now = new Date();
      selectedDate.to = isToday(selectedDate.to) || now < selectedDate.to ? now : endOfDay(selectedDate.to);
    }

    setDate(selectedDate);
    updateQueryParams(selectedDate);
  };

  return (
    <div className={cn("flex gap-4", className)}>
      <DateRangeSelector onValueChange={handleDateRangeSelectorChange} date={date} />
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id={`${prefix}-date-picker`}
            variant={"outline"}
            className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y") + " - Present"
              )
            ) : (
              <span>Choose a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateRangePickerChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
