import type { Period, Scenario } from "./types";

/**
 * 场景判定（纯本地，无天气 API）：
 * - 晚上：户外不可用，强制室内壶铃方案
 * - 早上/中午：默认户外（快走等），下雨时用户在首页手动切换到室内
 */
export function autoScenario(period: Period): Scenario {
  if (period === "evening") return "indoor";
  return "outdoor";
}
