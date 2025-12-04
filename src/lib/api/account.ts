import { EducationalAccount } from "@/types/account";
import axiosInstance from "@/utils/axiosInstance";
import type { ApiResponse } from "@/types/api";
import { devError } from "@/utils/logger";
import axios from "axios";

/**
 * 사용자의 계좌 목록 조회 (JWT 토큰 기반)
 * 서버에서 토큰의 Principal에서 userId를 추출하여 처리합니다.
 */
export async function getAccountList(
  signal?: AbortSignal
): Promise<EducationalAccount[]> {
  try {
    const response = await axiosInstance.get<ApiResponse<EducationalAccount[]>>(
      `/education/accounts/list`,
      { signal }
    );
    return response.data.data;
  } catch (error) {
    if (axios.isCancel(error)) {
        throw error;
    }
    devError("[getAccountList] 계좌 조회 실패:", error);
    throw error;
  }
}