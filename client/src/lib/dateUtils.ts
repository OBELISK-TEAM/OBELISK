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
  isBefore,
  isEqual,
  isAfter,
  addHours,
  addMinutes,
} from "date-fns";
import { TimeUnit } from "@/interfaces/time-unit";
import { DateRange as IDateRange } from "@/interfaces/date-range";
import { TimeInterval } from "@/interfaces/time-interval";
import { TimeIntervalEnum } from "@/enums/statistics/TimeInterval";
import { DateRange } from "react-day-picker";
import { AggregationInterval } from "@/enums/statistics/AggregationInterval";
import { ActiveUsersResponse } from "@/interfaces/responses/statistics/active-users-response";
import { AggregationRule } from "@/interfaces/stats/aggregation-rule";
import { statsConfig } from "@/config/statsConfig";
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
  defaultStartDate: Date = statsConfig.defaultStartDate,
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
  { value: TimeIntervalEnum.ONE_HOUR, label: "1 hour", minutes: 60 },
  { value: TimeIntervalEnum.TWO_HOURS, label: "2 hours", minutes: 120 },
  { value: TimeIntervalEnum.FOUR_HOURS, label: "4 hours", minutes: 240 },
  { value: TimeIntervalEnum.ONE_DAY, label: "1 day", minutes: 1440 },
  { value: TimeIntervalEnum.THREE_DAYS, label: "3 days", minutes: 4320 },
  { value: TimeIntervalEnum.ONE_WEEK, label: "1 week", minutes: 10080 },
  { value: TimeIntervalEnum.TWO_WEEKS, label: "2 weeks", minutes: 20160 },
];

export const determineTimeInterval = (from: Date, to: Date): TimeIntervalEnum => {
  if (!isToday(to)) {
    return TimeIntervalEnum.CUSTOM;
  }
  const diffDate = differenceInMinutes(to, from);
  const interval = TIME_INTERVALS.find((interval) => interval.minutes === diffDate);
  return interval ? interval.value : TimeIntervalEnum.CUSTOM;
};

export const getDateRangeFromUrl = (searchParams: URLSearchParams, prefix: string): DateRange => {
  const fromDate = parseDate(searchParams.get(`${prefix}-start-date`));
  const toDate = parseDate(searchParams.get(`${prefix}-end-date`));
  const now = new Date();

  if (fromDate && toDate) {
    return {
      from: fromDate,
      to: toDate > now ? now : toDate,
    };
  }

  return {
    from: statsConfig.defaultStartDate,
    to: now,
  };
};

export const AGGREGATION_RULES: AggregationRule[] = [
  {
    maxMinutes: 120, // To 2 hours
    intervalInMinutes: AggregationInterval.FIVE_MINUTES,
    incrementDate: (date: Date) => addMinutes(date, 5),
  },
  {
    maxMinutes: 360, // To 6 hours
    intervalInMinutes: AggregationInterval.FIFTEEN_MINUTES,
    incrementDate: (date: Date) => addMinutes(date, 15),
  },
  {
    maxMinutes: 720, // To 12 hours
    intervalInMinutes: AggregationInterval.THIRTY_MINUTES,
    incrementDate: (date: Date) => addMinutes(date, 30),
  },
  {
    maxMinutes: 1440, // To 24 hours
    intervalInMinutes: AggregationInterval.ONE_HOUR,
    incrementDate: (date: Date) => addHours(date, 1),
  },

  {
    maxMinutes: 5760, // To 4 days (96 hours)
    intervalInMinutes: AggregationInterval.FOUR_HOURS,
    incrementDate: (date: Date) => addHours(date, 4),
  },
  {
    maxMinutes: 34560, // To 24 days (576 hours)
    intervalInMinutes: AggregationInterval.DAILY,
    incrementDate: (date: Date) => addDays(date, 1),
  },
];

export function determineAggregationRule(startDate: Date, endDate: Date): AggregationRule {
  if (startDate > endDate) {
    const temp = startDate;
    startDate = endDate;
    endDate = temp;
  }

  const totalDays = differenceInMinutes(endDate, startDate);

  for (const rule of AGGREGATION_RULES) {
    if (totalDays <= rule.maxMinutes) {
      return rule;
    }
  }
  return AGGREGATION_RULES[AGGREGATION_RULES.length - 1];
}

export const fillMissingDates = (
  data: ActiveUsersResponse[],
  aggregationRule: AggregationRule,
  startDate: Date,
  endDate: Date
): ActiveUsersResponse[] => {
  const completeData: ActiveUsersResponse[] = [];
  const dataMap = new Map<string, number>(data.map((item) => [item.timestamp, item.value]));
  let currentDate = new Date(startDate);

  while (isBefore(currentDate, endDate) || isEqual(currentDate, endDate)) {
    const timestamp = currentDate.toISOString();
    const value = dataMap.get(timestamp) ?? 0;
    completeData.push({ timestamp, value });
    currentDate = aggregationRule.incrementDate(currentDate);
  }

  return completeData;
};

export const timeInHoursAndMinutesOrSeconds = (milliseconds: number): string => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const seconds = totalSeconds % 60;

  if (hours === 0 && minutes === 0) {
    return `${seconds} sec`;
  }

  return hours > 0 ? `${hours} h ${minutes} min` : `${minutes} min`;
};
