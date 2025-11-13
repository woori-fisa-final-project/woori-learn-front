import { AutoPayment, AutoPaymentStatus } from "@/types/autoPayment";

const BASE_URL = "/education/auto-payment";

interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
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
      // JWT 토큰이 필요한 경우 여기에 추가
      // "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`자동이체 목록 조회 실패: ${response.status}`);
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
    throw new Error(`자동이체 상세 조회 실패: ${response.status}`);
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
    throw new Error(`자동이체 등록 실패: ${response.status}`);
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
  console.log("=== 자동이체 해지 API 요청 ===");
  console.log("URL:", url);
  console.log("Method: PUT");
  console.log("autoPaymentId:", autoPaymentId);
  console.log("educationalAccountId:", educationalAccountId);

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}), // 빈 객체라도 body 추가
  });

  console.log("응답 상태:", response.status, response.statusText);

  if (!response.ok) {
    const errorText = await response.text();
    console.error("에러 응답:", errorText);
    throw new Error(`자동이체 해지 실패: ${response.status} - ${errorText}`);
  }

  const result: ApiResponse<AutoPayment> = await response.json();
  console.log("해지 성공 응답:", result);
  return result.data;
}
