import { EducationalAccount } from "@/types/account";

/**
 * 사용자의 계좌 목록 조회
 * 백엔드 응답: 배열 형태 그대로 내려옴
 * 예:
 * [
 *   { accountName: "박소희", accountNumber: "1122334455", balance: 3938900 },
 *   { accountName: "박소희", accountNumber: "9999999999", balance: 500000 }
 * ]
 */

export async function getAccountList(
  userId: number
): Promise<EducationalAccount[]> {
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!BASE_URL) {
    throw new Error("환경변수 NEXT_PUBLIC_API_BASE_URL 이 설정되지 않았습니다.");
  }

  const response = await fetch(`${BASE_URL}/education/accounts/list/${userId}`, {
    method: "GET",
    credentials: "include", // JWT/쿠키 인증을 위해 필수
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`계좌 목록 조회 실패 (HTTP ${response.status})`);
  }

  const result = await response.json();

  console.log("계좌 목록 API 응답:", result);

  // { code, message, data } 구조 검증
  if (!result || !Array.isArray(result.data)) {
    throw new Error("서버 응답 형식 오류: data 배열이 없습니다.");
  }

  return result.data;
}
