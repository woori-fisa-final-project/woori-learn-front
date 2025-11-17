export interface User {
  id: number;
  userId: string;
  password: string;
  nickname: string;
  createdAt: string;
  updatedAt?: string;
  points: number;
}
