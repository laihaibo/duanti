import type { DailyLog, Period } from "./types";
import { PERIODS } from "./types";
import { addDays, currentWeekDates, lastNDates, todayLocalISO } from "./date";
import { getExercise } from "./exercises";

export interface DayStatus {
  date: string;
  /** 已完成时段数（0-3） */
  periodsDone: number;
  /** 是否当日打卡（3 个时段全部完成） */
  complete: boolean;
}

export function slotIsComplete(log: DailyLog | undefined, period: Period): boolean {
  return !!log?.slots[period]?.completedAt;
}

export function dayStatus(logs: Record<string, DailyLog>, date: string): DayStatus {
  const log = logs[date];
  const periodsDone = PERIODS.filter((p) => slotIsComplete(log, p)).length;
  return { date, periodsDone, complete: periodsDone === PERIODS.length };
}

/**
 * 连续打卡天数：从今天往前数「3 个时段全部完成」的连续天数。
 * 今天尚未完成不打断连续（从昨天起算）。
 */
export function computeStreak(
  logs: Record<string, DailyLog>,
  today = todayLocalISO()
): number {
  let cursor = today;
  if (!dayStatus(logs, cursor).complete) {
    cursor = addDays(cursor, -1);
  }
  let streak = 0;
  while (dayStatus(logs, cursor).complete) {
    streak++;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

export interface WeekProgress {
  /** 已完成动作数（勾选粒度） */
  doneItems: number;
  /** 计划动作总数 */
  totalItems: number;
  /** 0~1 完成度 */
  value: number;
  /** 已打卡天数 */
  daysCompleted: number;
}

/** 本周（周一 → 今天）完成度 */
export function weekProgress(
  logs: Record<string, DailyLog>,
  today = todayLocalISO()
): WeekProgress {
  const week = currentWeekDates(today).filter((d) => d <= today);
  let doneItems = 0;
  let totalItems = 0;
  let daysCompleted = 0;
  for (const date of week) {
    const log = logs[date];
    const status = dayStatus(logs, date);
    if (status.complete) daysCompleted++;
    for (const period of PERIODS) {
      const items = log?.slots[period]?.items ?? [];
      for (const it of items) {
        totalItems++;
        if (it.done) doneItems++;
      }
    }
  }
  return {
    doneItems,
    totalItems,
    value: totalItems === 0 ? 0 : doneItems / totalItems,
    daysCompleted,
  };
}

/** 最近 30 天热力图数据（正序：最早 → 今天） */
export function last30Days(logs: Record<string, DailyLog>): DayStatus[] {
  return lastNDates(30).map((date) => dayStatus(logs, date));
}

export interface ExerciseVolume {
  exerciseId: string;
  name: string;
  /** 累计容量：组 × 次 × 重量（kg） */
  volumeKg: number;
  /** 承重时长（秒，农夫行走等时长型动作） */
  carriedSec: number;
}

/**
 * 近 N 天各壶铃动作的累计容量。
 * 次数型容量 = 组 × 次 × 壶铃重量；时长型（农夫行走）= 组 × 时长 × 重量，单列承重时长。
 */
export function kettlebellVolumes(
  logs: Record<string, DailyLog>,
  weightKg: number,
  days = 30,
  planConfig?: import("./types").PlanConfig
): ExerciseVolume[] {
  const dates = lastNDates(days);
  const acc = new Map<string, { volumeKg: number; carriedSec: number }>();

  for (const date of dates) {
    const log = logs[date];
    if (!log) continue;
    for (const period of PERIODS) {
      const slot = log.slots[period];
      if (!slot?.completedAt) continue;
      // 完成的时段：容量按计划配置计（清单与计划一一对应）
      const doneIds = new Set(slot.items.filter((i) => i.done).map((i) => i.exerciseId));
      const planItems =
        planConfig?.[period]?.[slot.scenario ?? "indoor"]?.items ?? [];
      for (const item of planItems) {
        if (!doneIds.has(item.exerciseId)) continue;
        const exercise = getExercise(item.exerciseId);
        if (!exercise || exercise.category !== "kettlebell") continue;
        const entry = acc.get(item.exerciseId) ?? { volumeKg: 0, carriedSec: 0 };
        if (item.reps != null && item.sets != null) {
          entry.volumeKg += item.sets * item.reps * weightKg;
        } else if (item.durationSec != null && item.sets != null) {
          entry.carriedSec += item.sets * item.durationSec;
          entry.volumeKg += item.sets * weightKg; // 时长型按组数计重量次数，便于排序展示
        }
        acc.set(item.exerciseId, entry);
      }
    }
  }

  return Array.from(acc.entries())
    .map(([exerciseId, v]) => ({
      exerciseId,
      name: getExercise(exerciseId)?.name ?? exerciseId,
      volumeKg: v.volumeKg,
      carriedSec: v.carriedSec,
    }))
    .sort((a, b) => b.volumeKg - a.volumeKg);
}

/** 某天完成时段的合计训练分钟数（按计划时长估算，供统计页展示） */
export function dayMinutes(log: DailyLog | undefined): number {
  if (!log) return 0;
  let minutes = 0;
  for (const period of PERIODS) {
    if (slotIsComplete(log, period)) minutes += 30;
  }
  return minutes;
}
