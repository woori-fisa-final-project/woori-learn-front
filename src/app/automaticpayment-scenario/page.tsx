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

    return {
      status: "정상",
      title: "타행자동이체",
      bankName: "국민은행",
      bankAccount: "00000000000000",
      amount: "1,000원",
      schedule: "31일/1개월",
    };
  }, [hasAutoTransfer]);

  return (
    <Scenario11
      accountSuffix={DEFAULT_ACCOUNT_SUFFIX}
      hasAutoTransfer={hasAutoTransfer}
      autoTransferInfo={autoTransferInfo}
    />
  );
}

