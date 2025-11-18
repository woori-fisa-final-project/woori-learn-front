import { AutoPayment, AutoPaymentStatus } from "@/types/autoPayment";
import { devLog, logApiCall, logApiResponse, devError } from "@/utils/logger";
import { ApiError } from "@/types/errors";
import { AUTO_PAYMENT } from "../constants";

const BASE_URL = "/education/auto-payment";

interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

/**
 * Spring Data Page 구조
 */
export interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

/**
 * API 에러를 사용자 친화적인 메시지로 변환하는 헬퍼 함수
 * ApiError를 throw하므로 절대 반환하지 않습니다.
 */
async function handleApiError(response: Response, context: string): Promise<never> {
  const status = response.status;
  let errorMessage = "";
  let backendMessage = "";

  const clonedResponse = response.clone();
  try {
    const errorData = await response.json();
    backendMessage = errorData?.message || "";
  } catch {
    // JSON 파싱 실패 시 텍스트로 읽기
    try {
      backendMessage = await clonedResponse.text();
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
      errorMessage = backendMessage || "권한이 없습니다.\n접근 권한을 확인해주세요.";
      break;
    case 404:
      errorMessage = backendMessage || "요청한 정보를 찾을 수 없습니다.";
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

  throw new ApiError(errorMessage, status, backendMessage);
}

interface GetAutoPaymentListParams {
  educationalAccountId: number;
  status?: AutoPaymentStatus;
  page?: number; // 페이지 번호 (0-based), 기본값: 0
  size?: number; // 페이지 크기, 기본값: 20
  sort?: string; // 정렬 옵션 (예: "createdAt,desc")
}

/**
 * 자동이체 목록 조회 (페이지네이션)
 */
export async function getAutoPaymentList(
  params: GetAutoPaymentListParams
): Promise<Page<AutoPayment>> {
  const queryParams = new URLSearchParams();
  queryParams.append("educationalAccountId", params.educationalAccountId.toString());

  if (params.status) {
    queryParams.append("status", params.status);
  }

  // 페이지네이션 파라미터
  queryParams.append("page", (params.page ?? 0).toString());
  queryParams.append("size", (params.size ?? AUTO_PAYMENT.PAGE_SIZE).toString());

  if (params.sort) {
    queryParams.append("sort", params.sort);
  }

  const response = await fetch(`${BASE_URL}/list/paged?${queryParams.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    await handleApiError(response, "getAutoPaymentList");
  }

  const result: ApiResponse<Page<AutoPayment>> = await response.json();
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
