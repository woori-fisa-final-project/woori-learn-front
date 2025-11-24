import { EducationalAccount } from "@/types/account";
import axiosInstance from "@/utils/axiosInstance";
import type { ApiResponse } from "@/types/api";
import { devError } from "@/utils/logger";

/**
 * 사용자의 계좌 목록 조회
 */
export async function getAccountList(userId: number): Promise<EducationalAccount[]> {
  try {
    const response = await axiosInstance.get<ApiResponse<EducationalAccount[]>>(
      `/education/accounts/list/${userId}`
    );

    return response.data.data;
  } catch (error) {
    devError("[getAccountList] 계좌 조회 실패:", error);
    throw error;
  }
}
