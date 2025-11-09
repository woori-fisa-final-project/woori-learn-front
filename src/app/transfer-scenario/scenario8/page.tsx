"use client";

import Scenario8 from "../components/Scenario8";
import { TransferFlowProvider } from "@/lib/hooks/useTransferFlow";

export default function Scenario8Page() {
  return (
    <TransferFlowProvider>
      <Scenario8 />
    </TransferFlowProvider>
  );
}
