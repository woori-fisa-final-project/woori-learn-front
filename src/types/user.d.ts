export interface User {
  id: number;
  user_id: string;
  password: string;
  nickname: string;
  created_at: string;
  updated_at?: string;
  points: number;
}
