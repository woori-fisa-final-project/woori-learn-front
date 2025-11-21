"use client"; // 이 페이지에서 클라이언트 전용 상태 관리와 훅을 사용함을 명시합니다.

import { useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ScenarioContainer from "./components/ScenarioContainer"; // 이체 시나리오 전체 흐름을 렌더링하는 컨테이너 컴포넌트를 가져옵니다.
import { TransferFlowProvider} from "@/lib/hooks/useTransferFlow"; // 이체 과정에서 사용하는 상태를 전역으로 제공하기 위한 컨텍스트 프로바이더입니다.
// 시나리오 오버레이 코드추가
import { useScenarioEngine } from "@/lib/hooks/useScenarioEngine";
import { useTransferFlow } from "@/lib/hooks/useTransferFlow";

import OverlayStep from "@/components/scenario/step/OverlayStep";
import ModalStep from "@/components/scenario/step/ModalStep";
import DialogStep from "@/components/scenario/step/DialogStep";

/**
 * 단일 라우트(`/transfer-scenario`)만 노출되도록 구성합니다.
 * 개별 시나리오 단계는 내부 state 전환으로만 렌더링됩니다.
 * URL 쿼리 파라미터로 scenarioId와 stepId가 전달되면 시나리오 step을 표시합니다.
 */
function TransferScenarioContent() {
  const searchParams = useSearchParams();
  // 시나리오 오버레이 코드추가
  const { currentStep, previousStep, nextStep, resume, goToStep } = useScenarioEngine();
  const { lastErrorType } = useTransferFlow();

  // URL 쿼리에서 scenarioId, stepId를 읽어와 시나리오를 재개합니다.
  useEffect(() => {
    const scenarioIdParam = searchParams.get("scenarioId");
    const stepIdParam = searchParams.get("stepId");

    const scenarioId = scenarioIdParam ? Number(scenarioIdParam) : NaN;
    const stepId = stepIdParam ? Number(stepIdParam) : undefined;

    if (!Number.isNaN(scenarioId)) {
      console.log("URL에서 시나리오 로드:", scenarioId, stepId);
      void resume(scenarioId, stepId);
    }
  }, [resume, searchParams]);

  // currentStep 변경 추적
  useEffect(() => {
    if (currentStep) {
      console.log("currentStep 변경:", currentStep.id, currentStep.type, currentStep.content);
    } else {
      console.log("currentStep이 null입니다");
    }
  }, [currentStep]);

  // 시나리오 오버레이 코드추가
  const handlePracticeNext = async () => {
    if (currentStep?.type === "PRACTICE" && currentStep.id != null) {
      await nextStep(currentStep.id);
    }
  };

  // 하드코딩된 stepId 기반 분기 로직은 제거되었습니다.
  // 이제 nextbtn 버튼 클릭으로 자동 처리됩니다.

  const handleDialogNext = async () => {
    if (!currentStep || currentStep.id == null) return;
  
    const { content, scenarioId } = currentStep;
    const choices = content?.choices as { good: boolean; next: number }[] | undefined;
  
    // ⭐ 1327 같은 BAD 분기 DIALOG인지 검사
    const isBadBranchDialog =
      content?.meta?.branch === "bad" &&
      Array.isArray(choices) &&
      choices.length > 0;
  
    if (isBadBranchDialog) {
      let targetNextId = choices[0].next; // 기본값: 금액 오류용
  
      if (lastErrorType === "amount") {
        // 금액만 틀림 → 금액 오류 시나리오(1328)
        targetNextId = choices[0].next;
      } else if (lastErrorType === "account" || lastErrorType === "both") {
        // 계좌번호 오류 또는 둘 다 틀림 → 계좌 오류 시나리오(1338)
        targetNextId = choices[1]?.next ?? choices[0].next;
      }
  
      console.log("[1327 분기] lastErrorType:", lastErrorType, "→ next:", targetNextId);
  
      // ⭐ 여기서 바로 해당 step으로 점프
      await resume(scenarioId, targetNextId);
      return;
    }
  
    // ⭐ 일반 DIALOG 는 기존처럼 진행
    await nextStep(currentStep.id);
  };
  

  // 1026 분기 로직 핸들러
  const handleTransferResult = async (result: "success" | "fail") => {
    if (!currentStep || currentStep.type !== "PRACTICE") return;
  
    const choices = currentStep.content?.choices as
      | { good: boolean; next: number }[]
      | undefined;
  
    if (!choices || choices.length === 0) {
      // PRACTICE지만 choices가 없으면 옛날 방식으로 nextStep만 호출
      await nextStep(currentStep.id);
      return;
    }
  
    let targetNextId: number | undefined;
  
    if (result === "success") {
      // good === true 인 choice 선택
      targetNextId = choices.find((c) => c.good)?.next;
    } else {
      // good === false 인 choice 선택
      targetNextId = choices.find((c) => !c.good)?.next;
    }
  
    console.log("[handleTransferResult]", { result, targetNextId, choices });
  
    if (targetNextId != null) {
      // 여기서 바로 해당 stepId로 점프
      goToStep(targetNextId);
    } else {
      // 방어 코드: 혹시 next가 없으면 그냥 nextStep
      await nextStep(currentStep.id);
    }
  };
  

  return (
    <>
      <Suspense fallback={<div>로딩 중...</div>}>
        {/* 시나리오 오버레이 코드추가 */}
        <ScenarioContainer onPracticeNext={handlePracticeNext} onTransferResult={handleTransferResult} />
      </Suspense>
      
      {/* 시나리오 오버레이 코드추가 */}
      {/* PRACTICE 타입이 아닐 때만 오버레이를 렌더링합니다. */}
      {/* PRACTICE 타입일 때는 오버레이를 렌더링하지 않고 기존 실습 화면(ScenarioContainer)을 그대로 표시합니다. */}
      {currentStep && currentStep.type !== "PRACTICE" && (
        <>
          {currentStep.type === "OVERLAY" && (
            <OverlayStep
              content={currentStep.content}
              previousStep={previousStep}
              onBackgroundClick={async () => {
                if (currentStep.id != null) {
                  await nextStep(currentStep.id);
                }
              }}
            />
          )}

          {currentStep.type === "MODAL" && (
            <ModalStep
              content={currentStep.content}
              onBackgroundClick={async () => {
                if (currentStep.id != null) {
                  await nextStep(currentStep.id);
                }
              }}
            />
          )}

          {currentStep.type === "DIALOG" && (
            <DialogStep 
              content={currentStep.content} 
              onBackgroundClick={handleDialogNext}
              previousStep={previousStep}
            />
          )}
        </>
      )}
    </>
  );
}

export default function TransferScenarioPage() {
  return (
    <TransferFlowProvider> {/* 이체 관련 상태를 하위 컴포넌트 전역에 공급합니다. */}
      <Suspense fallback={<div>로딩 중...</div>}>
        <TransferScenarioContent />
      </Suspense>
    </TransferFlowProvider>
  );
}

