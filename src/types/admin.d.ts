export interface ScenarioStatus {
  name: string;
  completed: boolean;
}

export interface PointHistory {
  date: string;
  status: string;
  amount: number;
  type: "earn" | "exchange_request" | "exchange_complete" | "exchange_failed";
}

export interface AdminUser {
  id: string;
  userId: string;
  name: string;
  creationDate: string;
  points: number;
  exchangedPoints: number;
  progress: string;
  account: {
    accountNumber: string;
    createdAt: string;
  };
  scenarios: ScenarioStatus[];
  pointHistory: PointHistory[];
}

export interface AdminUserListItem {
  id: number;
  userId: string;
  nickname: string;
  points: number;
  createdAt: string;
  progressRate: number;
  role?: string; // 필터링에 사용 (ROLE_USER)
}

export interface ApiResponse<T> {
  data: T;
}

export interface AdminUserDetailResponse {
  id: number;
  userId: string;
  nickname: string;
  createdAt: string;

  points: number;
  exchangedPoints: number;
  progressRate: number;

  account: {
    accountNumber: string;
    createdAt: string;
  };

  scenarios: ScenarioStatus[];

  historyList: {
    createdAt: string;
    status: string;
    amount: number;
    type: "earn" | "exchange_request" | "exchange_complete" | "exchange_failed";
  }[];
}

export interface ExchangeHistoryDto {
  id: number;
  userId: string;
  nickname: string;
  createdAt: string;
  amount: number;
  status: 'APPLY' | 'SUCCESS' | 'FAILED';
  processedAt?: string;
}
