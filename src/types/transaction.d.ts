export interface TransactionHistory {
  id: number;
  accountId: number;
  transactionDate: string;
  counterpartyName: string;
  displayName?: string;
  amount: number;
  description?: string;
}
