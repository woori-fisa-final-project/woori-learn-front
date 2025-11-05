export interface BankUser {
  id: number;
  name_kr: string;
  name_en?: string;
  email?: string;
  phone_number: string;
  birth: string;
  auth_token?: string;
  created_at: string;
}

export interface BankAccount {
  id: number;
  user_id: number;
  account_number: string;
  password: string;
  balance: number;
  created_at: string;
}

export interface BankTransactionHistory {
  id: number;
  account_id: number;
  transaction_date: string;
  counterparty_name: string;
  display_name?: string;
  amount: number;
  description?: string;
}

export type BankAccountStatus = "OPEN" | "CLOSED" | "DORMANT";

export interface BankAccountHistory {
  id: number;
  user_id: number;
  account_id: number;
  status: BankAccountStatus;
  event_time: string;
}
