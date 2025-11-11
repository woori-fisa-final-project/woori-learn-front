"use client"; // 이 페이지에서 클라이언트 전용 상태 관리와 훅을 사용함을 명시합니다.

import ScenarioContainer from "./components/ScenarioContainer"; // 이체 시나리오 전체 흐름을 렌더링하는 컨테이너 컴포넌트를 가져옵니다.
import { TransferFlowProvider } from "@/lib/hooks/useTransferFlow"; // 이체 과정에서 사용하는 상태를 전역으로 제공하기 위한 컨텍스트 프로바이더입니다.

/**
 * 단일 라우트(`/transfer-scenario`)만 노출되도록 구성합니다.
 * 개별 시나리오 단계는 내부 state 전환으로만 렌더링됩니다.
 */
export default function TransferScenarioPage() {
  return (
    <TransferFlowProvider> {/* 이체 관련 상태를 하위 컴포넌트 전역에 공급합니다. */}
      <ScenarioContainer />
    </TransferFlowProvider>
  );
}

