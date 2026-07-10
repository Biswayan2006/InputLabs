import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { KeyboardProduct, MonitorProduct } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

export function getRatingColor(rating: number): string {
  if (rating >= 9.5) return "text-emerald-500";
  if (rating >= 9.0) return "text-green-500";
  if (rating >= 8.5) return "text-yellow-500";
  if (rating >= 8.0) return "text-orange-400";
  return "text-red-400";
}

export function getRatingLabel(rating: number): string {
  if (rating >= 9.5) return "Outstanding";
  if (rating >= 9.0) return "Excellent";
  if (rating >= 8.5) return "Very Good";
  if (rating >= 8.0) return "Good";
  return "Average";
}

export function filterKeyboardsByBudget(keyboards: KeyboardProduct[], max: number): KeyboardProduct[] {
  return keyboards.filter((k) => k.price <= max);
}

export function filterMonitorsByBudget(monitors: MonitorProduct[], max: number): MonitorProduct[] {
  return monitors.filter((m) => m.price <= max);
}

/**
 * Predefined colors for shape overlay.
 * Supports up to 6 mice simultaneously.
 */
export const SHAPE_COLORS = [
  { fill: "rgba(99,102,241,0.25)",  stroke: "#6366f1", label: "Indigo"  },
  { fill: "rgba(239,68,68,0.25)",   stroke: "#ef4444", label: "Red"     },
  { fill: "rgba(34,197,94,0.25)",   stroke: "#22c55e", label: "Green"   },
  { fill: "rgba(251,191,36,0.25)",  stroke: "#fbbf24", label: "Amber"   },
  { fill: "rgba(236,72,153,0.25)",  stroke: "#ec4899", label: "Pink"    },
  { fill: "rgba(14,165,233,0.25)",  stroke: "#0ea5e9", label: "Sky"     },
];
