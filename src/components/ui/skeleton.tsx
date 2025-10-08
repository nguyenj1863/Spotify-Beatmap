"use client";

import React from "react";
import clsx from "clsx";

/**
 * Generic Skeleton component — base building block for all skeleton states.
 * Use Tailwind classes for width/height to control shape.
 */
export const Skeleton: React.FC<{
  className?: string;
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

/** Circle avatar placeholder */
export const AvatarSkeleton: React.FC<{ size?: number }> = ({ size = 64 }) => (
  <Skeleton
    className="bg-white/10"
    rounded="rounded-full"
    style={{ width: size, height: size }}
  />
);

/** Horizontal line placeholder (like text) */
export const LineSkeleton: React.FC<{ width?: string }> = ({
  width = "w-40",
}) => <Skeleton className={clsx(width, "h-3")} />;

/** Card placeholder — for grids, playlists, etc. */
export const CardSkeleton: React.FC = () => (
  <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3">
    <Skeleton className="h-12 w-12 rounded-md" />
    <div className="min-w-0 flex-1 space-y-2">
      <LineSkeleton width="w-44" />
      <LineSkeleton width="w-28" />
    </div>
  </div>
);
