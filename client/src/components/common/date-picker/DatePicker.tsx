"use client";

import * as React from "react";
import { addDays, format, endOfDay, startOfDay } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { useRouter, useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface DatePickerWithRangeProps extends React.HTMLAttributes<HTMLDivElement> {
  prefix: string;
}

export function DatePickerWithRange({ className, prefix }: DatePickerWithRangeProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const parseDate = (dateString: string | null): Date | undefined => {
    if (!dateString) {
      return undefined;
    }
    const parsedDate = new Date(dateString);
    return isNaN(parsedDate.getTime()) ? undefined : parsedDate;
  };

  const [date, setDate] = React.useState<DateRange | undefined>(() => {
    const startParam = searchParams.get(`${prefix}-start-date`);
    const endParam = searchParams.get(`${prefix}-end-date`);
    if (startParam && endParam) {
      const fromDate = parseDate(startParam);
      const toDate = parseDate(endParam);
      if (fromDate && toDate) {
        return {
          from: fromDate,
          to: toDate,
        };
      }
    }
    return {
      from: addDays(new Date(), -7),
      to: new Date(),
    };
  });

  const updateQueryParams = (newDate: DateRange | undefined) => {
    if (!newDate) {
      return;
    }

    let { from, to } = newDate;

    if (from) {
      from = startOfDay(from);
    }
    if (to) {
      to = endOfDay(to);
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

    router.replace(`${window.location.pathname}?${params.toString()}`);
  };

  React.useEffect(() => {
    updateQueryParams(date);
  }, [date]);

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id={`${prefix}-date-picker`}
            variant={"outline"}
            className={cn("w-[300px] justify-start text-left font-normal", !date && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
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
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
