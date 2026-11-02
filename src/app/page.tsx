"use client";

import { GlassCard } from "@/components/glass/glass-card";
import { ProgressRing } from "@/components/glass/progress-ring";
import { SlotCard } from "@/components/home/slot-card";
import { useDuantiStore, useHydrated, getSlotView } from "@/lib/store";
import { computeStreak, weekProgress } from "@/lib/stats";
import { getPlanSlot } from "@/lib/plan-defaults";
import { todayLocalISO } from "@/lib/date";
import { PERIODS } from "@/lib/types";
import type { Scenario } from "@/lib/types";

const WEEKDAYS = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

function formatDateCN(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, (m ?? 1) - 1, d ?? 1);
  return `${m}月${d}日 ${WEEKDAYS[date.getDay()]}`;
}

/** 今日首页：打卡头卡 + 早/中/晚三张时段卡片 */
export default function Home() {
  const hydrated = useHydrated();
  const planConfig = useDuantiStore((s) => s.planConfig);
  const logs = useDuantiStore((s) => s.logs);
  const toggleItemDone = useDuantiStore((s) => s.toggleItemDone);
  const completeSlot = useDuantiStore((s) => s.completeSlot);
  const setSlotScenario = useDuantiStore((s) => s.setSlotScenario);

  if (!hydrated) {
    return (
      <div className="flex flex-col gap-4" aria-busy>
        <div className="h-24 rounded-[24px] bg-black/5 dark:bg-white/5" />
        <div className="h-64 rounded-[24px] bg-black/5 dark:bg-white/5" />
        <div className="h-56 rounded-[24px] bg-black/5 dark:bg-white/5" />
        <div className="h-56 rounded-[24px] bg-black/5 dark:bg-white/5" />
      </div>
    );
  }

  const today = todayLocalISO();
  const streak = computeStreak(logs, today);
  const week = weekProgress(logs, today);

  return (
    <div className="flex flex-col gap-4">
      {/* 打卡头卡 */}
      <GlassCard className="flex items-center justify-between p-5">
        <div>
          <p className="text-sm text-[var(--muted-foreground)]">{formatDateCN(today)}</p>
          <p className="mt-1 text-[28px] font-bold leading-none">
            连续 <span className="text-[var(--primary)]">{streak}</span> 天
          </p>
          <p className="mt-1.5 text-xs text-[var(--muted-foreground)]">
            本周已完成 {week.daysCompleted} 天 · {week.doneItems}/{week.totalItems} 项
          </p>
        </div>
        <ProgressRing value={week.value} size={76} strokeWidth={9}>
          <span className="text-lg font-bold">{Math.round(week.value * 100)}%</span>
          <span className="text-[10px] text-[var(--muted-foreground)]">本周</span>
        </ProgressRing>
      </GlassCard>

      {/* 早/中/晚三张时段卡片 */}
      {PERIODS.map((period) => {
        const slot = getSlotView(planConfig, logs, today, period);
        const planItems =
          getPlanSlot(planConfig, period, slot.scenario ?? "indoor")?.items ?? [];
        return (
          <SlotCard
            key={period}
            period={period}
            slot={slot}
            planItems={planItems}
            onToggleItem={(exerciseId) => toggleItemDone(today, period, exerciseId)}
            onCompleteSlot={() => completeSlot(today, period)}
            onScenarioChange={(scenario: Scenario) =>
              setSlotScenario(today, period, scenario)
            }
          />
        );
      })}
    </div>
  );
}
