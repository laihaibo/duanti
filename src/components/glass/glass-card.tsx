import * as React from "react";
import { cn } from "cn";

export type PeriodAccent = "morning" | "noon" | "evening" | "neutral";

const accentVars: Record<PeriodAccent, React.CSSProperties> = {
  morning: { "--card-accent": "var(--accent-morning)" } as React.CSSProperties,
  noon: { "--card-accent": "var(--accent-noon)" } as React.CSSProperties,
  evening: { "--card-accent": "var(--accent-evening)" } as React.CSSProperties,
  neutral: { "--card-accent": "var(--primary)" } as React.CSSProperties,
};

/**
 * 液态玻璃卡片：blur(24px) saturate(180%)、24px 圆角、半透明白边框、多层阴影。
 * accent 传入时段色，供卡片内部元素通过 var(--card-accent) 取色。
 * 注意：同屏 backdrop-filter 数量需控制在 6 个以内。
 */
export function GlassCard({
  accent = "neutral",
  className,
  style,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { accent?: PeriodAccent }) {
  return (
    <div
      className={cn("glass glass-radius glass-sheen", className)}
      style={{ ...accentVars[accent], ...style }}
      {...props}
    />
  );
}
