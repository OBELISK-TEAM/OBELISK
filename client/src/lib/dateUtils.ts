import {
  parseISO,
  differenceInSeconds,
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
  differenceInWeeks,
  differenceInMonths,
  differenceInYears,
  addDays,
  startOfDay,
  isBefore,
  addWeeks,
  addMonths,
  addYears,
  isEqual,
  isAfter,
  addHours,
} from "date-fns";
import { TimeUnit } from "@/interfaces/time-unit";
import { DateRange as IDateRange } from "@/interfaces/date-range";
import { TimeInterval } from "@/interfaces/time-interval";
import { TimeIntervalEnum } from "@/enums/statistics/TimeInterval";
import { DateRange } from "react-day-picker";
import { AggregationInterval } from "@/enums/statistics/AggregationInterval";
import { ActiveUsersResponse } from "@/interfaces/responses/statistics/active-users-response";
import { AggregationRule } from "@/interfaces/stats/aggregation-rule";
/**
 * Converts a date string into a human-readable relative time format.
 *
 * @param dateString - The date string to convert (ISO format recommended).
 * @returns A human-readable string representing how long ago the date was.
 */
export function prettyDate(dateString: string): string {
  const inputDate = parseISO(dateString);
  const now = new Date();

  const seconds = differenceInSeconds(now, inputDate);
  const minutes = differenceInMinutes(now, inputDate);
  const hours = differenceInHours(now, inputDate);
  const days = differenceInDays(now, inputDate);
  const weeks = differenceInWeeks(now, inputDate);
  const months = differenceInMonths(now, inputDate);
  const years = differenceInYears(now, inputDate);

  if (seconds < 0) {
    return "in the future";
  }

  if (seconds < 60) {
    return `${seconds} seconds ago`;
  }

  if (minutes < 60) {
    return minutes === 1 ? "a minute ago" : `${minutes} minutes ago`;
  }

  if (hours < 24) {
    return hours === 1 ? "an hour ago" : `${hours} hours ago`;
  }

  if (days < 7) {
    return days === 1 ? "a day ago" : `${days} days ago`;
  }

  if (days < 14) {
    return "a week ago";
  }

  if (days < 21) {
    return "2 weeks ago";
  }

  if (days < 30) {
    return `${weeks} weeks ago`;
  }

  if (months < 2) {
    return "a month ago";
  }

  if (months < 12) {
    return `${months} months ago`;
  }

  if (years === 1) {
    return "a year ago";
  } else {
    return `${years} years ago`;
  }
}

/**
 * Array defining each time unit and its corresponding milliseconds.
 * Assumptions:
 * - 1 Year = 365 Days
 * - 1 Month = 30 Days
 */
const TIME_UNITS: TimeUnit[] = [
  { label: "year", labelPlural: "years", milliseconds: 365 * 24 * 60 * 60 * 1000 },
  { label: "month", labelPlural: "months", milliseconds: 30 * 24 * 60 * 60 * 1000 },
  { label: "day", labelPlural: "days", milliseconds: 24 * 60 * 60 * 1000 },
  { label: "hour", labelPlural: "hours", milliseconds: 60 * 60 * 1000 },
  { label: "minute", labelPlural: "minutes", milliseconds: 60 * 1000 },
  { label: "second", labelPlural: "seconds", milliseconds: 1000 },
];

/**
 * Converts milliseconds to a formatted duration string.
 * Format: "X years, M months, D days, H hours, M minutes, S seconds"
 * Omits any unit that is zero.
 *
 * @param ms - The duration in milliseconds.
 * @returns A formatted string representing the duration.
 */
export function formatDuration(ms: number): string {
  if (ms < 0) {
    throw new Error("Duration cannot be negative");
  }

  let remainingMs = ms;
  const parts: string[] = [];

  for (const unit of TIME_UNITS) {
    const unitValue = Math.floor(remainingMs / unit.milliseconds);
    if (unitValue > 0) {
      const label = unitValue === 1 ? unit.label : unit.labelPlural;
      parts.push(`${unitValue} ${label}`);
      remainingMs %= unit.milliseconds;
    }
  }

  // Handle case where duration is less than one second
  if (parts.length === 0) {
    return "0 seconds";
  }

  return parts.join(", ");
}

export const getParsedDateRangeFromUrl = (
  searchParams: { [key: string]: string | string[] | undefined },
  prefix: string,
  defaultStartDate: Date = addDays(new Date(), -7),
  defaultEndDate: Date = new Date()
): IDateRange => {
  const urlSearchParams = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => urlSearchParams.append(key, v));
    } else if (typeof value === "string") {
      urlSearchParams.append(key, value);
    }
  });

  const dateRange = getDateRangeFromUrl(urlSearchParams, prefix);
  return {
    startDate: dateRange.from || defaultStartDate,
    endDate: dateRange.to || defaultEndDate,
  };
};

