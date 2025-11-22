import { AutoPayment, AutoPaymentStatus } from '@/types/autoPayment';
import { devLog, logApiCall, logApiResponse, devError } from '@/utils/logger';
import axiosInstance from '@/lib/axiosInstance';

const BASE_URL = '/education/auto-payment';

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
  try {
    const response = await axiosInstance.get<ApiResponse<AutoPayment[]>>(
      `${BASE_URL}/list`,
      {
        params: {
          educationalAccountId: params.educationalAccountId,
          ...(params.status && { status: params.status }),
        },
      }
    );
    return response.data.data;
  } catch (error: any) {
    devError('[getAutoPaymentList] 에러:', error);
    throw new Error(`자동이체 목록 조회 실패: ${error.message}`);
  }
}

/**
 * 자동이체 상세 조회
 */
export async function getAutoPaymentDetail(
  autoPaymentId: number
): Promise<AutoPayment> {
  try {
    const response = await axiosInstance.get<ApiResponse<AutoPayment>>(
      `${BASE_URL}/detail/${autoPaymentId}`
    );
    return response.data.data;
  } catch (error: any) {
    devError('[getAutoPaymentDetail] 에러:', error);
    throw new Error(`자동이체 상세 조회 실패: ${error.message}`);
  }
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
  try {
    const response = await axiosInstance.post<ApiResponse<AutoPayment>>(
      BASE_URL,
      params
    );
    return response.data.data;
  } catch (error: any) {
    devError('[createAutoPayment] 에러:', error);
    throw new Error(`자동이체 등록 실패: ${error.message}`);
  }
}

/**
 * 자동이체 해지
 */
export async function cancelAutoPayment(
  autoPaymentId: number,
  educationalAccountId: number
): Promise<AutoPayment> {
  const url = `${BASE_URL}/${autoPaymentId}/cancel`;

  logApiCall('POST', url, { autoPaymentId, educationalAccountId });

  try {
    const response = await axiosInstance.post<ApiResponse<AutoPayment>>(
      url,
      {},
      {
        params: { educationalAccountId },
      }
    );
    logApiResponse(response.status, url, response.data);
    return response.data.data;
  } catch (error: any) {
    devError('[cancelAutoPayment] 에러:', error);
    throw new Error(`자동이체 해지 실패: ${error.message}`);
  }
}
