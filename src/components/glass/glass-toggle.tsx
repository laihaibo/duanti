"use client";

import * as React from "react";
import { cn } from "cn";

export interface GlassToggleOption<T extends string> {
  value: T;
  label: string;
}

interface GlassToggleProps<T extends string> {
  options: GlassToggleOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  ariaLabel?: string;
}

/** 分段切换控件（Liquid Glass 小胶囊，选中项白色浮起） */
export function GlassToggle<T extends string>({
  options,
  value,
  onChange,
  className,
  ariaLabel,
}: GlassToggleProps<T>) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full p-0.5",
        "border border-[var(--glass-border)] bg-black/5 dark:bg-white/10",
        className
      )}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            role="tab"
            aria-selected={active}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              "rounded-full px-3 py-1 text-[13px] font-medium leading-none transition-all",
              active
                ? "bg-[var(--card)] text-[var(--foreground)] shadow-sm"
                : "text-[var(--muted-foreground)]"
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
