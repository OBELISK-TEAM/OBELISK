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
