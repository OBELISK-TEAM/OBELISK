"use client";

import { useState } from "react";
import { DateRange } from "react-day-picker";
import { startOfDay, endOfDay, isToday } from "date-fns";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { getDateFromUrl } from "@/lib/dateUtils";

interface UseDateRangeProps {
  prefix: string;
}

export function useDateRange({ prefix }: UseDateRangeProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const initializeDate = (): DateRange | undefined => {
    return getDateFromUrl(searchParams, prefix);
  };

  const [date, setDate] = useState<DateRange | undefined>(initializeDate);

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

    const params = new URLSearchParams(searchParams.toString());

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

  const handleDateChange = (newDateRange: DateRange | undefined) => {
    if (newDateRange && newDateRange.to) {
      const now = new Date();
      newDateRange.to = isToday(newDateRange.to) || now < newDateRange.to ? now : endOfDay(newDateRange.to);
    }

    setDate(newDateRange);
    updateQueryParams(newDateRange);
  };

  return { date, setDate: handleDateChange };
}
