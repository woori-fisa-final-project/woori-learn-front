export function formatKoreanDate(date: Date) {
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}.${String(date.getDate()).padStart(2, "0")}`;
}

export function subMonths(base: Date, m: number) {
  const d = new Date(base);
  d.setMonth(d.getMonth() - (m - 1));
  d.setDate(1);
  return d;
}


export function formatDateInput(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
