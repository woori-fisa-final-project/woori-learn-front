import { useState, useEffect } from "react";
import { getAccountList } from "@/lib/api/account";
import type { EducationalAccount } from "@/types/account";
import { getCurrentUserId } from "@/utils/authUtils";
import { devError } from "@/utils/logger";

/**
 * 계좌 목록 조회 및 선택 관리를 위한 커스텀 훅
 */
export function useAccountSelection() {
  const [accounts, setAccounts] = useState<EducationalAccount[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<EducationalAccount | null>(null);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    async function fetchAccounts() {
      try {
        setIsLoadingAccounts(true);
        setErrorMessage("");
        const accountList = await getAccountList(getCurrentUserId());
        setAccounts(accountList);
      } catch (error) {
        devError("[useAccountSelection] 계좌 목록 조회 실패:", error);
        setErrorMessage("계좌 목록을 불러오지 못했습니다.");
        setAccounts([]);
      } finally {
        setIsLoadingAccounts(false);
      }
    }

    fetchAccounts();
  }, []);

  const selectAccount = (accountId: number) => {
    const account = accounts.find((item) => item.id === accountId);
    if (!account) return null;
    setSelectedAccount(account);
    return account;
  };

  return {
    accounts,
    selectedAccount,
    isLoadingAccounts,
    errorMessage,
    selectAccount,
  };
}
