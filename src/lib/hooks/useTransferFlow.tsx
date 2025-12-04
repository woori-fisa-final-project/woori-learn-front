"use client";

import { create } from "zustand";

export type LastErrorType = "none" | "account" | "amount" | "both";

const DEV_FALLBACK_ACCOUNT = process.env.NEXT_PUBLIC_DEV_SOURCE_ACCOUNT ?? ""; // 개발 환경에서 사용할 출금 계좌 번호 기본값입니다.

const RECIPIENT_NAME_MAP: Record<string, string> = {
  "110123456789": "김집주",
};

// 숫자만 추출
const digitsOnly = (value: string) => value.replace(/\D/g, "");

// 계좌번호 포맷팅 (3-3-6)
const formatAccountNumber = (value: string) => {
  const digits = digitsOnly(value).slice(0, 12);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
};

export const resolveRecipientName = (accountNumber: string) => {
  const normalized = digitsOnly(accountNumber);
  return RECIPIENT_NAME_MAP[normalized] ?? "알 수 없음";
};

export type TransferResult = {
  amount: number;
  balance: number;
  formattedAccountNumber?: string;
  counterpartyName?: string;
  toAccountNumberFormatted?: string;
};

type TransferState = {

  selectedBank: string | null;
  accountNumber: string;
  recipientName: string;
  amount: number;
  sourceAccountNumber: string;
  enteredPassword: string;
  transferResult: TransferResult | null;
  lastErrorType: LastErrorType;
  setSelectedBank: (bank: string | null) => void;
  setAccountNumber: (accountNumber: string) => void;
  updateAccountNumber: (accountNumber: string) => void;
  setRecipientName: (name: string) => void;
  setAmount: (amount: number) => void;
  setSourceAccountNumber: (value: string) => void;
  setEnteredPassword: (password: string) => void;
  setTransferResult: (result: TransferResult) => void;
  setLastErrorType: (type: LastErrorType) => void;
  resetFlow: () => void;
};

// --- 초기 상태값 ---
const DEFAULT_STATE = {
  selectedBank: null as string | null,
  accountNumber: "",
  recipientName: "",
  amount: 0,
  sourceAccountNumber: DEV_FALLBACK_ACCOUNT,
  enteredPassword: "",
  transferResult: null as TransferResult | null,
  lastErrorType: "none" as LastErrorType,
};

// --- Zustand 스토어 생성 ---
export const useTransferFlow = create<TransferState>((set) => ({
  // 초기 상태 적용
  ...DEFAULT_STATE,

  // Action 구현
  setSelectedBank: (bank) => set({ selectedBank: bank }),
  setAccountNumber: (accountNumber) => set({ accountNumber }),
  updateAccountNumber: (value) => {
    const formatted = formatAccountNumber(value);
    set({ accountNumber: formatted });
  },
  setRecipientName: (name) => set({ recipientName: name }),
  setAmount: (amount) => set({ amount }),
  setSourceAccountNumber: (value) => set({ sourceAccountNumber: value }),
  setEnteredPassword: (password) => set({ enteredPassword: password }),
  setTransferResult: (result) => set({ transferResult: result }),
  setLastErrorType: (type) => set({ lastErrorType: type }),
  resetFlow: () => set({ ...DEFAULT_STATE }),
}));