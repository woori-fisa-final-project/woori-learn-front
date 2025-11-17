import { AutoPayment, AutoPaymentStatus } from "@/types/autoPayment";
import { devLog, logApiCall, logApiResponse, devError } from "@/utils/logger";

const BASE_URL = "/education/auto-payment";

interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

/**
 * API 에러를 사용자 친화적인 메시지로 변환하는 헬퍼 함수
 */
async function handleApiError(response: Response, context: string): Promise<never> {
  const status = response.status;
  let errorMessage = "";
  let backendMessage = "";

  try {
    const errorData = await response.json();
    backendMessage = errorData.message || "";
  } catch {
    // JSON 파싱 실패 시 텍스트로 읽기
    try {
      backendMessage = await response.text();
    } catch {
      backendMessage = "";
    }
  }

  // 상태 코드별 에러 메시지
  switch (status) {
    case 400:
      errorMessage = backendMessage || "잘못된 요청입니다.\n입력 정보를 확인해주세요.";
      break;
    case 401:
      errorMessage = backendMessage || "인증에 실패했습니다.\n다시 로그인해주세요.";
      break;
    case 403:
      errorMessage = "권한이 없습니다.\n접근 권한을 확인해주세요.";
      break;
    case 404:
      errorMessage = "요청한 정보를 찾을 수 없습니다.";
      break;
    case 429:
      // Rate limiting 에러
      const retryAfter = response.headers.get("X-Rate-Limit-Retry-After-Seconds");
      if (retryAfter) {
        errorMessage = `요청 한도를 초과했습니다.\n${retryAfter}초 후에 다시 시도해주세요.`;
      } else {
        errorMessage = "요청 한도를 초과했습니다.\n잠시 후 다시 시도해주세요.";
      }
      break;
    case 500:
    case 502:
    case 503:
    case 504:
      errorMessage = "서버 오류가 발생했습니다.\n잠시 후 다시 시도해주세요.";
      break;
    default:
      errorMessage = backendMessage || `오류가 발생했습니다. (코드: ${status})`;
  }

  devError(`[${context}] 에러 응답 ${status}:`, backendMessage || "No message");

  const error = new Error(errorMessage);
  (error as any).status = status;
  (error as any).backendMessage = backendMessage;
  throw error;
}

interface GetAutoPaymentListParams {
  educationalAccountId: number;
  status?: AutoPaymentStatus;
}

/**
 * 자동이체 목록 조회
 */
export async function getAutoPaymentList(
  params: GetAutoPaymentListParams
): Promise<AutoPayment[]> {
  const queryParams = new URLSearchParams();
  queryParams.append("educationalAccountId", params.educationalAccountId.toString());

  if (params.status) {
    queryParams.append("status", params.status);
  }

  const response = await fetch(`${BASE_URL}/list?${queryParams.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    await handleApiError(response, "getAutoPaymentList");
  }

  const result: ApiResponse<AutoPayment[]> = await response.json();
  return result.data;
}

/**
 * 자동이체 상세 조회
 */
export async function getAutoPaymentDetail(
  autoPaymentId: number
): Promise<AutoPayment> {
  const response = await fetch(`${BASE_URL}/detail/${autoPaymentId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    await handleApiError(response, "getAutoPaymentDetail");
  }

  const result: ApiResponse<AutoPayment> = await response.json();
  return result.data;
}

interface CreateAutoPaymentParams {
  educationalAccountId: number;
  depositBankCode: string;
  depositNumber: string;
  amount: number;
  counterpartyName: string;
  displayName: string;
  transferCycle: number;
  designatedDate: number;
  startDate: string;
  expirationDate: string;
  accountPassword: string;
}

/**
 * 자동이체 등록
 */
export async function createAutoPayment(
  params: CreateAutoPaymentParams
): Promise<AutoPayment> {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    await handleApiError(response, "createAutoPayment");
  }

  const result: ApiResponse<AutoPayment> = await response.json();
  return result.data;
}

/**
 * 자동이체 해지
 */
export async function cancelAutoPayment(
  autoPaymentId: number,
  educationalAccountId: number
): Promise<AutoPayment> {
  const queryParams = new URLSearchParams();
  queryParams.append("educationalAccountId", educationalAccountId.toString());

  const url = `${BASE_URL}/${autoPaymentId}/cancel?${queryParams.toString()}`;

  logApiCall("POST", url, { autoPaymentId, educationalAccountId });

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });

  if (!response.ok) {
    await handleApiError(response, "cancelAutoPayment");
  }

  const result: ApiResponse<AutoPayment> = await response.json();
  logApiResponse(response.status, url, result);
  return result.data;
}
