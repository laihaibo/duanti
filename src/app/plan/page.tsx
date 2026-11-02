"use client";

import { GlassCard } from "@/components/glass/glass-card";
import { useDuantiStore, useHydrated } from "@/lib/store";
import { getPlanSlot } from "@/lib/plan-defaults";
import { getExercise } from "@/lib/exercises";
import { PERIODS, PERIOD_LABELS } from "@/lib/types";
import type { Period, PlanItem, Scenario } from "@/lib/types";
import { Minus, Plus } from "lucide-react";
import { cn } from "cn";

const SCENARIO_LABELS: Record<Scenario, string> = {
  outdoor: "户外方案",
  indoor: "雨天室内方案",
};

const ACCENTS: Record<Period, "morning" | "noon" | "evening"> = {
  morning: "morning",
  noon: "noon",
  evening: "evening",
};

const ACCENT_COLORS = {
  morning: "var(--accent-morning)",
  noon: "var(--accent-noon)",
  evening: "var(--accent-evening)",
} as const;

function fmtDuration(sec: number): string {
  return sec % 60 === 0 ? `${sec / 60} 分钟` : `${sec} 秒`;
}

function Stepper({
  label,
  value,
  display,
  onDecrement,
  onIncrement,
}: {
  label: string;
  value: number;
  display: string;
  onDecrement: () => void;
  onIncrement: () => void;
}) {
  const btn =
    "flex h-7 w-7 items-center justify-center rounded-full border border-[var(--glass-border)] text-[var(--foreground)] active:scale-90 transition-transform disabled:opacity-30";
  return (
    <div className="flex items-center gap-1">
      <span className="mr-0.5 text-xs text-[var(--muted-foreground)]">{label}</span>
      <button type="button" className={btn} onClick={onDecrement} disabled={value <= 1} aria-label={`减少${label}`}>
        <Minus size={13} />
      </button>
      <span className="w-[52px] text-center text-[13px] font-medium tabular-nums">{display}</span>
      <button type="button" className={btn} onClick={onIncrement} aria-label={`增加${label}`}>
        <Plus size={13} />
      </button>
    </div>
  );
}

function ItemRow({
  item,
  onPatch,
}: {
  item: PlanItem;
  onPatch: (patch: Partial<PlanItem>) => void;
}) {
  const exercise = getExercise(item.exerciseId);
  if (!exercise) return null;

  const durStep = (item.durationSec ?? 60) >= 300 ? 30 : 15;
  const maxDur = 3600;

  return (
    <div className="rounded-2xl border border-[var(--glass-border)] px-3 py-2.5">
      <p className="text-[14px] font-medium leading-tight">{exercise.name}</p>
      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5">
        {item.sets != null && (
          <Stepper
            label="组"
            value={item.sets}
            display={`${item.sets} 组`}
            onDecrement={() => onPatch({ sets: Math.max(1, item.sets! - 1) })}
            onIncrement={() => onPatch({ sets: Math.min(10, item.sets! + 1) })}
          />
        )}
        {item.reps != null && (
          <Stepper
            label="次"
            value={item.reps}
            display={`${item.reps} 次`}
            onDecrement={() => onPatch({ reps: Math.max(1, item.reps! - 1) })}
            onIncrement={() => onPatch({ reps: Math.min(50, item.reps! + 1) })}
          />
        )}
        {item.durationSec != null && item.reps == null && (
          <Stepper
            label="时长"
            value={item.durationSec}
            display={fmtDuration(item.durationSec)}
            onDecrement={() =>
              onPatch({ durationSec: Math.max(10, item.durationSec! - durStep) })
            }
            onIncrement={() =>
              onPatch({ durationSec: Math.min(maxDur, item.durationSec! + durStep) })
            }
          />
        )}
      </div>
    </div>
  );
}

/** 计划页：查看/调整各时段 × 场景方案的组数/次数/时长 */
export default function PlanPage() {
  const hydrated = useHydrated();
  const planConfig = useDuantiStore((s) => s.planConfig);
  const updatePlanItem = useDuantiStore((s) => s.updatePlanItem);

  if (!hydrated) {
    return (
      <div className="flex flex-col gap-4" aria-busy>
        <div className="h-10 w-28 rounded-2xl bg-black/5 dark:bg-white/5" />
        <div className="h-72 rounded-[24px] bg-black/5 dark:bg-white/5" />
        <div className="h-52 rounded-[24px] bg-black/5 dark:bg-white/5" />
        <div className="h-64 rounded-[24px] bg-black/5 dark:bg-white/5" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <header className="px-1 pt-1">
        <h1 className="text-[22px] font-bold tracking-tight">计划</h1>
        <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
          调整组数 / 次数 / 时长，当天已完成记录不受影响
        </p>
      </header>

      {PERIODS.map((period) => {
        const scenarios: Scenario[] =
          period === "evening" ? ["indoor"] : ["outdoor", "indoor"];
        return (
          <GlassCard key={period} accent={ACCENTS[period]} className="p-4">
            <div className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: ACCENT_COLORS[period] }}
              />
              <h2 className="text-[15px] font-semibold">
                {PERIOD_LABELS[period]} · 30 分钟
              </h2>
            </div>

            <div className="mt-3 flex flex-col gap-3">
              {scenarios.map((scenario) => {
                const slot = getPlanSlot(planConfig, period, scenario);
                if (!slot) return null;
                return (
                  <section key={scenario}>
                    <h3
                      className={cn(
                        "mb-1.5 px-1 text-xs font-medium",
                        scenario === "indoor"
                          ? "text-[var(--muted-foreground)]"
                          : "text-[var(--foreground)]"
                      )}
                    >
                      {period === "evening" ? "室内方案（夜晚默认）" : SCENARIO_LABELS[scenario]}
                    </h3>
                    <div className="flex flex-col gap-1.5">
                      {slot.items.map((item, index) => (
                        <ItemRow
                          key={`${item.exerciseId}-${index}`}
                          item={item}
                          onPatch={(patch) =>
                            updatePlanItem(period, scenario, index, patch)
                          }
                        />
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          </GlassCard>
        );
      })}
    </div>
  );
}