export const parseDate = (dateString: string | null): Date | undefined => {
  if (!dateString) {
    return undefined;
  }
  const parsedDate = new Date(dateString);
  return isNaN(parsedDate.getTime()) ? undefined : parsedDate;
};

const isToday = (date: Date): boolean => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

export const TIME_INTERVALS: TimeInterval[] = [
  { value: TimeIntervalEnum.ONE_DAY, label: "1 day", days: 1 },
  { value: TimeIntervalEnum.THREE_DAYS, label: "3 days", days: 3 },
  { value: TimeIntervalEnum.ONE_WEEK, label: "1 week", days: 7 },
  { value: TimeIntervalEnum.TWO_WEEKS, label: "2 weeks", days: 14 },
  { value: TimeIntervalEnum.ONE_MONTH, label: "1 month", days: 30 },
  { value: TimeIntervalEnum.THREE_MONTHS, label: "3 months", days: 90 },
  { value: TimeIntervalEnum.SIX_MONTHS, label: "6 months", days: 180 },
  { value: TimeIntervalEnum.ONE_YEAR, label: "1 year", days: 365 },
  { value: TimeIntervalEnum.TWO_YEARS, label: "2 years", days: 730 },
  { value: TimeIntervalEnum.THREE_YEARS, label: "3 years", days: 1095 },
];

export const determineTimeInterval = (from: Date, to: Date): TimeIntervalEnum => {
  if (!isToday(to)) {
    return TimeIntervalEnum.CUSTOM;
  }
  const diffDays = differenceInDays(to, from);
  const interval = TIME_INTERVALS.find((interval) => interval.days === diffDays);
  return interval ? interval.value : TimeIntervalEnum.CUSTOM;
};

export const getDateRangeFromUrl = (searchParams: URLSearchParams, prefix: string): DateRange => {
  const fromDate = parseDate(searchParams.get(`${prefix}-start-date`));
  const toDate = parseDate(searchParams.get(`${prefix}-end-date`));
  const now = new Date();

  if (fromDate && toDate) {
    return {
      from: startOfDay(fromDate),
      to: toDate > now ? now : toDate,
    };
  }

  return {
    from: startOfDay(addDays(now, -7)),
    to: now,
  };
};

export const AGGREGATION_RULES: AggregationRule[] = [
  {
    maxDays: 4,
    intervalInMinutes: AggregationInterval.FOUR_HOURS,
    incrementDate: (date: Date) => addHours(date, 4),
  },
  {
    maxDays: 12,
    intervalInMinutes: AggregationInterval.DAILY,
    incrementDate: (date: Date) => addDays(date, 1),
  },
  {
    maxDays: 40,
    intervalInMinutes: AggregationInterval.WEEKLY,
    incrementDate: (date: Date) => addWeeks(date, 1),
  },
  {
    maxDays: 500,
    intervalInMinutes: AggregationInterval.MONTHLY,
    incrementDate: (date: Date) => addMonths(date, 1),
  },
  {
    maxDays: Infinity,
    intervalInMinutes: AggregationInterval.YEARLY,
    incrementDate: (date: Date) => addYears(date, 1),
  },
];

export function determineAggregationRule(startDate: Date, endDate: Date): AggregationRule {
  if (startDate > endDate) {
    throw new Error("startDate must be less than or equal to endDate");
  }

  const totalDays = differenceInDays(endDate, startDate);

  for (const rule of AGGREGATION_RULES) {
    if (totalDays <= rule.maxDays) {
      return rule;
    }
  }
  return AGGREGATION_RULES[AGGREGATION_RULES.length - 1];
}

export const fillMissingData = (
  data: ActiveUsersResponse[],
  aggregationRule: AggregationRule,
  endDate: Date
): ActiveUsersResponse[] => {
  const completeData: ActiveUsersResponse[] = [];

  const dataMap = new Map<string, number>(data.map((item) => [item.timestamp, item.value]));

  const firstNonZeroIndex = data.findIndex((item) => item.value > 0);
  if (firstNonZeroIndex === -1) {
    return completeData;
  }

  const lastNonZeroIndex = data.length - 1 - [...data].reverse().findIndex((item) => item.value > 0);

  const filteredData = data.slice(firstNonZeroIndex, lastNonZeroIndex + 1);

  let currentDate = new Date(filteredData[0].timestamp);

  while (isBefore(currentDate, endDate) || isEqual(currentDate, endDate)) {
    const timestamp = currentDate.toISOString();
    const value = dataMap.get(timestamp) ?? 0;
    if (
      isBefore(currentDate, new Date(filteredData[0].timestamp)) ||
      isAfter(currentDate, new Date(filteredData[filteredData.length - 1].timestamp))
    ) {
      currentDate = aggregationRule.incrementDate(currentDate);
      continue;
    }
    completeData.push({ timestamp, value });
    currentDate = aggregationRule.incrementDate(currentDate);
  }

  return completeData;
};
