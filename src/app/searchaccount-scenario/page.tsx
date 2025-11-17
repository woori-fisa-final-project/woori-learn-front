"use client"; // 클라이언트 훅(useRouter 등)을 사용하기 위해 클라이언트 컴포넌트로 선언합니다.

import { Suspense } from "react";
import Scenario8 from "./components/Scenario8"; // 실제 검색형 계좌 시나리오 화면을 담당하는 컴포넌트를 가져옵니다.
import Scenario9 from "./components/Scenario9"; // 거래내역 조회 시나리오 화면을 추가로 렌더링하기 위해 불러옵니다.
import Scenario10 from "./components/Scenario10"; // 거래내역 상세 시나리오 화면을 추가로 렌더링합니다.
import { TransferFlowProvider } from "@/lib/hooks/useTransferFlow"; // 계좌/금액 등 공유 상태를 제공하는 컨텍스트 프로바이더를 불러옵니다.
import { useSearchParams } from "next/navigation"; // URL 쿼리 파라미터를 읽어 어떤 시나리오를 보여줄지 결정합니다.

/**
 * `/searchaccount-scenario` 경로를 단일 진입점으로 노출하기 위한 페이지 컴포넌트입니다.
 * `step` 쿼리 파라미터를 사용해 시나리오 8(계좌 목록)과 9(거래내역 조회)를 전환합니다.
 */
function SearchAccountScenarioContent() {
  const searchParams = useSearchParams(); // 현재 URL의 쿼리 파라미터를 읽습니다.
  const step = searchParams.get("step"); // step 값이 "9"인 경우 거래내역 조회 화면을 노출합니다.

  const scenarios: { [key: string]: React.ReactNode } = {
    "9": <Scenario9 />,
    "10": <Scenario10 />,
  };

  return (
    <TransferFlowProvider>
      {/* 이체 시나리오와 동일한 컨텍스트를 재사용하여 계좌 정보 연동을 유지합니다. */}
      {(step && scenarios[step]) || <Scenario8 />}
    </TransferFlowProvider>
  );
}

export default function SearchAccountScenarioPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    }>
      <SearchAccountScenarioContent />
    </Suspense>
  );
}
