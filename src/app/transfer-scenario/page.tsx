"use client";

import ScenarioContainer from "./components/ScenarioContainer";
import { TransferFlowProvider } from "@/lib/hooks/useTransferFlow";

/**
 * 단일 라우트(`/transfer-scenario`)만 노출되도록 구성합니다.
 * 개별 시나리오 단계는 내부 state 전환으로만 렌더링됩니다.
 */
export default function TransferScenarioPage() {
  return (
    <TransferFlowProvider>
      <ScenarioContainer />
    </TransferFlowProvider>
  );
}

