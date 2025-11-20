import { EducationalAccount } from "@/types/account";
import axiosInstance from "@/utils/axiosInstance";

interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

/**
 * 사용자의 계좌 목록 조회
 */
export async function getAccountList(userId: number): Promise<EducationalAccount[]> {
  const response = await axiosInstance.get<ApiResponse<EducationalAccount[]>>(
    `/education/accounts/list/${userId}`
  );

  return response.data.data;
}
