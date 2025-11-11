"use client";

import { TransferFlowProvider } from "@/lib/hooks/useTransferFlow";
import Scenario12 from "../components/Scenario12";

export default function AutoPaymentRegisterPage() {
  return (
    <TransferFlowProvider>
      <Scenario12 />
    </TransferFlowProvider>
  );
}

