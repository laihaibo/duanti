"use client";

import { Check } from "lucide-react";
import { cn } from "cn";
import { getExercise } from "@/lib/exercises";

interface ExerciseCheckItemProps {
  exerciseId: string;
  done: boolean;
  sets?: number;
  reps?: number;
  durationSec?: number;
  onToggle: () => void;
  disabled?: boolean;
}

function formatMeta(
  sets?: number,
  reps?: number,
  durationSec?: number
): string | null {
  if (sets != null && reps != null) return `${sets} 组 × ${reps} 次`;
  if (sets != null && durationSec != null) {
    return durationSec >= 60
      ? `${sets} 组 × ${Math.round(durationSec / 60)} 分钟`
      : `${sets} 组 × ${durationSec} 秒`;
  }
  if (durationSec != null) {
    return durationSec % 60 === 0 ? `${durationSec / 60} 分钟` : `${durationSec} 秒`;
  }
  return null;
}

/** 单条动作行：点击整行勾选/取消完成 */
export function ExerciseCheckItem({
  exerciseId,
  done,
  sets,
  reps,
  durationSec,
  onToggle,
  disabled,
}: ExerciseCheckItemProps) {
  const exercise = getExercise(exerciseId);
  if (!exercise) return null;
  const meta = formatMeta(sets, reps, durationSec);

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      aria-pressed={done}
      className={cn(
        "flex w-full items-center gap-3 rounded-2xl px-2 py-2 text-left transition-colors",
        "active:bg-white/40 dark:active:bg-white/5"
      )}
    >
      <span
        aria-hidden
        className={cn(
          "flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border transition-colors",
          done
            ? "border-transparent bg-[var(--card-accent)] text-white"
            : "border-[var(--muted-foreground)]/40 bg-transparent"
        )}
      >
        {done && <Check size={14} strokeWidth={3} />}
      </span>
      <span className="min-w-0 flex-1">
        <span
          className={cn(
            "block truncate text-[15px] font-medium leading-tight",
            done && "text-[var(--muted-foreground)] line-through"
          )}
        >
          {exercise.name}
        </span>
        <span className="mt-0.5 block truncate text-xs leading-tight text-[var(--muted-foreground)]">
          {meta}
          {exercise.breathCue ? ` · ${exercise.breathCue}` : ""}
        </span>
      </span>
    </button>
  );
}
