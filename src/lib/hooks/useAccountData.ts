/**
 * [SECURITY UPDATE] Gemini feedback 적용
 * - Removed sensitive data storage in localStorage
 * - Added safe metadata persistence with explicit warning comments
 * - Documented secure alternatives for post-refresh restoration
 */
import { useState, useEffect } from "react";

interface AccountData {
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

export function useAccountData() {
  const [accountData, setAccountData] = useState<AccountData>({});

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const savedMeta = localStorage.getItem("accountDataMeta");
      if (!savedMeta) return;

      const parsedMeta: AccountDataMeta = JSON.parse(savedMeta);
      setAccountData((prev) => ({
        ...prev,
        agreedTerms: parsedMeta.agreedTerms,
      }));
    } catch (error) {
      console.warn("[useAccountData] Failed to hydrate non-sensitive metadata:", error);
    }
  }, []);

  const updateAccountData = (data: Partial<AccountData>) => {
    const newData = { ...accountData, ...data };
    setAccountData(newData);

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

  const clearAccountData = () => {
    setAccountData({});
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("accountDataMeta");
      } catch (error) {
        console.warn("[useAccountData] Failed to clear metadata from localStorage:", error);
      }
    }
  };

  return { accountData, updateAccountData, clearAccountData };
}



