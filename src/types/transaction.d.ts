export interface TransactionHistory {
  id: number;
  account_id: number;
  transaction_date: string;
  counterparty_name: string;
  display_name?: string;
  amount: number;
  description?: string;
}
