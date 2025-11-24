import type { TransactionResponse } from "@/types";

export function transformApiTransaction(
  api: TransactionResponse,
  index: number,
  accountId: number 
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
    accountId,   

    date,
    time,
    counterpartyName: api.counterpartyName,
    displayName: api.displayName ?? "",
    description: api.description,
    amount: api.amount,
    runningBalance: undefined,
  };
}

