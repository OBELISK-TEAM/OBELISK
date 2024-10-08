// Import necessary functions from date-fns
import {
  parseISO,
  differenceInSeconds,
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
  differenceInWeeks,
  differenceInMonths,
  differenceInYears,
} from "date-fns";

/**
 * Converts a date string into a human-readable relative time format.
 *
 * @param dateString - The date string to convert (ISO format recommended).
 * @returns A human-readable string representing how long ago the date was.
 */
export function prettyDate(dateString: string): string {
  // Parse the input date string to a Date object
  const inputDate = parseISO(dateString);
  const now = new Date();

  // Calculate the difference in various units
  const seconds = differenceInSeconds(now, inputDate);
  const minutes = differenceInMinutes(now, inputDate);
  const hours = differenceInHours(now, inputDate);
  const days = differenceInDays(now, inputDate);
  const weeks = differenceInWeeks(now, inputDate);
  const months = differenceInMonths(now, inputDate);
  const years = differenceInYears(now, inputDate);

  // Handle future dates
  if (seconds < 0) {
    return "in the future";
  }

  // Less than one minute ago
  if (seconds < 60) {
    return `${seconds} seconds ago`;
  }

  // Less than one hour ago
  if (minutes < 60) {
    return minutes === 1 ? "a minute ago" : `${minutes} minutes ago`;
  }

  // Less than one day ago
  if (hours < 24) {
    return hours === 1 ? "an hour ago" : `${hours} hours ago`;
  }

  // Less than one week ago
  if (days < 7) {
    return days === 1 ? "a day ago" : `${days} days ago`;
  }

  // Less than two weeks ago
  if (days < 14) {
    return "a week ago";
  }

  // Less than three weeks ago
  if (days < 21) {
    return "2 weeks ago";
  }

  // Less than a month ago
  if (days < 30) {
    return `${weeks} weeks ago`;
  }

  // Less than two months ago
  if (months < 2) {
    return "a month ago";
  }

  // Less than one year ago
  if (months < 12) {
    return `${months} months ago`;
  }

  // One year or more ago
  if (years === 1) {
    return "a year ago";
  } else {
    return `${years} years ago`;
  }
}
