import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatDate(x) {
  const date = new Date(x)
  const formatted = date.toLocaleDateString('th-TH', {
    // weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  return formatted
}