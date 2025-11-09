"use client";
import { ReactNode, createContext, useCallback, useContext, useMemo, useState } from "react";
import { useUserData } from "@/lib/hooks/useUserData";

type TransferFlowContextValue = {
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
  resetFlow: () => void;
};

const TransferFlowContext = createContext<TransferFlowContextValue | undefined>(undefined);

const RECIPIENT_NAME_MAP: Record<string, string> = {
  "110123456789": "김집주",
};

const digitsOnly = (value: string) => value.replace(/\D/g, "");

const formatAccountNumber = (value: string) => {
  const digits = digitsOnly(value).slice(0, 12);
  if (digits.length <= 3) {
    return digits;
  }
  if (digits.length <= 6) {
    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  }
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
};

const resolveRecipientName = (accountNumber: string) => {
  const normalized = digitsOnly(accountNumber);
  return RECIPIENT_NAME_MAP[normalized] ?? "최누구";
};

const DEFAULT_STATE = {
  selectedBank: null as string | null,
  accountNumber: "",
  recipientName: "",
  amount: 0,
};

const SOURCE_ACCOUNT_NUMBER = "1002-356-789012";
const FALLBACK_USER_NAME = "김우리";

export function TransferFlowProvider({ children }: { children: ReactNode }) {
  const [selectedBank, setSelectedBank] = useState<string | null>(DEFAULT_STATE.selectedBank);
  const [accountNumber, setAccountNumber] = useState(DEFAULT_STATE.accountNumber);
  const [recipientName, setRecipientName] = useState(DEFAULT_STATE.recipientName);
  const [amount, setAmount] = useState(DEFAULT_STATE.amount);
  const { userName } = useUserData();

  const updateAccountNumber = useCallback((value: string) => {
    const formatted = formatAccountNumber(value);
    setAccountNumber(formatted);
  }, []);

  const resetFlow = useCallback(() => {
    setSelectedBank(DEFAULT_STATE.selectedBank);
    setAccountNumber(DEFAULT_STATE.accountNumber);
    setRecipientName(DEFAULT_STATE.recipientName);
    setAmount(DEFAULT_STATE.amount);
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
      currentUserName: userName || FALLBACK_USER_NAME,
      sourceAccountNumber: SOURCE_ACCOUNT_NUMBER,
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

