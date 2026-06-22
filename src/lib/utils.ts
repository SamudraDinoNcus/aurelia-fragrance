import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Menggabungkan beberapa className, menyelesaikan konflik utility Tailwind
 * (misal: "px-2" vs "px-4") dengan benar. Dipakai oleh semua komponen di
 * /src/components/ui dan /src/components/shared.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
