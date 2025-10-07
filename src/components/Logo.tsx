"use client";

import React, { useId, useMemo } from "react";
import { motion, useReducedMotion, type Transition } from "framer-motion";

/**
 * Animated logo with subtle spin / breathe / equalizer motions.
 *
 * Accessibility:
 * - If you pass a `title`, the SVG will be exposed to AT and labelled.
 * - Without a `title`, it’s `aria-hidden`.
 *
 * Reduced Motion:
 * - Respects `prefers-reduced-motion` and disables all animations.
 */
type LogoProps = {
  /** Optional text label for screen readers. If omitted, SVG is aria-hidden. */
  title?: string;
  /** Tailwind or custom className applied to the outer SVG wrapper. */
  className?: string;
  /** Primary brand color (defaults to Spotify green). */
  primary?: string;
  /** Secondary/dark color used in gradient (defaults to Spotify near-black). */
  secondary?: string;
};

export default function Logo({
  title,
  className = "text-white h-auto aspect-square w-[22vw] sm:w-[18vw] md:w-[14vw] lg:w-[10vw] min-w-24 max-w-48",
  primary = "#1DB954",
  secondary = "#191414",
}: LogoProps) {
  const prefersReduced = useReducedMotion();
  const gid = useId(); // unique suffix for gradient IDs to avoid collisions if rendered multiple times

  /**
   * Shared transition settings — easy to tweak in one place.
   */
  const linearLoop: Transition = { duration: 17, ease: "linear", repeat: Infinity };
  const easeLoop: Transition = { duration: 3.8, ease: "easeInOut", repeat: Infinity };

  /**
   * Precompute animation targets. If reduced motion is preferred, we return empty
   * objects so Framer skips animating entirely.
   */
  const { spin, breathe, pulse, barAnimCentered } = useMemo(() => {
    if (prefersReduced) {
      return {
        spin: {},
        breathe: {},
        pulse: {},
        barAnimCentered: (_h0: number, _h1: number, _delay = 0) => ({} as any),
      };
    }

    return {
      // slow orbit for the outer glow dashes
      spin: { rotate: 360, transition: linearLoop },

      // gentle scale "breath" on the inner disc
      breathe: { scale: [1, 1.05, 1], transition: easeLoop },

      // soft pulse on the outer halo
      pulse: {
        scale: [1, 1.2, 1],
        opacity: [0.2, 0.6, 0.2],
        transition: easeLoop,
      },

      // Equalizer bar animation helper that keeps bars vertically centered
      barAnimCentered: (h0: number, h1: number, delay = 0) => ({
        y: [-h0 / 2, -h1 / 2, -h0 / 2],
        height: [h0, h1, h0],
        transition: { duration: 2.4, ease: "easeInOut", repeat: Infinity, delay },
      }),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefersReduced]);

  /**
   * Equalizer bar geometry: centered group, so x positions are around (0,0).
   * Keep numbers small and readable.
   */
  const BW = 5; // bar width
  const GAP = 8; // gap between bars

  const X_MID = -BW / 2;            // -2.5
  const X_LEFT = X_MID - (BW + GAP);  // -15.5
  const X_RIGHT = X_MID + (BW + GAP); //  10.5

  const ariaProps = title
    ? { role: "img" as const, "aria-label": title }
    : { "aria-hidden": true };

  return (
    <div className="relative flex items-center justify-center">
      <motion.div
        className="flex items-center justify-center"
        whileHover={
          prefersReduced
            ? undefined
            : { rotate: [0, -2, 2, 0], scale: 1.08, transition: { duration: 0.6 } }
        }
      >
        {/* Responsive, composable SVG. `currentColor` allows external text color to tint strokes if desired. */}
        <motion.svg
          className={className}
          viewBox="0 0 140 140"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          {...ariaProps}
        >
          {title ? <title>{title}</title> : null}

          {/* ---- Gradients (IDs are suffixed to avoid DOM collisions) ---- */}
          <defs>
            <radialGradient id={`grad-radial-${gid}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={primary} stopOpacity="1" />
              <stop offset="100%" stopColor={primary} stopOpacity="0" />
            </radialGradient>

            <linearGradient id={`grad-linear-${gid}`} x1="0" y1="0" x2="100" y2="100">
              <stop offset="0%" stopColor={primary} />
              <stop offset="100%" stopColor={secondary} />
            </linearGradient>
          </defs>

          {/* ---- Outer Halo Pulse ---- */}
          <motion.circle
            cx="70"
            cy="70"
            r="55"
            stroke={primary}
            strokeWidth="5"
            strokeOpacity="0.35"
            fill="none"
            animate={pulse}
          />

          {/* ---- Outer Glow Ring (slow spin) ---- */}
          <motion.g style={{ originX: "70px", originY: "70px" }} animate={spin}>
            <circle
              cx="70"
              cy="70"
              r="50"
              stroke={`url(#grad-radial-${gid})`}
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="300 80"
            />
          </motion.g>

          {/* ---- Inner Disc (gentle breathe) ---- */}
          <motion.circle
            cx="70"
            cy="70"
            r="40"
            fill={`url(#grad-linear-${gid})`}
            animate={breathe}
            style={{ originX: "70px", originY: "70px" }}
          />

          {/* ---- Centered Equalizer Bars ----
               The group is centered at (70,82); bars are drawn around (0,0). */}
          <g transform="translate(70 82)">
            {/* Left bar */}
            <motion.rect
              x={X_LEFT}
              y={-20 / 2}
              width={BW}
              height={20}
              rx={1.5}
              fill="white"
              opacity="0.9"
              animate={barAnimCentered(20, 32, 0.0)}
            />

            {/* Middle (tallest) bar */}
            <motion.rect
              x={X_MID}
              y={-32 / 2}
              width={BW}
              height={32}
              rx={1.5}
              fill="white"
              opacity="0.9"
              animate={barAnimCentered(32, 42, 0.25)}
            />

            {/* Right bar */}
            <motion.rect
              x={X_RIGHT}
              y={-18 / 2}
              width={BW}
              height={18}
              rx={1.5}
              fill="white"
              opacity="0.9"
              animate={barAnimCentered(18, 26, 0.5)}
            />
          </g>

          {/* ---- Inner Glow Rim (static for contrast) ---- */}
          <circle
            cx="70"
            cy="70"
            r="40"
            fill="none"
            stroke="white"
            strokeOpacity="0.15"
            strokeWidth="2"
          />
        </motion.svg>
      </motion.div>

      {/* Subtle floor glow */}
      <div className="pointer-events-none absolute inset-x-0 -bottom-1 flex justify-center">
        <div className="h-4 w-2/3 md:w-1/2 rounded-full bg-emerald-400/30 blur-xl" />
      </div>
    </div>
  );
}
