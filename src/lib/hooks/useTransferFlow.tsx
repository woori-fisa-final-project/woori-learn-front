/**
 * [SECURITY UPDATE] Gemini feedback 적용
 * - Removed hardcoded account owner metadata
 * - Documented requirement to source user/session data securely
 */
"use client"; // 이 훅은 브라우저 상태와 상호작용하므로 클라이언트 전용으로 선언합니다.
import { ReactNode, createContext, useCallback, useContext, useMemo, useState } from "react"; // 컨텍스트 구성과 상태 관리를 위해 필요한 React API를 불러옵니다.
import { useUserData } from "@/lib/hooks/useUserData"; // 현재 로그인한 사용자 정보를 가져오기 위해 사용자 데이터 훅을 사용합니다.

const DEV_FALLBACK_ACCOUNT = process.env.NEXT_PUBLIC_DEV_SOURCE_ACCOUNT ?? ""; // 개발 환경에서 사용할 출금 계좌 번호 기본값입니다.
const DEV_FALLBACK_USER_NAME = process.env.NEXT_PUBLIC_DEV_USER_NAME ?? "사용자"; // 개발 환경에서 사용할 사용자 이름 기본값입니다.

// NOTE: This context should eventually pull from a secure user session provider.
type TransferFlowContextValue = { // 이체 시나리오에서 공유할 상태와 동작을 정의합니다.
  selectedBank: string | null;
  setSelectedBank: (bank: string | null) => void;
  accountNumber: string;
  updateAccountNumber: (accountNumber: string) => void;
  recipientName: string;
  setRecipientName: (name: string) => void;
  amount: number;
  setAmount: (amount: number) => void;
  currentUserName: string;
  sourceAccountNumber: string;
  setSourceAccountNumber: (value: string) => void;
  resetFlow: () => void;
};

const TransferFlowContext = createContext<TransferFlowContextValue | undefined>(undefined); // 프로바이더가 없을 때 undefined를 반환하도록 설정합니다.

const RECIPIENT_NAME_MAP: Record<string, string> = { // 특정 계좌번호를 입력했을 때 표시할 수취인 이름 매핑입니다.
  "110123456789": "김집주",
};

const digitsOnly = (value: string) => value.replace(/\D/g, ""); // 입력값에서 숫자만 추출하여 형식화를 돕습니다.

const formatAccountNumber = (value: string) => { // 계좌번호를 3-3-6 형식으로 포맷팅합니다.
  const digits = digitsOnly(value).slice(0, 12); // 숫자만 추출하고 최대 12자리로 제한합니다.
  if (digits.length <= 3) {
    return digits; // 3자리 이하일 때는 하이픈 없이 반환합니다.
  }
  if (digits.length <= 6) {
    return `${digits.slice(0, 3)}-${digits.slice(3)}`; // 6자리 이하이면 3-3 구조로 반환합니다.
  }
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`; // 나머지는 3-3-나머지 형식으로 분리합니다.
};

const resolveRecipientName = (accountNumber: string) => { // 입력된 계좌번호를 기반으로 수취인 이름을 추론합니다.
  const normalized = digitsOnly(accountNumber); // 계좌번호에서 숫자만 추출하여 비교합니다.
  return RECIPIENT_NAME_MAP[normalized] ?? "유정호"; // 매핑된 이름이 없으면 기본 이름을 반환합니다.
};

const DEFAULT_STATE = { // 이체 시나리오 초기 상태를 한 곳에 모아둡니다.
  selectedBank: null as string | null,
  accountNumber: "",
  recipientName: "",
  amount: 0,
  sourceAccountNumber: DEV_FALLBACK_ACCOUNT,
};

export function TransferFlowProvider({ children }: { children: ReactNode }) { // 이체 시나리오 전반에 공유 상태를 제공하는 컨텍스트 프로바이더입니다.
  const [selectedBank, setSelectedBank] = useState<string | null>(DEFAULT_STATE.selectedBank); // 사용자가 선택한 은행 정보를 상태로 저장합니다.
  const [accountNumber, setAccountNumber] = useState(DEFAULT_STATE.accountNumber); // 입력 중인 계좌번호를 상태로 저장합니다.
  const [recipientName, setRecipientName] = useState(DEFAULT_STATE.recipientName); // 수취인 이름을 상태로 관리합니다.
  const [amount, setAmount] = useState(DEFAULT_STATE.amount); // 이체 금액을 상태로 저장합니다.
  const [sourceAccountNumber, setSourceAccountNumber] = useState(DEFAULT_STATE.sourceAccountNumber);
  const { userName } = useUserData(); // 현재 로그인한 사용자의 이름을 불러옵니다.

  const updateAccountNumber = useCallback((value: string) => { // 계좌번호 입력 시 형식을 자동으로 맞추는 함수입니다.
    const formatted = formatAccountNumber(value); // 숫자만 추출해 규칙에 맞게 재조합합니다.
    setAccountNumber(formatted); // 포맷팅된 값을 상태에 반영합니다.
  }, []);

  const resetFlow = useCallback(() => { // 이체 시나리오를 초기 상태로 되돌리는 함수입니다.
    setSelectedBank(DEFAULT_STATE.selectedBank); // 선택된 은행을 초기화합니다.
    setAccountNumber(DEFAULT_STATE.accountNumber); // 입력된 계좌번호를 초기화합니다.
    setRecipientName(DEFAULT_STATE.recipientName); // 수취인 이름을 초기화합니다.
    setAmount(DEFAULT_STATE.amount); // 이체 금액을 0으로 초기화합니다.
    setSourceAccountNumber(DEFAULT_STATE.sourceAccountNumber);
  }, []);

  const contextValue = useMemo<TransferFlowContextValue>(
    () => ({
      selectedBank,
      setSelectedBank,
      accountNumber,
      updateAccountNumber,
      recipientName,
      setRecipientName,
      amount,
      setAmount,
      currentUserName: userName?.trim() || DEV_FALLBACK_USER_NAME, // 사용자 이름이 없거나 공백이면 개발용 기본값을 사용합니다.
      sourceAccountNumber,
      setSourceAccountNumber,
      resetFlow,
    }),
    [
      selectedBank,
      accountNumber,
      updateAccountNumber,
      recipientName,
      setRecipientName,
      amount,
      setAmount,
      userName,
      sourceAccountNumber,
      resetFlow,
    ]
  );

  return <TransferFlowContext.Provider value={contextValue}>{children}</TransferFlowContext.Provider>;
}

export function useTransferFlow() {
  const context = useContext(TransferFlowContext);
  if (!context) {
    throw new Error("useTransferFlow must be used within a TransferFlowProvider");
  }
  return context;
}

