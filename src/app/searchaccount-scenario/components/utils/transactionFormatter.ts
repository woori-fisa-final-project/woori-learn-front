import type { TransactionResponse } from "@/types";


export function formatAccountNumber(raw: string) {
  const d = raw.replace(/\D/g, "");
  if (d.length === 10)
    return `${d.slice(0, 4)}-${d.slice(4, 7)}-${d.slice(7)}`;
  return raw;
}

export function transformApiTransaction(
  api: TransactionResponse,
  index: number,
  accountId: number  // ★ 반드시 있어야 함!
) {
  const dateObj = new Date(api.transactionDate);

  const date = `${dateObj.getFullYear()}-${String(
    dateObj.getMonth() + 1
  ).padStart(2, "0")}-${String(dateObj.getDate()).padStart(2, "0")}`;

  const time = `${String(dateObj.getHours()).padStart(2, "0")}:${String(
    dateObj.getMinutes()
  ).padStart(2, "0")}:${String(dateObj.getSeconds()).padStart(2, "0")}`;

  return {
    id: `tx-${index}-${dateObj.getTime()}`,
    accountId,   // ★ 핵심 1

    date,
    time,
    counterpartyName: api.counterpartyName,
    displayName: api.displayName ?? "",
    description: api.description,
    amount: api.amount,
    runningBalance: undefined,
  };
}

