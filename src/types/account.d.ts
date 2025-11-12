export interface Account {
  id: number;
  userId: number;
  accountNumber: string;
  bankCode: string;
  accountName: string;
  createdAt: string;
}

export interface EducationalAccount {
  id: number;
  accountNumber: string;
  balance: number;
  accountPassword: string;
  accountName: string;
  userId: number;
}
