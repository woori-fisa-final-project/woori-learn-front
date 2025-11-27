import axiosInstance from "@/utils/axiosInstance";
import type { ApiResponse } from "@/types/api";
import { devError } from "@/utils/logger";
import { isApiError } from "@/types/errors";

/**
 * 계좌이체 요청 파라미터
 */
export interface TransferParams {
  fromAccountNumber: string;
  toAccountNumber: string;
  amount: number;
  accountPassword: string;
  counterpartyName: string;
}

/**
 * 계좌이체 응답
 */
export interface TransferResponse {
  transactionId: string;
  fromAccountNumber: string;
  toAccountNumber: string;
  amount: number;
  transferDate: string;
  balance: number;
}

/**
 * 계좌이체 (JWT 토큰 기반)
 * 서버에서 토큰의 사용자가 fromAccountNumber의 소유자인지 검증합니다.
 */
export async function transferMoney(
  params: TransferParams
): Promise<TransferResponse> {
  try {
    // axiosInstance가 자동으로 JWT 토큰을 헤더에 추가
    const response = await axiosInstance.post<ApiResponse<TransferResponse>>(
      "/education/accounts/transfer",
      params
    );

    return response.data.data;
  } catch (error: unknown) {
    devError("[transferMoney] 계좌이체 실패:", error);

    // ApiError 타입 가드를 사용한 안전한 에러 처리
    if (isApiError(error)) {
      // 403 에러: 타인의 계좌에서 출금 시도
      if (error.status === 403) {
        throw new Error("해당 계좌에서 출금할 권한이 없습니다.");
      }

      // 401 에러: 인증 실패
      if (error.status === 401) {
        throw new Error("인증이 필요합니다. 다시 로그인해주세요.");
      }

      // 400 에러: 잘못된 요청 (잔액 부족, 비밀번호 오류 등)
      if (error.status === 400) {
        throw new Error(error.backendMessage || "계좌이체에 실패했습니다.");
      }

      // 그 외 API 에러
      throw new Error(error.message);
    }

    // 네트워크 에러나 예상치 못한 에러
    throw new Error("계좌이체 중 오류가 발생했습니다. 다시 시도해주세요.");
  }
}
