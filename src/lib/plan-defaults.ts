import type { Period, PlanConfig, PlanSlot, Scenario } from "./types";

/**
 * 默认三时段方案（每天 30 分钟 × 3）：
 * - 早上：唤醒 + 声音 + 轻力量（室内外通用）
 * - 中午：户外快走；雨天室内降级为壶铃摆动 + 箭步蹲
 * - 晚上：室内壶铃力量（夜晚户外不可用，默认室内）
 * 单杠吊着作为可选项（optional: true），出现在早上与晚上的"附加动作"折叠区。
 */
export const DEFAULT_PLAN_CONFIG: PlanConfig = {
  morning: {
    outdoor: {
      period: "morning",
      scenario: "outdoor",
      items: [
        { exerciseId: "drink-water", durationSec: 120 },
        { exerciseId: "eye-exercises", durationSec: 300 },
        { exerciseId: "voice-bubbles", durationSec: 120 },
        { exerciseId: "voice-lip-trill", durationSec: 120 },
        { exerciseId: "voice-hum", durationSec: 120 },
        { exerciseId: "voice-reading", durationSec: 120 },
        { exerciseId: "wall-sit", sets: 3, durationSec: 45 },
        { exerciseId: "stretch", durationSec: 600 },
        { exerciseId: "bar-hang", sets: 3, durationSec: 30, optional: true },
      ],
    },
    indoor: {
      period: "morning",
      scenario: "indoor",
      items: [
        { exerciseId: "drink-water", durationSec: 120 },
        { exerciseId: "eye-exercises", durationSec: 300 },
        { exerciseId: "voice-bubbles", durationSec: 120 },
        { exerciseId: "voice-lip-trill", durationSec: 120 },
        { exerciseId: "voice-hum", durationSec: 120 },
        { exerciseId: "voice-reading", durationSec: 120 },
        { exerciseId: "wall-sit", sets: 3, durationSec: 45 },
        { exerciseId: "stretch", durationSec: 600 },
        { exerciseId: "bar-hang", sets: 3, durationSec: 30, optional: true },
      ],
    },
  },
  noon: {
    outdoor: {
      period: "noon",
      scenario: "outdoor",
      items: [
        { exerciseId: "warmup", durationSec: 300 },
        { exerciseId: "brisk-walk", durationSec: 1200 },
        { exerciseId: "stretch", durationSec: 300 },
      ],
    },
    indoor: {
      period: "noon",
      scenario: "indoor",
      items: [
        { exerciseId: "warmup", durationSec: 300 },
        { exerciseId: "kb-swing", sets: 4, reps: 20 },
        { exerciseId: "lunge", sets: 3, reps: 10 },
        { exerciseId: "stretch", durationSec: 300 },
      ],
    },
  },
  evening: {
    indoor: {
      period: "evening",
      scenario: "indoor",
      items: [
        { exerciseId: "kb-swing", sets: 5, reps: 15 },
        { exerciseId: "kb-goblet-squat", sets: 4, reps: 10 },
        { exerciseId: "glute-bridge", sets: 3, reps: 15 },
        { exerciseId: "kb-farmer-walk", sets: 3, durationSec: 40 },
        { exerciseId: "stretch", durationSec: 420 },
        { exerciseId: "bar-hang", sets: 3, durationSec: 30, optional: true },
      ],
    },
  },
};

/** 取某时段某场景的计划；晚上没有户外方案，自动回退到室内 */
export function getPlanSlot(
  config: PlanConfig,
  period: Period,
  scenario: Scenario
): PlanSlot | undefined {
  return config[period]?.[scenario] ?? config[period]?.indoor;
}
