export function getLastDayOfMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

export function clampDayToMonth(year: number, month: number, day: number) {
  const lastDay = getLastDayOfMonth(year, month);
  return Math.min(day, lastDay);
}

export function formatYMD(year: number, month: number, day: number) {
  const mm = String(month).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
}


