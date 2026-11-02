"use client";

import { useEffect, useState } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  DailyLog,
  DailyLogSlot,
  Period,
  PlanConfig,
  PlanItem,
  Scenario,
  UserSettings,
} from "./types";
import { PERIODS } from "./types";
import { DEFAULT_PLAN_CONFIG } from "./plan-defaults";
import { autoScenario } from "./scenario";

interface DuantiState {
  settings: UserSettings;
  planConfig: PlanConfig;
  /** key = YYYY-MM-DD */
  logs: Record<string, DailyLog>;

  /** 切换某天某时段某动作的完成状态；全完成自动记录 completedAt */
  toggleItemDone: (date: string, period: Period, exerciseId: string) => void;
  /** 整时段完成：全部动作置 done 并记录 completedAt */
  completeSlot: (date: string, period: Period) => void;
  /** 切换某天某时段的室内外场景（晚上锁定室内），并重建动作清单 */
  setSlotScenario: (date: string, period: Period, scenario: Scenario) => void;
  /** 计划页：修改默认方案的组数/次数/时长 */
  updatePlanItem: (
    period: Period,
    scenario: Scenario,
    index: number,
    patch: Partial<PlanItem>
  ) => void;
  updateSettings: (patch: Partial<UserSettings>) => void;
  /** 清空全部数据（恢复出厂） */
  clearData: () => void;
}

export const DEFAULT_SETTINGS: UserSettings = {
  kettlebellWeightKg: 16,
  birthYear: 1995,
  theme: "auto",
};

type LogItem = { exerciseId: string; done: boolean };

function emptySlot(): DailyLogSlot {
  return { planned: true, items: [] };
}

function emptyLog(): DailyLog {
  return {
    date: "",
    slots: {
      morning: emptySlot(),
      noon: emptySlot(),
      evening: emptySlot(),
    },
  };
}

/** 依据计划生成某时段的动作清单（保留既有勾选状态） */
function buildItems(
  config: PlanConfig,
  period: Period,
  scenario: Scenario,
  prevItems: LogItem[] = []
): LogItem[] {
  const slot = config[period]?.[scenario] ?? config[period]?.indoor;
  if (!slot) return [];
  const prevDone = new Map(prevItems.map((i) => [i.exerciseId, i.done]));
  return slot.items.map((item) => ({
    exerciseId: item.exerciseId,
    done: prevDone.get(item.exerciseId) ?? false,
  }));
}

function resolveScenario(period: Period, override?: Scenario): Scenario {
  if (period === "evening") return "indoor";
  return override ?? autoScenario(period);
}

/**
 * 获取（必要时惰性创建）某天的日志，确保三个时段按当日场景生成清单。
 * 清单与计划不一致时（计划被编辑），重建并撤销时段完成状态。
 */
function ensureLog(draftLogs: Record<string, DailyLog>, planConfig: PlanConfig, date: string): DailyLog {
  const existing = draftLogs[date];
  const log: DailyLog = existing ?? emptyLog();
  log.date = date;
  for (const period of PERIODS) {
    const slot = log.slots[period] ?? emptySlot();
    const scenario = resolveScenario(period, slot.scenario);
    slot.scenario = scenario;
    slot.planned = true;
    const expected = buildItems(planConfig, period, scenario, slot.items);
    const sameList =
      slot.items.length === expected.length &&
      slot.items.every((it, i) => it.exerciseId === expected[i].exerciseId);
    if (!sameList) {
      slot.items = expected;
      delete slot.completedAt;
    }
    log.slots[period] = slot;
  }
  if (existing !== log) {
    draftLogs[date] = log;
  }
  return log;
}

/** 复制 logs 顶层容器，保证 set 返回新引用 */
function cloneLogs(logs: Record<string, DailyLog>): Record<string, DailyLog> {
  return { ...logs };
}

export const useDuantiStore = create<DuantiState>()(
  persist(
    (set) => ({
      settings: DEFAULT_SETTINGS,
      planConfig: DEFAULT_PLAN_CONFIG,
      logs: {},

      toggleItemDone: (date, period, exerciseId) => {
        set((state) => {
          const logs = cloneLogs(state.logs);
          const log = ensureLog(logs, state.planConfig, date);
          const slot = log.slots[period];
          slot.items = slot.items.map((it) =>
            it.exerciseId === exerciseId ? { ...it, done: !it.done } : it
          );
          const allDone = slot.items.length > 0 && slot.items.every((it) => it.done);
          if (allDone) slot.completedAt = Date.now();
          else delete slot.completedAt;
          return { logs };
        });
      },

      completeSlot: (date, period) => {
        set((state) => {
          const logs = cloneLogs(state.logs);
          const log = ensureLog(logs, state.planConfig, date);
          const slot = log.slots[period];
          slot.items = slot.items.map((it) => ({ ...it, done: true }));
          slot.completedAt = Date.now();
          return { logs };
        });
      },

      setSlotScenario: (date, period, scenario) => {
        if (period === "evening") return; // 晚上锁定室内
        set((state) => {
          const logs = cloneLogs(state.logs);
          const log = ensureLog(logs, state.planConfig, date);
          const slot = log.slots[period];
          slot.scenario = scenario;
          slot.items = buildItems(state.planConfig, period, scenario, slot.items);
          const allDone = slot.items.length > 0 && slot.items.every((it) => it.done);
          if (allDone) slot.completedAt = Date.now();
          else delete slot.completedAt;
          return { logs };
        });
      },

      updatePlanItem: (period, scenario, index, patch) => {
        set((state) => {
          const slot = state.planConfig[period]?.[scenario];
          if (!slot) return {};
          const items = slot.items.map((it, i) =>
            i === index ? { ...it, ...patch } : it
          );
          return {
            planConfig: {
              ...state.planConfig,
              [period]: {
                ...state.planConfig[period],
                [scenario]: { ...slot, items },
              },
            },
          };
        });
      },

      updateSettings: (patch) => {
        set((state) => ({ settings: { ...state.settings, ...patch } }));
      },

      clearData: () => {
        set({
          settings: DEFAULT_SETTINGS,
          planConfig: DEFAULT_PLAN_CONFIG,
          logs: {},
        });
      },
    }),
    {
      name: "duanti-store",
      version: 1,
    }
  )
);

/** 客户端水合门控：SSG 首帧渲染初始状态，挂载后再读 localStorage 持久数据 */
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}

/**
 * 只读视图：某天某时段的清单（不落库）。
 * 场景 = 用户当日手动覆盖 ?? 自动判定（晚上强制室内）；
 * 清单始终按当前计划推导，并叠加既有勾选状态。
 */
export function getSlotView(
  planConfig: PlanConfig,
  logs: Record<string, DailyLog>,
  date: string,
  period: Period
): DailyLogSlot {
  const existing = logs[date]?.slots[period];
  const scenario = resolveScenario(period, existing?.scenario);
  const items = buildItems(planConfig, period, scenario, existing?.items);
  return {
    planned: true,
    scenario,
    completedAt: existing?.completedAt,
    items,
  };
}
