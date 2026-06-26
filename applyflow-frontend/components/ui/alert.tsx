import * as React from "react";
import { cn } from "@/lib/utils";

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "destructive";
}

export function Alert({ className, variant = "default", ...props }: AlertProps) {
  return (
    <div
      role="alert"
      className={cn(
        "rounded-xl border px-4 py-3 text-sm shadow-sm",
        variant === "destructive"
          ? "border-red-200 bg-red-50 text-red-900"
          : "border-indigo-100 bg-indigo-50 text-indigo-950",
        className,
      )}
      {...props}
    />
  );
}
