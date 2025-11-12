import { EducationalAccount } from "@/types/account";

interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

/**
 * 사용자의 계좌 목록 조회
 */
export async function getAccountList(userId: number): Promise<EducationalAccount[]> {
  const response = await fetch(`/education/accounts/list/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      // JWT 토큰이 필요한 경우 여기에 추가
      // "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`계좌 목록 조회 실패: ${response.status}`);
  }

  const result: ApiResponse<EducationalAccount[]> = await response.json();
  return result.data;
}
