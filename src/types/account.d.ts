export interface Account {
  id: number;
  user_id: number;
  account_number: string;
  bank_code: string;
  account_name: string;
  created_at: string;
}

export interface EducationalAccount {
  id: number;
  account_number: string;
  balance: number;
  account_password: string;
  account_name: string;
  user_id: number;
}
