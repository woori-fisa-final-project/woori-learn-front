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

export function useAccountData() {
  const [accountData, setAccountData] = useState<AccountData>({});

  useEffect(() => {
    if (typeof window === "undefined") return;

    const saved = localStorage.getItem("accountData");
    if (saved) {
      try {
        setAccountData(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse accountData", e);
      }
    }
  }, []);

  const updateAccountData = (data: Partial<AccountData>) => {
    const newData = { ...accountData, ...data };
    setAccountData(newData);
    if (typeof window !== "undefined") {
      localStorage.setItem("accountData", JSON.stringify(newData));
    }
  };

  const clearAccountData = () => {
    setAccountData({});
    if (typeof window !== "undefined") {
      localStorage.removeItem("accountData");
    }
  };

  return { accountData, updateAccountData, clearAccountData };
}

