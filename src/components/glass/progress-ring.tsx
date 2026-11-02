"use client";

import * as React from "react";
import { cn } from "cn";

interface ProgressRingProps {
  /** 0 ~ 1 */
  value: number;
  /** 直径 px，默认 72 */
  size?: number;
  /** 描边宽度 px，默认 8 */
  strokeWidth?: number;
  /** 进度色，默认系统蓝 */
  color?: string;
  /** 轨道色 */
  trackColor?: string;
  className?: string;
  children?: React.ReactNode;
}

/** SVG 环形进度（本周完成度环） */
export function ProgressRing({
  value,
  size = 72,
  strokeWidth = 8,
  color = "var(--primary)",
  trackColor = "var(--border)",
  className,
  children,
}: ProgressRingProps) {
  const clamped = Math.min(1, Math.max(0, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`完成度 ${Math.round(clamped * 100)}%`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - clamped)}
          style={{ transition: "stroke-dashoffset 0.4s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
}
