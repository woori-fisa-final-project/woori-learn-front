import axiosInstance from '@/lib/axiosInstance';

/**
 * 사용자 정보 타입
 */
export interface UserData {
  id: number;
  name: string;
  email?: string;
  points: number;
}

interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

/**
 * 현재 로그인한 사용자 정보 조회
 */
export async function getCurrentUser(): Promise<UserData> {
  const response = await axiosInstance.get<ApiResponse<UserData>>('/users/me');
  return response.data.data;
}
