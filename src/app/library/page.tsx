"use client";

import { useState } from "react";
import { EXERCISES } from "@/lib/exercises";
import { CATEGORY_LABELS } from "@/lib/types";
import type { ExerciseCategory } from "@/lib/types";
import { cn } from "cn";

type Filter = "all" | ExerciseCategory;

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "全部" },
  ...(Object.keys(CATEGORY_LABELS) as ExerciseCategory[]).map((c) => ({
    value: c as Filter,
    label: CATEGORY_LABELS[c],
  })),
];

const CATEGORY_COLORS: Record<ExerciseCategory, string> = {
  habit: "#8e8e93",
  mobility: "#af52de",
  strength: "#007aff",
  kettlebell: "#ff9500",
  cardio: "#34c759",
  voice: "#ff2d55",
  recovery: "#32ade6",
};

function fmtMeta(exercise: (typeof EXERCISES)[number]): string | null {
  if (exercise.defaultSets != null && exercise.defaultReps != null)
    return `${exercise.defaultSets} 组 × ${exercise.defaultReps} 次`;
  if (exercise.defaultSets != null && exercise.defaultDurationSec != null)
    return `${exercise.defaultSets} 组 × ${exercise.defaultDurationSec} 秒`;
  if (exercise.defaultDurationSec != null) {
    const s = exercise.defaultDurationSec;
    return s % 60 === 0 ? `${s / 60} 分钟` : `${s} 秒`;
  }
  return null;
}

/** 动作库：全部动作 + 分类筛选 + 动作要点（普通背景列表，不用玻璃材质保证滚动性能） */
export default function LibraryPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const list = filter === "all" ? EXERCISES : EXERCISES.filter((e) => e.category === filter);

  return (
    <div className="flex flex-col gap-3">
      <header className="px-1 pt-1">
        <h1 className="text-[22px] font-bold tracking-tight">动作库</h1>
        <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
          {EXERCISES.length} 个动作 · 动作简单、收益高、关节冲击小
        </p>
      </header>

      {/* 分类筛选 chips */}
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 py-1">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            className={cn(
              "shrink-0 rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors",
              filter === f.value
                ? "bg-[var(--primary)] text-white"
                : "border border-[var(--border)] text-[var(--muted-foreground)]"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* 动作列表（普通卡片） */}
      <div className="flex flex-col gap-2">
        {list.map((exercise) => (
          <article
            key={exercise.id}
            className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4"
          >
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-[15px] font-semibold leading-tight">{exercise.name}</h2>
              <span
                className="shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium"
                style={{
                  color: CATEGORY_COLORS[exercise.category],
                  backgroundColor: `${CATEGORY_COLORS[exercise.category]}1a`,
                }}
              >
                {CATEGORY_LABELS[exercise.category]}
              </span>
            </div>

            {fmtMeta(exercise) && (
              <p className="mt-1 text-xs text-[var(--muted-foreground)] tabular-nums">
                {fmtMeta(exercise)}
              </p>
            )}

            {exercise.cue && (
              <p className="mt-2 text-[13px] leading-snug text-[var(--foreground)]/85">
                要点：{exercise.cue}
              </p>
            )}
            {exercise.breathCue && (
              <p className="mt-1 text-[13px] leading-snug text-[var(--muted-foreground)]">
                呼吸：{exercise.breathCue}
              </p>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
