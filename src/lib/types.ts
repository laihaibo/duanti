export type ExerciseCategory =
  | "habit"
  | "mobility"
  | "strength"
  | "cardio"
  | "voice"
  | "kettlebell"
  | "recovery";

export type Period = "morning" | "noon" | "evening";
export type Scenario = "outdoor" | "indoor";

export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  defaultDurationSec?: number;
  defaultSets?: number;
  defaultReps?: number;
  /** 动作要点一句话提醒 */
  cue?: string;
  /** 呼吸提示，例如"下呼上吸" */
  breathCue?: string;
}

export interface PlanItem {
  exerciseId: string;
  sets?: number;
  reps?: number;
  durationSec?: number;
  /** 可选附加动作（如单杠吊着），首页折叠展示 */
  optional?: boolean;
  /** 覆盖 Exercise.cue 的场景化提示（如午间喝温水） */
  cueOverride?: string;
}

export interface PlanSlot {
  period: Period;
  scenario: Scenario;
  items: PlanItem[];
}

export interface DailyLogItem {
  exerciseId: string;
  done: boolean;
}

export interface DailyLogSlot {
  planned: boolean;
  completedAt?: number;
  /** 扩展字段：该时段当天实际使用的场景 */
  scenario?: Scenario;
  items: DailyLogItem[];
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  slots: Record<Period, DailyLogSlot>;
}

export interface UserSettings {
  kettlebellWeightKg: number;
  birthYear: number;
  theme: "auto" | "light" | "dark";
}

/** 计划配置：每个时段可含户外/室内两套（晚上仅室内） */
export type PlanConfig = Record<Period, Partial<Record<Scenario, PlanSlot>>>;

export const PERIODS: Period[] = ["morning", "noon", "evening"];
export const PERIOD_LABELS: Record<Period, string> = {
  morning: "早上",
  noon: "中午",
  evening: "晚上",
};

export const CATEGORY_LABELS: Record<ExerciseCategory, string> = {
  habit: "习惯",
  mobility: "热身/恢复",
  strength: "自重力量",
  kettlebell: "壶铃负重",
  cardio: "心肺/协调",
  voice: "声音训练",
  recovery: "恢复",
};
