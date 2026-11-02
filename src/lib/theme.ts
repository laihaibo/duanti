"use client";

import { useEffect } from "react";

export type ThemeMode = "auto" | "light" | "dark";

function resolveDark(theme: ThemeMode): boolean {
  if (theme === "dark") return true;
  if (theme === "light") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

/** 把主题模式落到 html.dark 类（设置页实时生效） */
export function applyTheme(theme: ThemeMode): void {
  document.documentElement.classList.toggle("dark", resolveDark(theme));
}

/** 跟随 settings.theme 变化 + auto 模式下监听系统切换 */
export function useThemeSync(theme: ThemeMode): void {
  useEffect(() => {
    applyTheme(theme);
    if (theme !== "auto") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyTheme("auto");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [theme]);
}
