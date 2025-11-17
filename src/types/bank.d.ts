export interface BankUser {
  id: number;
  nameKr: string;
  nameEn?: string;
  email?: string;
  phoneNumber: string;
  birth: string;
  authToken?: string;
  createdAt: string;
}

export interface BankAccount {
  id: number;
  userId: number;
  accountNumber: string;
  password: string;
  balance: number;
  createdAt: string;
}

export interface BankTransactionHistory {
  id: number;
  accountId: number;
  transactionDate: string;
  counterpartyName: string;
  displayName?: string;
  amount: number;
  description?: string;
}

export type BankAccountStatus = "OPEN" | "CLOSED" | "DORMANT";

export interface BankAccountHistory {
  id: number;
  userId: number;
  accountId: number;
  status: BankAccountStatus;
  eventTime: string;
}
