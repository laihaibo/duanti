/** 本地时区日期工具（避免 UTC 偏移导致打卡日期错位） */

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

export function dateLocalISO(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function todayLocalISO(): string {
  return dateLocalISO(new Date());
}

export function parseISODate(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

export function addDays(dateStr: string, n: number): string {
  const d = parseISODate(dateStr);
  d.setDate(d.getDate() + n);
  return dateLocalISO(d);
}

/** 最近 n 天（含今天，倒序可选；默认正序：最早 → 今天） */
export function lastNDates(n: number, today = todayLocalISO()): string[] {
  const out: string[] = [];
  for (let i = n - 1; i >= 0; i--) out.push(addDays(today, -i));
  return out;
}

/** 当前周（周一 → 周日） */
export function currentWeekDates(today = todayLocalISO()): string[] {
  const d = parseISODate(today);
  const dow = d.getDay(); // 0=周日
  const mondayOffset = dow === 0 ? -6 : 1 - dow;
  return Array.from({ length: 7 }, (_, i) => addDays(today, mondayOffset + i));
}
