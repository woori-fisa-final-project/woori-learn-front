"use client";

import Scenario11, {
  type AutoTransferInfo,
} from "./components/Scenario11";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

const DEFAULT_ACCOUNT_SUFFIX = "0000";

export default function AutomaticPaymentScenarioPage() {
  const searchParams = useSearchParams();
  const view = searchParams.get("view");

  const hasAutoTransfer = view === "registered";

  const autoTransferInfo = useMemo<AutoTransferInfo | undefined>(() => {
    if (!hasAutoTransfer) {
      return undefined;
    }

    const status = searchParams.get("status") || "정상";
    const title = searchParams.get("title") || "타행자동이체";
    const bankName = searchParams.get("bankName") || "국민은행";
    const bankAccount = searchParams.get("bankAccount") || "000-0000-000000";
    const amount = searchParams.get("amount") || "0원";
    const schedule = searchParams.get("schedule") || "1일/1개월";

    return {
      status,
      title,
      bankName,
      bankAccount,
      amount,
      schedule,
    };
  }, [hasAutoTransfer, searchParams]);

  return (
    <Scenario11
      accountSuffix={DEFAULT_ACCOUNT_SUFFIX}
      hasAutoTransfer={hasAutoTransfer}
      autoTransferInfo={autoTransferInfo}
    />
  );
}

