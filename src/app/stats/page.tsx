"use client";

import { GlassCard } from "@/components/glass/glass-card";
import { useDuantiStore, useHydrated } from "@/lib/store";
import { kettlebellVolumes, last30Days } from "@/lib/stats";
import { cn } from "cn";

const HEAT_STYLES = [
  // periodsDone: 0/1/2/3
  "bg-black/[0.06] dark:bg-white/[0.08]",
  "bg-[var(--primary)]/25",
  "bg-[var(--primary)]/55",
  "bg-[var(--primary)]",
];

/** 统计页：近 30 天完成热力图 + 壶铃累计容量 */
export default function StatsPage() {
  const hydrated = useHydrated();
  const logs = useDuantiStore((s) => s.logs);
  const planConfig = useDuantiStore((s) => s.planConfig);
  const settings = useDuantiStore((s) => s.settings);

  if (!hydrated) {
    return (
      <div className="flex flex-col gap-4" aria-busy>
        <div className="h-10 w-28 rounded-2xl bg-black/5 dark:bg-white/5" />
        <div className="h-40 rounded-[24px] bg-black/5 dark:bg-white/5" />
        <div className="h-64 rounded-[24px] bg-black/5 dark:bg-white/5" />
      </div>
    );
  }

  const days = last30Days(logs);
  const completeDays = days.filter((d) => d.complete).length;
  const trainedDays = days.filter((d) => d.periodsDone > 0).length;
  const volumes = kettlebellVolumes(logs, settings.kettlebellWeightKg, 30, planConfig);
  const maxVolume = Math.max(1, ...volumes.map((v) => v.volumeKg));

  return (
    <div className="flex flex-col gap-4">
      <header className="px-1 pt-1">
        <h1 className="text-[22px] font-bold tracking-tight">统计</h1>
        <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
          近 30 天：打卡 {completeDays} 天 · 训练 {trainedDays} 天
        </p>
      </header>

      {/* 热力图（普通背景，不用玻璃） */}
      <section className="rounded-[24px] border border-[var(--border)] bg-[var(--card)] p-4">
        <h2 className="text-sm font-semibold">近 30 天完成热力图</h2>
        <div className="mt-3 grid grid-cols-10 gap-1.5">
          {days.map((d) => (
            <div
              key={d.date}
              title={`${d.date} · 完成 ${d.periodsDone}/3 个时段`}
              className={cn(
                "aspect-square rounded-md",
                HEAT_STYLES[d.periodsDone],
                d.complete && "ring-1 ring-[var(--primary)]/40"
              )}
            />
          ))}
        </div>
        <div className="mt-2.5 flex items-center justify-end gap-1 text-[10px] text-[var(--muted-foreground)]">
          少
          {HEAT_STYLES.map((cls, i) => (
            <span key={i} className={cn("h-2.5 w-2.5 rounded-sm", cls)} />
          ))}
          多
        </div>
        <p className="mt-1 text-[10px] text-[var(--muted-foreground)]">
          深色 = 当天早/中/晚 3 个时段全部完成（打卡）
        </p>
      </section>

      {/* 壶铃容量 */}
      <GlassCard className="p-4">
        <h2 className="text-sm font-semibold">
          壶铃累计容量（近 30 天 · {settings.kettlebellWeightKg}kg）
        </h2>
        {volumes.length === 0 ? (
          <p className="mt-6 mb-4 text-center text-xs text-[var(--muted-foreground)]">
            完成晚间或室内时段后，这里会显示各动作的累计容量
          </p>
        ) : (
          <div className="mt-3 flex flex-col gap-2.5">
            {volumes.map((v) => (
              <div key={v.exerciseId}>
                <div className="flex items-baseline justify-between text-[13px]">
                  <span className="font-medium">{v.name}</span>
                  <span className="text-[var(--muted-foreground)] tabular-nums">
                    {v.volumeKg.toLocaleString()} kg
                    {v.carriedSec > 0 &&
                      ` · 承重 ${Math.round(v.carriedSec / 60)} 分钟`}
                  </span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
                  <div
                    className="h-full rounded-full bg-[var(--accent-evening)]"
                    style={{ width: `${Math.max(4, (v.volumeKg / maxVolume) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
}
