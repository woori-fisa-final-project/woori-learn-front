"use client";

import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { useUserData } from "@/lib/hooks/useUserData";

/**
 * ------------------------------------------------------------------
 * 상수 및 유틸리티 함수
 * ------------------------------------------------------------------
 */

// 개발 환경에서 사용자 정보가 없을 경우 사용할 기본값 (환경변수 또는 하드코딩)
const DEV_FALLBACK_ACCOUNT = process.env.NEXT_PUBLIC_DEV_SOURCE_ACCOUNT ?? "";
const DEV_FALLBACK_USER_NAME = process.env.NEXT_PUBLIC_DEV_USER_NAME ?? "사용자";

// 특정 계좌번호에 대한 수취인 이름 매핑 (하드코딩 된 테스트 데이터)
const RECIPIENT_NAME_MAP: Record<string, string> = {
  "110123456789": "김집주",
};

/** 문자열에서 숫자만 추출하는 유틸리티 */
const digitsOnly = (value: string) => value.replace(/\D/g, "");

/** 계좌번호 입력 시 자동으로 하이픈(-)을 포맷팅하는 함수 (3-3-6 자리 형식) */
const formatAccountNumber = (value: string) => {
  const digits = digitsOnly(value).slice(0, 12);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
};

// 상태 초기화를 위한 기본값 객체
const DEFAULT_STATE = {
  selectedBank: null as string | null,
  accountNumber: "",
  recipientName: "",
  amount: 0,
  sourceAccountNumber: DEV_FALLBACK_ACCOUNT,
};

/**
 * ------------------------------------------------------------------
 * Context 타입 정의
 * ------------------------------------------------------------------
 */
type TransferFlowContextValue = {
  // [1] 받는 분 정보 (수취인)
  selectedBank: string | null;              // 선택된 은행
  setSelectedBank: (bank: string | null) => void;
  accountNumber: string;                    // 계좌번호
  updateAccountNumber: (accountNumber: string) => void; // (포맷팅 포함된 업데이트 함수)
  recipientName: string;                    // 예금주명
  setRecipientName: (name: string) => void;
  
  // [2] 송금 정보
  amount: number;                           // 보낼 금액
  setAmount: (amount: number) => void;

  // [3] 보내는 분 정보 (송금인)
  currentUserName: string;                  // 현재 로그인한 사용자 이름
  sourceAccountNumber: string;              // 출금할 내 계좌번호
  setSourceAccountNumber: (value: string) => void;

  // [4] 시나리오별 확장 데이터
  /** Scenario5: 입력한 계좌 비밀번호 저장 */
  enteredPassword: string;
  setEnteredPassword: (pw: string) => void;

  /** Scenario6 → 7: 송금 완료/실패 결과 데이터 전달 */
  transferResult: any;
  setTransferResult: (data: any) => void;

  // [5] 유틸리티
  resetFlow: () => void;                    // 모든 상태 초기화
};

const TransferFlowContext = createContext<TransferFlowContextValue | undefined>(undefined);

/**
 * ------------------------------------------------------------------
 * Provider 컴포넌트
 * : 송금 프로세스 전반의 상태를 관리하고 하위 컴포넌트에 제공합니다.
 * ------------------------------------------------------------------
 */
export function TransferFlowProvider({ children }: { children: ReactNode }) {
  // 1. 받는 분 정보 상태
  const [selectedBank, setSelectedBank] = useState<string | null>(DEFAULT_STATE.selectedBank);
  const [accountNumber, setAccountNumber] = useState(DEFAULT_STATE.accountNumber);
  const [recipientName, setRecipientName] = useState(DEFAULT_STATE.recipientName);

  // 2. 금액 상태
  const [amount, setAmount] = useState(DEFAULT_STATE.amount);

  // 3. 보내는 분 정보 상태
  const [sourceAccountNumber, setSourceAccountNumber] = useState(DEFAULT_STATE.sourceAccountNumber);
  const { userName } = useUserData(); // 커스텀 훅에서 사용자 이름 가져오기

  // 4. 추가 시나리오용 상태
  const [enteredPassword, setEnteredPassword] = useState(""); // 비밀번호 입력값
  const [transferResult, setTransferResult] = useState(null); // 송금 결과 데이터

  /**
   * 계좌번호 업데이트 핸들러
   * : 입력된 값에서 숫자만 추출한 뒤 하이픈 포맷을 적용하여 저장합니다.
   */
  const updateAccountNumber = useCallback((value: string) => {
    const formatted = formatAccountNumber(value);
    setAccountNumber(formatted);
  }, []);

  /**
   * 송금 프로세스 초기화
   * : 송금이 완료되거나 취소되었을 때 모든 입력값을 기본값으로 되돌립니다.
   */
  const resetFlow = useCallback(() => {
    // 기본 정보 초기화
    setSelectedBank(DEFAULT_STATE.selectedBank);
    setAccountNumber(DEFAULT_STATE.accountNumber);
    setRecipientName(DEFAULT_STATE.recipientName);
    setAmount(DEFAULT_STATE.amount);
    setSourceAccountNumber(DEFAULT_STATE.sourceAccountNumber);

    // 추가 시나리오 데이터 초기화
    setEnteredPassword("");
    setTransferResult(null);
  }, []);

  // Context Provider에 주입할 값 구성 (Memoization 적용)
  const contextValue = useMemo<TransferFlowContextValue>(
    () => ({
      // 수취인 정보
      selectedBank,
      setSelectedBank,
      accountNumber,
      updateAccountNumber,
      recipientName,
      setRecipientName,

      // 금액 정보
      amount,
      setAmount,

      // 송금인 정보
      currentUserName: userName?.trim() || DEV_FALLBACK_USER_NAME,
      sourceAccountNumber,
      setSourceAccountNumber,

      // 추가 시나리오 데이터
      enteredPassword,
      setEnteredPassword,
      transferResult,
      setTransferResult,

      // 초기화 함수
      resetFlow,
    }),
    [
      selectedBank,
      accountNumber,
      updateAccountNumber,
      recipientName,
      amount,
      userName,
      sourceAccountNumber,
      enteredPassword,
      transferResult,
      resetFlow,
    ]
  );

  return (
    <TransferFlowContext.Provider value={contextValue}>
      {children}
    </TransferFlowContext.Provider>
  );
}

/**
 * ------------------------------------------------------------------
 * 커스텀 훅: useTransferFlow
 * : Provider 내부에서만 사용 가능하도록 안전장치가 포함되어 있습니다.
 * ------------------------------------------------------------------
 */
export function useTransferFlow() {
  const context = useContext(TransferFlowContext);
  if (!context) {
    throw new Error("useTransferFlow must be used within a TransferFlowProvider");
  }
  return context;
}