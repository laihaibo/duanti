import type { Exercise } from "./types";

/**
 * 动作池种子数据：动作简单、单位时间收益高、关节冲击小。
 * 呼吸约定：力量动作"下呼上吸/发力呼气"，有氧快走用 4-7-8 呼吸法。
 */
export const EXERCISES: Exercise[] = [
  // —— 习惯类 ——
  {
    id: "drink-water",
    name: "喝温水 300ml",
    category: "habit",
    defaultDurationSec: 120,
    cue: "晨起第一件事，小口慢饮",
  },
  {
    id: "eye-exercises",
    name: "眼保健操",
    category: "habit",
    defaultDurationSec: 300,
    cue: "指腹轻按，酸胀为宜，不压迫眼球",
  },

  // —— 热身 / 恢复 ——
  {
    id: "warmup",
    name: "动态热身",
    category: "mobility",
    defaultDurationSec: 300,
    cue: "踝、膝、髋、肩逐个关节唤醒，微出汗即可",
    breathCue: "鼻吸口呼，节奏自然",
  },
  {
    id: "stretch",
    name: "拉伸",
    category: "mobility",
    defaultDurationSec: 300,
    cue: "静态拉伸每侧 20–30 秒，拉到紧绷不疼痛",
    breathCue: "呼气时加深，不要憋气",
  },

  // —— 自重力量 ——
  {
    id: "wall-sit",
    name: "靠墙静蹲",
    category: "strength",
    defaultSets: 3,
    defaultDurationSec: 45,
    cue: "背贴墙，膝盖不超过脚尖，大腿与地面约 45–60°",
    breathCue: "全程匀速呼吸，不要憋气",
  },
  {
    id: "glute-bridge",
    name: "臀桥",
    category: "strength",
    defaultSets: 3,
    defaultReps: 15,
    cue: "脚跟发力，顶起时夹紧臀部，肩髋膝一条线",
    breathCue: "下呼上吸：下落呼气、顶起呼气末停 1 秒",
  },
  {
    id: "lunge",
    name: "箭步蹲",
    category: "strength",
    defaultSets: 3,
    defaultReps: 10,
    cue: "步幅适中，前膝对准脚尖，躯干垂直",
    breathCue: "下蹲吸气，起身呼气",
  },
  {
    id: "bar-hang",
    name: "单杠吊着",
    category: "strength",
    defaultSets: 3,
    defaultDurationSec: 30,
    cue: "肩部放松下沉，感受脊柱延展，量力而行",
    breathCue: "自然呼吸，不屏息",
  },
  {
    id: "gufa",
    name: "古法健身",
    category: "strength",
    defaultDurationSec: 600,
    cue: "八段锦/易筋经式传统功法，动作缓慢圆活",
    breathCue: "动作与呼吸相合，匀深细长",
  },

  // —— 壶铃负重（默认 16kg，可在设置中调整） ——
  {
    id: "kb-swing",
    name: "壶铃摆动",
    category: "kettlebell",
    defaultSets: 5,
    defaultReps: 15,
    cue: "髋部铰链发力，像弹射而非蹲起，壶铃只到胸口高度",
    breathCue: "顶端发力呼气，下落时吸气",
  },
  {
    id: "kb-goblet-squat",
    name: "高脚杯深蹲",
    category: "kettlebell",
    defaultSets: 4,
    defaultReps: 10,
    cue: "双手捧铃于胸前，肘贴膝内侧，全脚掌踩实",
    breathCue: "下蹲吸气，起身呼气",
  },
  {
    id: "kb-farmer-walk",
    name: "壶铃农夫行走",
    category: "kettlebell",
    defaultSets: 3,
    defaultDurationSec: 40,
    cue: "单手提铃，肩平髋稳，核心抗侧屈，步幅自然",
    breathCue: "短口呼吸，保持节奏",
  },
  {
    id: "kb-press",
    name: "壶铃推举",
    category: "kettlebell",
    defaultSets: 4,
    defaultReps: 8,
    cue: "手腕中立，铃身贴小臂，推过头顶锁定肩胛",
    breathCue: "推起呼气，下放吸气",
  },

  // —— 心肺 / 协调 ——
  {
    id: "brisk-walk",
    name: "快走",
    category: "cardio",
    defaultDurationSec: 1200,
    cue: "步频 110–120 步/分钟，能说话但不能唱歌的强度",
    breathCue: "4-7-8 呼吸法：吸 4 秒、屏 7 秒、呼 8 秒，边走边做",
  },

  // —— 声音训练 ——
  {
    id: "voice-training",
    name: "声音训练",
    category: "voice",
    defaultDurationSec: 480,
    cue: "气泡音 2 分钟 → 唇颤音 2 分钟 → 哼鸣滑音 2 分钟 → 朗读 2 分钟",
  },
  {
    id: "voice-bubbles",
    name: "气泡音",
    category: "voice",
    defaultDurationSec: 120,
    cue: "声带放松，气流带出低频'咕噜'声，晨起护嗓第一步",
  },
  {
    id: "voice-lip-trill",
    name: "唇颤音",
    category: "voice",
    defaultDurationSec: 120,
    cue: "双唇放松颤动，练呼吸与声带协调",
    breathCue: "腹式支撑，气流均匀送出",
  },
  {
    id: "voice-hum",
    name: "哼鸣滑音",
    category: "voice",
    defaultDurationSec: 120,
    cue: "闭口哼鸣，由低到高滑音，感受眉心共鸣",
    breathCue: "吸满不僵，呼气带声",
  },
  {
    id: "voice-reading",
    name: "朗读短文",
    category: "voice",
    defaultDurationSec: 120,
    cue: "咬字清晰度练习，语速适中，字头字腹字尾完整",
  },
];

export const EXERCISE_MAP: Record<string, Exercise> = Object.fromEntries(
  EXERCISES.map((e) => [e.id, e])
);

export function getExercise(id: string): Exercise | undefined {
  return EXERCISE_MAP[id];
}
