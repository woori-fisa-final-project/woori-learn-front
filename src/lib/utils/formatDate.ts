export function formatDate(source: Date | string) {
  const target = source instanceof Date ? source : new Date(source);
  if (Number.isNaN(target.getTime())) {
    if (typeof source === "string") return source.replaceAll("-", ".");
    return "";
  }
  const year = target.getFullYear();
  const month = String(target.getMonth() + 1).padStart(2, "0");
  const day = String(target.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
}

