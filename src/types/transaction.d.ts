export interface TransactionHistory {
  id: number;
  accountId: number;
  transactionDate: string;
  counterpartyName: string;
  displayName?: string;
  amount: number;
  description?: string;
}

export interface TransactionResponse {
  accountId: number;
  transactionDate: string;
  counterpartyName: string;
  displayName?: string;
  amount: number;
  description: string;
}



export interface Transaction {
  id: string;
  accountId: number;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm:ss
  counterpartyName: string;
  displayName?: string;
  description: string;
  amount: number;
  runningBalance?: number;
}
