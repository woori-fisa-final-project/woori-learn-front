import { formatDate } from "./formatDate";

export function formatDateRange(startDate?: string, endDate?: string): string {
  if (!startDate && !endDate) {
    return "-";
  }
  const start = startDate ? formatDate(new Date(startDate)) : "-";
  const end = endDate ? formatDate(new Date(endDate)) : "미지정";
  return `${start} ~ ${end}`;
}


