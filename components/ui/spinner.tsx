import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl";
  label?: string;
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
  xl: "h-12 w-12",
};

export function Spinner({
  size = "md",
  label,
  className,
  ...props
}: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label={label || "Loading"}
      className={cn("flex flex-col items-center justify-center gap-3", className)}
      {...props}
    >
      <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
      {label && (
        <p className="text-sm font-medium text-muted-foreground animate-pulse">
          {label}
        </p>
      )}
      <span className="sr-only">{label || "Loading..."}</span>
    </div>
  );
}

export function LoadingScreen({
  label = "Loading...",
}: {
  label?: string;
}) {
  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center p-8">
      <Spinner size="xl" label={label} />
    </div>
  );
}
