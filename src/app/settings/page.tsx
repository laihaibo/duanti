"use client";

import { useRef } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GlassCard } from "@/components/glass/glass-card";
import { GlassToggle } from "@/components/glass/glass-toggle";
import { useDuantiStore, useHydrated } from "@/lib/store";
import { useThemeSync } from "@/lib/theme";
import { todayLocalISO } from "@/lib/date";
import { Minus, Plus } from "lucide-react";

/** 设置页：壶铃重量 / 出生年 / 主题 / 数据导出 / 清空数据 */
export default function SettingsPage() {
  const hydrated = useHydrated();
  const settings = useDuantiStore((s) => s.settings);
  const planConfig = useDuantiStore((s) => s.planConfig);
  const logs = useDuantiStore((s) => s.logs);
  const updateSettings = useDuantiStore((s) => s.updateSettings);
  const clearData = useDuantiStore((s) => s.clearData);
  const downloadRef = useRef<HTMLAnchorElement>(null);

  // 主题实时生效（auto 模式跟随系统）
  useThemeSync(settings.theme);

  if (!hydrated) {
    return (
      <div className="flex flex-col gap-4" aria-busy>
        <div className="h-10 w-28 rounded-2xl bg-black/5 dark:bg-white/5" />
        <div className="h-44 rounded-[24px] bg-black/5 dark:bg-white/5" />
        <div className="h-40 rounded-[24px] bg-black/5 dark:bg-white/5" />
      </div>
    );
  }

  const exportJson = () => {
    const payload = {
      app: "duanti",
      version: 1,
      exportedAt: new Date().toISOString(),
      settings,
      planConfig,
      logs,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `duanti-backup-${todayLocalISO()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    downloadRef.current?.focus();
  };

  const btn =
    "flex h-8 w-8 items-center justify-center rounded-full border border-[var(--glass-border)] active:scale-90 transition-transform disabled:opacity-30";

  return (
    <div className="flex flex-col gap-4">
      <header className="px-1 pt-1">
        <h1 className="text-[22px] font-bold tracking-tight">设置</h1>
        <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
          所有数据仅保存在本设备（localStorage）
        </p>
      </header>

      {/* 训练参数 */}
      <GlassCard className="p-4">
        <h2 className="text-sm font-semibold">训练参数</h2>

        <div className="mt-3 flex items-center justify-between">
          <div>
            <p className="text-[15px] font-medium">壶铃重量</p>
            <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
              用于容量统计（组 × 次 × kg）
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className={btn}
              onClick={() =>
                updateSettings({
                  kettlebellWeightKg: Math.max(4, settings.kettlebellWeightKg - 2),
                })
              }
              disabled={settings.kettlebellWeightKg <= 4}
              aria-label="减少壶铃重量"
            >
              <Minus size={14} />
            </button>
            <span className="w-16 text-center text-base font-semibold tabular-nums">
              {settings.kettlebellWeightKg} kg
            </span>
            <button
              type="button"
              className={btn}
              onClick={() =>
                updateSettings({
                  kettlebellWeightKg: Math.min(48, settings.kettlebellWeightKg + 2),
                })
              }
              disabled={settings.kettlebellWeightKg >= 48}
              aria-label="增加壶铃重量"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <Label htmlFor="birth-year" className="text-[15px] font-medium text-[var(--foreground)]">
            出生年
          </Label>
          <Input
            id="birth-year"
            type="number"
            inputMode="numeric"
            min={1930}
            max={new Date().getFullYear() - 10}
            value={settings.birthYear}
            onChange={(e) => {
              const v = Number(e.target.value);
              if (Number.isFinite(v)) updateSettings({ birthYear: v });
            }}
            className="w-24 rounded-full text-center"
          />
        </div>
      </GlassCard>

      {/* 外观 */}
      <GlassCard className="p-4">
        <h2 className="text-sm font-semibold">外观</h2>
        <div className="mt-3 flex items-center justify-between">
          <p className="text-[15px] font-medium">主题</p>
          <GlassToggle
            ariaLabel="主题切换"
            value={settings.theme}
            onChange={(theme) => updateSettings({ theme })}
            options={[
              { value: "auto", label: "跟随系统" },
              { value: "light", label: "浅色" },
              { value: "dark", label: "深色" },
            ]}
          />
        </div>
      </GlassCard>

      {/* 数据 */}
      <GlassCard className="p-4">
        <h2 className="text-sm font-semibold">数据</h2>
        <p className="mt-1 text-xs text-[var(--muted-foreground)]">
          打卡记录 {Object.keys(logs).length} 天 · 建议定期导出备份
        </p>
        <div className="mt-3 flex flex-col gap-2">
          <Button variant="outline" className="rounded-full" onClick={exportJson}>
            导出数据为 JSON
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="rounded-full">
                清空全部数据
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>确认清空全部数据？</AlertDialogTitle>
                <AlertDialogDescription>
                  将删除所有打卡记录、计划调整与设置，恢复出厂状态。此操作不可撤销，建议先导出备份。
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>取消</AlertDialogCancel>
                <AlertDialogAction onClick={clearData}>确认清空</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </GlassCard>

      <p className="px-2 pb-2 text-center text-[11px] text-[var(--muted-foreground)]">
        锻体 duanti v0.1.0 · 纯本地 PWA · 无后端无追踪
      </p>
    </div>
  );
}
