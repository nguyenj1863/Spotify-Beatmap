// components/ui/skeleton.tsx
"use client";

import React from "react";
import clsx from "clsx";

/**
 * Generic Skeleton — base block for any placeholder shape.
 * Control size/shape via Tailwind classes passed in `className`.
 */
export const Skeleton: React.FC<{
  className?: string;
  /** true = rounded-md, string = custom rounded class, false/undefined = none */
  rounded?: boolean | string;
}> = ({ className, rounded = true }) => (
  <div
    aria-hidden="true"
    className={clsx(
      "animate-pulse bg-white/10",
      rounded === true ? "rounded-md" : rounded ? rounded : "",
      className
    )}
  />
);

/** Single-line skeleton (inline-friendly) */
export const LineSkeleton: React.FC<{ width?: string; className?: string }> = ({
  width = "w-32",
  className,
}) => (
  <span
    aria-hidden="true"
    className={clsx("inline-block h-3 rounded bg-white/10 animate-pulse align-middle", width, className)}
  />
);

/** Circle avatar placeholder */
export const AvatarSkeleton: React.FC<{ size?: number }> = ({ size = 40 }) => (
  <Skeleton className="bg-white/10" rounded="rounded-full" />
);

/** Compact media/list item card skeleton */
export const CardSkeleton: React.FC = () => (
  <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3">
    <Skeleton className="h-12 w-12 rounded-md" />
    <div className="min-w-0 flex-1 space-y-2">
      <LineSkeleton width="w-44" />
      <LineSkeleton width="w-28" />
    </div>
  </div>
);
