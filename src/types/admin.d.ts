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
  scenarios: any[];
  pointHistory: any[];
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
