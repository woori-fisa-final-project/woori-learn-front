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
  bankName?: string; // API가 간헐적으로 생략할 수 있으므로 선택적 필드로 변경
  userId: number;
  accountType: "DEPOSIT" | "SAVINGS"; // 계좌 유형: 입출금(DEPOSIT) 또는 예적금(SAVINGS)
}

export interface AccountResponse {
  id: number;
  accountName: string;
  accountNumber: string;
  balance: number;
  accountType: "DEPOSIT" | "SAVINGS"; // 계좌 유형: 입출금(DEPOSIT) 또는 예적금(SAVINGS)
}

export interface AccountListApiResponse {
  code: number;
  message: string;
  data: AccountResponse[];
}

export interface AccountCard {
  id: number;
  title: string;
  bank: string;
  accountNumber: string;
  accountName?: string;
  badge: string;
  balance: string;
  rawBalance: number;
  transferAvailable: boolean;
  disabledMessage?: string;
  type: "deposit" | "savings";
}