import axiosInstance from '@/lib/axiosInstance';

// ------------------------------------------
// 1) 포인트 적립
// ------------------------------------------
export async function depositPoint(dto: { amount: number; reason?: string }) {
  const response = await axiosInstance.post('/points/deposit', dto);
  return response.data;
}

// ------------------------------------------
// 2) 포인트 환전 요청
// ------------------------------------------
export async function requestPointExchange(dto: {
  exchangeAmount: number;
  accountNum: string;
  bankCode: string;
}) {
  const response = await axiosInstance.post('/points/exchange', dto);
  return response.data;
}

// ------------------------------------------
// 3) 포인트 내역 조회 (타입 적용)
// ------------------------------------------

export interface PointExchangeHistoryQuery {
  username?: string;
  period?: 'ALL' | 'WEEK' | 'MONTH' | 'THREE_MONTHS';
  sort?: 'DESC' | 'ASC';
  status?:
    | 'ALL'
    | 'DEPOSIT'
    | 'WITHDRAW_APPLY'
    | 'WITHDRAW_SUCCESS'
    | 'WITHDRAW_FAILED';
  page?: number;
  size?: number;
}

export async function getPointHistory(
  query: PointExchangeHistoryQuery = {}
) {
  const response = await axiosInstance.get('/points/history', {
    params: query,
  });
  return response.data;
}


