import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility function to conditionally join Tailwind CSS classes together.
 * Resolves conflicts dynamically using `tailwind-merge`.
 * 
 * @param inputs - Array of class values or conditional class objects.
 * @returns A strictly merged class string free of duplicates.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
