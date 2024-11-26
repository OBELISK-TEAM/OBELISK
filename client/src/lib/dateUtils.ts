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
  addWeeks,
  addMonths,
  addYears,
} from "date-fns";
import { TimeUnit } from "@/interfaces/time-unit";
import { DateRange } from "@/interfaces/date-range";
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

/**
 * Parses dates from searchParams based on prefix.
 *
 * @param searchParams - URL parameters
 * @param prefix - Prefix used to name parameters
 * @param defaultStartDate - Default start date (optional)
 * @param defaultEndDate - Default end date (optional)
 * @returns An object containing startDate and endDate
 */
export const parseDateRange = (
  searchParams: { [key: string]: string | string[] | undefined },
  prefix: string,
  defaultStartDate: Date = addDays(new Date(), -7),
  defaultEndDate: Date = new Date()
): DateRange => {
  const parseDate = (dateParam: string | string[] | undefined, defaultDate: Date): Date => {
    const dateStr = Array.isArray(dateParam) ? dateParam[0] : dateParam;
    const parsedDate = dateStr ? new Date(dateStr) : defaultDate;
    return isNaN(parsedDate.getTime()) ? defaultDate : parsedDate;
  };

  const startParam = searchParams[`${prefix}-start-date`];
  const endParam = searchParams[`${prefix}-end-date`];

  return {
    startDate: parseDate(startParam, defaultStartDate),
    endDate: parseDate(endParam, defaultEndDate),
  };
};
