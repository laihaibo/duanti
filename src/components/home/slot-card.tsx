"use client";

import { useState } from "react";
import { ChevronDown, Lock, MoonStar, Sun, Sunrise } from "lucide-react";
import { GlassCard, type PeriodAccent } from "@/components/glass/glass-card";
import { GlassToggle } from "@/components/glass/glass-toggle";
import { ExerciseCheckItem } from "./exercise-check-item";
import type { DailyLogSlot, Period, PlanItem, Scenario } from "@/lib/types";
import { PERIOD_LABELS } from "@/lib/types";

const SLOT_SUBTITLES: Record<Period, string> = {
  morning: "唤醒 + 声音 + 轻力量",
  noon: "协调 + 中低强度心肺",
  evening: "室内壶铃力量",
};

const SLOT_ICONS: Record<Period, typeof Sun> = {
  morning: Sunrise,
  noon: Sun,
  evening: MoonStar,
};

const SLOT_ACCENTS: Record<Period, PeriodAccent> = {
  morning: "morning",
  noon: "noon",
  evening: "evening",
};

interface SlotCardProps {
  period: Period;
  /** 当日实际清单（勾选状态，含可选动作） */
  slot: DailyLogSlot;
  /** 生效计划清单（组次/时长与 optional 标志来源） */
  planItems: PlanItem[];
  onToggleItem: (exerciseId: string) => void;
  onCompleteSlot: () => void;
  onScenarioChange: (scenario: Scenario) => void;
}

/** 时段卡片：场景切换 + 动作清单勾选 + 整时段完成 */
export function SlotCard({
  period,
  slot,
  planItems,
  onToggleItem,
  onCompleteSlot,
  onScenarioChange,
}: SlotCardProps) {
  const [showOptional, setShowOptional] = useState(false);
  const Icon = SLOT_ICONS[period];
  const accentColor = `var(--accent-${SLOT_ACCENTS[period]})`;
  const isDone = !!slot.completedAt;
  const doneCount = slot.items.filter((i) => i.done).length;
  const completedTime = slot.completedAt
    ? new Date(slot.completedAt).toLocaleTimeString("zh-CN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    : null;

  const planById = new Map(planItems.map((p) => [p.exerciseId, p]));
  const mainItems = slot.items.filter((i) => !planById.get(i.exerciseId)?.optional);
  const optionalItems = slot.items.filter((i) => planById.get(i.exerciseId)?.optional);

  const renderItem = (item: { exerciseId: string; done: boolean }) => {
    const plan = planById.get(item.exerciseId);
    return (
      <ExerciseCheckItem
        key={item.exerciseId}
        exerciseId={item.exerciseId}
        done={item.done}
        sets={plan?.sets}
        reps={plan?.reps}
        durationSec={plan?.durationSec}
        onToggle={() => onToggleItem(item.exerciseId)}
      />
    );
  };

  return (
    <GlassCard accent={SLOT_ACCENTS[period]} className="p-4">
      {/* 头部 */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2.5">
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
            style={{ backgroundColor: `${accentColor}22`, color: accentColor }}
          >
            <Icon size={18} />
          </span>
          <div className="min-w-0">
            <p className="text-[15px] font-semibold leading-tight">
              {PERIOD_LABELS[period]} · 30 分钟
            </p>
            <p className="truncate text-xs leading-tight text-[var(--muted-foreground)]">
              {SLOT_SUBTITLES[period]}
            </p>
          </div>
        </div>

        {period === "evening" ? (
          <span className="flex shrink-0 items-center gap-1 rounded-full border border-[var(--glass-border)] px-2.5 py-1 text-xs text-[var(--muted-foreground)]">
            <Lock size={12} />
            夜晚 · 室内
          </span>
        ) : (
          <GlassToggle
            ariaLabel={`${PERIOD_LABELS[period]}场景切换`}
            value={slot.scenario ?? "outdoor"}
            onChange={onScenarioChange}
            options={[
              { value: "outdoor", label: "户外" },
              { value: "indoor", label: "雨天室内" },
            ]}
          />
        )}
      </div>

      {/* 必做动作清单 */}
      <div className="mt-3 flex flex-col gap-0.5">{mainItems.map(renderItem)}</div>

      {/* 附加动作（可选：单杠吊着等） */}
      {optionalItems.length > 0 && (
        <div className="mt-1">
          <button
            type="button"
            onClick={() => setShowOptional((v) => !v)}
            className="flex items-center gap-1 rounded-xl px-2 py-1.5 text-xs text-[var(--muted-foreground)]"
            aria-expanded={showOptional}
          >
            附加动作（可选）
            <ChevronDown
              size={12}
              className={showOptional ? "rotate-180 transition-transform" : "transition-transform"}
            />
          </button>
          {showOptional && (
            <div className="flex flex-col gap-0.5">{optionalItems.map(renderItem)}</div>
          )}
        </div>
      )}

      {/* 底部：完成状态 / 完成按钮 */}
      <div className="mt-3">
        {isDone ? (
          <div
            className="flex items-center justify-center gap-1.5 rounded-full py-2 text-sm font-medium"
            style={{ backgroundColor: `${accentColor}1a`, color: accentColor }}
          >
            ✓ 已完成 {doneCount} 项 · {completedTime}
          </div>
        ) : (
          <button
            type="button"
            onClick={onCompleteSlot}
            className="w-full rounded-full py-2.5 text-sm font-semibold text-white transition-transform active:scale-[0.98]"
            style={{ backgroundColor: accentColor }}
          >
            完成本时段（{doneCount}/{slot.items.length}）
          </button>
        )}
      </div>
    </GlassCard>
  );
}
