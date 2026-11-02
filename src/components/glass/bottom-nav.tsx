"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Dumbbell, ListChecks, Settings2, Sunrise } from "lucide-react";
import { cn } from "cn";

const tabs = [
  { href: "/", label: "今日", icon: Sunrise },
  { href: "/plan", label: "计划", icon: ListChecks },
  { href: "/library", label: "动作库", icon: Dumbbell },
  { href: "/stats", label: "统计", icon: BarChart3 },
  { href: "/settings", label: "设置", icon: Settings2 },
] as const;

/** 液态玻璃底部 Tab 导航（同屏唯一常驻 backdrop-filter 元素之一） */
export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="主导航"
      className="fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 mb-safe"
    >
      <div className="glass glass-sheen flex w-full max-w-[430px] items-center justify-between gap-1 rounded-[28px] px-2 py-1.5">
        {tabs.map((tab) => {
          const active =
            tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-2xl px-1 py-1.5 transition-colors",
                active
                  ? "bg-white/55 text-[var(--primary)] dark:bg-white/10"
                  : "text-[var(--muted-foreground)]"
              )}
            >
              <Icon size={20} strokeWidth={active ? 2.4 : 2} />
              <span className="text-[11px] font-medium leading-none">
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
