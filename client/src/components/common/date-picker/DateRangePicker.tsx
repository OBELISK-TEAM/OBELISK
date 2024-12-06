"use client";

import { HTMLAttributes } from "react";
import { format, isAfter, startOfDay, isBefore, subHours } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useDateRange } from "@/hooks/stats/useDateRange";
import { TimeInput } from "@/components/common/date-picker/TimeInput";
import { Label } from "@/components/ui/label";

interface DatePickerProps extends HTMLAttributes<HTMLDivElement> {
  prefix: string;
}

export function DateRangePicker({ className, prefix }: DatePickerProps) {
  const { date, setDate } = useDateRange({ prefix });

  const now = new Date();

  const validateAndSetDate = (newDate: { from?: Date; to?: Date }) => {
    let { from, to } = newDate;

    if (from && to && isAfter(from, to)) {
      from = startOfDay(to);
    }
    if (from && isAfter(from, now)) {
      from = now;
    }
    if (to && isAfter(to, now)) {
      to = now;
    }
    if (from && to && from.getTime() === to.getTime()) {
      from = subHours(to, 2);
    }
    setDate({ from, to });
  };

  const formatDate = (date?: Date) => {
    if (!date) {
      return "Select date";
    }
    return format(date, "LLL dd, y HH:mm");
  };

  return (
    <div className={cn("mt-6 flex justify-between gap-4", className)}>
      <div>
        <Label htmlFor={`${prefix}-start-date-picker`} className="block text-sm font-medium">
          Start Date
        </Label>
        <div className="mt-1 flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id={`${prefix}-start-date-picker`}
                variant="outline"
                className={cn("w-full justify-start text-left font-normal", !date?.from && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formatDate(date?.from)}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                selected={date?.from}
                onSelect={(selectedDate) => validateAndSetDate({ from: selectedDate ?? undefined, to: date?.to })}
                mode="single"
                disabled={(dateToCheck) => (date?.to && isAfter(dateToCheck, date?.to)) || isAfter(dateToCheck, now)}
              />
            </PopoverContent>
          </Popover>
          <TimeInput value={date?.from} onChange={(time) => validateAndSetDate({ from: time, to: date?.to })} />
        </div>
      </div>

      <div>
        <Label htmlFor={`${prefix}-end-date-picker`} className="block text-sm font-medium">
          End Date
        </Label>
        <div className="mt-1 flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id={`${prefix}-end-date-picker`}
                variant="outline"
                className={cn("w-full justify-start text-left font-normal", !date?.to && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formatDate(date?.to)}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                selected={date?.to}
                onSelect={(selectedDate) => validateAndSetDate({ from: date?.from, to: selectedDate ?? undefined })}
                mode="single"
                disabled={(dateToCheck) =>
                  (date?.from && isBefore(dateToCheck, date?.from)) || isAfter(dateToCheck, now)
                }
              />
            </PopoverContent>
          </Popover>
          <TimeInput value={date?.to} onChange={(time) => validateAndSetDate({ from: date?.from, to: time })} />
        </div>
      </div>
    </div>
  );
}
