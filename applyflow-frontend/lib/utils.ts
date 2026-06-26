import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

export function toDateInputValue(value: string) {
  return new Date(value).toISOString().slice(0, 10);
}

export function toUtcDateTime(value: string) {
  return new Date(`${value}T00:00:00.000Z`).toISOString();
}

const statusColorMap: Record<string, string> = {
  Applied: "border-blue-200 bg-blue-50 text-blue-700",
  Screening: "border-cyan-200 bg-cyan-50 text-cyan-700",
  Interview: "border-violet-200 bg-violet-50 text-violet-700",
  Offer: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Rejected: "border-rose-200 bg-rose-50 text-rose-700",
  Withdrawn: "border-amber-200 bg-amber-50 text-amber-700",
};

export function getStatusBadgeClass(status: string) {
  return (
    statusColorMap[status] ?? "border-slate-200 bg-slate-50 text-slate-700"
  );
}
