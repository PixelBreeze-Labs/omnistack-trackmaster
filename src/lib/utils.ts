// lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names using clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number as currency
 * @param amount - The amount to format
 * @param currency - The currency code (default: 'ALL')
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, currency: string = 'ALL'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
}

/**
 * Formats a date as a relative time string
 * @param date - The date to format
 * @param options - Formatting options
 * @returns Relative time string (e.g., "2 hours ago", "in 3 days")
 */
export function formatRelativeTime(
  date: Date,
  options: { style?: 'long' | 'short' | 'narrow' } = {}
): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  const rtf = new Intl.RelativeTimeFormat('en', {
    numeric: 'auto',
    style: options.style || 'long'
  });

  // Convert to appropriate time unit
  if (Math.abs(diffInSeconds) < 60) {
    return rtf.format(-Math.floor(diffInSeconds), 'second');
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (Math.abs(diffInMinutes) < 60) {
    return rtf.format(-diffInMinutes, 'minute');
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (Math.abs(diffInHours) < 24) {
    return rtf.format(-diffInHours, 'hour');
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (Math.abs(diffInDays) < 7) {
    return rtf.format(-diffInDays, 'day');
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (Math.abs(diffInWeeks) < 4) {
    return rtf.format(-diffInWeeks, 'week');
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (Math.abs(diffInMonths) < 12) {
    return rtf.format(-diffInMonths, 'month');
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return rtf.format(-diffInYears, 'year');
}

/**
 * Formats a date string in a localized format
 * @param date - The date to format
 * @param options - DateTimeFormat options
 * @returns Formatted date string
 */
export function formatDate(
  date: string | Date,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', options).format(dateObj);
}

/**
 * Format file size in bytes to human readable format
 * @param bytes - Number of bytes
 * @returns Formatted string (e.g., "1.5 MB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Format number with thousand separators
 * @param num - Number to format
 * @returns Formatted string
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

/**
 * Convert snake_case or kebab-case to Title Case
 * @param str - String to convert
 * @returns Formatted string
 */
export function toTitleCase(str: string): string {
  return str
    .replace(/[-_]/g, ' ')
    .replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

/**
 * Truncates a string to a maximum length with ellipsis
 * @param str - String to truncate
 * @param maxLength - Maximum length
 * @returns Truncated string
 */
export function truncateString(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength)}...`;
}

/**
 * Debounce a function
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Formats a date string with time in a localized format
 * @param date - The date to format
 * @returns Formatted date and time string
 */
export function formatDateTime(
  date: string | Date
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(dateObj);
}