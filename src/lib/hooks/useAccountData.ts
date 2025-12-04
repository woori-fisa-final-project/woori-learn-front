/**
 * [SECURITY UPDATE] Gemini feedback 적용
 * - Removed sensitive data storage in localStorage
 * - Added safe metadata persistence with explicit warning comments
 * - Documented secure alternatives for post-refresh restoration
 */
import { useState, useEffect } from "react"; // 계좌 개설 과정에서 입력된 데이터를 상태로 관리하기 위해 React 훅을 사용합니다.

interface AccountData { // 실제 계좌 개설 폼에서 다루는 민감한 정보를 정의하는 인터페이스입니다.
  realName?: string;
  birthDate?: string;
  genderCode?: string;
  phoneCarrier?: string;
  phoneNumber?: string;
  email?: string;
  englishName?: string;
  accountPassword?: string;
  agreedTerms?: string[];
}

type AccountDataMeta = {
  agreedTerms?: string[];
  lastUpdated: number;
};

export function useAccountData() { // 계좌 개설 단계에서 입력된 정보를 메모리와 일부 메타데이터로 관리하는 커스텀 훅입니다.
  const [accountData, setAccountData] = useState<AccountData>({}); // 민감한 정보를 포함한 전체 계좌 데이터를 메모리에 보관합니다.

  useEffect(() => { // 브라우저 환경에서만 localStorage에 저장된 메타데이터를 불러옵니다.
    if (typeof window === "undefined") return; // 서버 렌더링 환경에서는 localStorage를 사용할 수 없으므로 종료합니다.

    try {
      const savedMeta = localStorage.getItem("accountDataMeta"); // 이전 세션에서 보관된 메타데이터를 읽어옵니다.
      if (!savedMeta) return; // 저장된 값이 없으면 아무 작업도 하지 않습니다.

      const parsedMeta: AccountDataMeta = JSON.parse(savedMeta); // 문자열로 저장된 메타데이터를 객체로 변환합니다.
      setAccountData((prev) => ({
        ...prev,
        agreedTerms: parsedMeta.agreedTerms,
      }));
    } catch (error) {
      console.warn("[useAccountData] Failed to hydrate non-sensitive metadata:", error);
    }
  }, []);

  const updateAccountData = (data: Partial<AccountData>) => { // 계좌 데이터 일부를 업데이트하고 메타데이터를 함께 반영합니다.
    const newData = { ...accountData, ...data }; // 기존 상태와 새 데이터를 병합하여 최신 상태를 만듭니다.
    setAccountData(newData); // 민감한 정보는 메모리에만 저장합니다.

    if (typeof window !== "undefined") {
      try {
        const meta: AccountDataMeta = {
          agreedTerms: newData.agreedTerms,
          lastUpdated: Date.now(),
        };
        localStorage.setItem("accountDataMeta", JSON.stringify(meta));
        // NOTE: Sensitive attributes (realName, phoneNumber, etc.) must never be persisted in localStorage.
        // TODO: Use secure server sessions or encrypted HTTP-only cookies if post-refresh access is required.
      } catch (error) {
        console.warn("[useAccountData] Failed to persist non-sensitive metadata:", error);
      }
    }
  };

  const clearAccountData = () => { // 계좌 개설 데이터를 초기화하고 저장된 메타데이터도 삭제합니다.
    setAccountData({}); // 메모리에 있는 모든 계좌 데이터를 초기화합니다.
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("accountDataMeta"); // 로컬 스토리지에 저장된 메타데이터를 제거합니다.
      } catch (error) {
        console.warn("[useAccountData] Failed to clear metadata from localStorage:", error);
      }
    }
  };

  return { accountData, updateAccountData, clearAccountData }; // 외부에서 현재 데이터와 업데이트/초기화 함수를 사용할 수 있도록 반환합니다.
}



