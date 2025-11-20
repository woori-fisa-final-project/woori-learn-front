import { AutoPayment, AutoPaymentStatus } from "@/types/autoPayment";
import { devLog, logApiCall, logApiResponse, devError } from "@/utils/logger";
import axiosInstance from "@/utils/axiosInstance";
import { AUTO_PAYMENT } from "../constants";
import type { ApiResponse, Page } from "@/types/api";

const BASE_URL = "/education/auto-payment";

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

  const response = await axiosInstance.get<ApiResponse<Page<AutoPayment>>>(
    `${BASE_URL}/list/paged?${queryParams.toString()}`
  );

  return response.data.data;
}

/**
 * 자동이체 상세 조회
 */
export async function getAutoPaymentDetail(
  autoPaymentId: number
): Promise<AutoPayment> {
  const response = await axiosInstance.get<ApiResponse<AutoPayment>>(
    `${BASE_URL}/detail/${autoPaymentId}`
  );

  return response.data.data;
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
  const response = await axiosInstance.post<ApiResponse<AutoPayment>>(
    BASE_URL,
    params
  );

  return response.data.data;
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

  const response = await axiosInstance.post<ApiResponse<AutoPayment>>(url, {});

  logApiResponse(response.status, url, response.data);
  return response.data.data;
}
