"use client";

import { useState } from "react";
import { DateRange } from "react-day-picker";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { getDateRangeFromUrl } from "@/lib/dateUtils";
import { isAfter, startOfDay } from "date-fns";

interface UseDateRangeProps {
  prefix: string;
}

export function useDateRange({ prefix }: UseDateRangeProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const now = new Date();

  const initializeDate = (): DateRange | undefined => {
    return getDateRangeFromUrl(searchParams, prefix);
  };

  const [date, setDate] = useState<DateRange | undefined>(initializeDate);

  const updateQueryParams = (newDate: DateRange | undefined) => {
    const params = new URLSearchParams(searchParams.toString());

    if (newDate?.from) {
      params.set(`${prefix}-start-date`, newDate.from.toISOString());
    } else {
      params.delete(`${prefix}-start-date`);
    }

    if (newDate?.to) {
      params.set(`${prefix}-end-date`, newDate.to.toISOString());
    } else {
      params.delete(`${prefix}-end-date`);
    }

    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleDateChange = (newDateRange: DateRange | undefined) => {
    let { from, to } = newDateRange || {};

    if (from && to && isAfter(from, to)) {
      from = startOfDay(to);
    }

    // Prevent dates in the future
    if (from && isAfter(from, now)) {
      from = now;
    }
    if (to && isAfter(to, now)) {
      to = now;
    }

    setDate({ from, to });
    updateQueryParams({ from, to });
  };

  return { date, setDate: handleDateChange };
}
