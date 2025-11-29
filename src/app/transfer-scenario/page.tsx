"use client"; // 이 페이지에서 클라이언트 전용 상태 관리와 훅을 사용함을 명시합니다.

import { useEffect, Suspense, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ScenarioContainer from "./components/ScenarioContainer"; // 이체 시나리오 전체 흐름을 렌더링하는 컨테이너 컴포넌트를 가져옵니다.
import { TransferFlowProvider, useTransferFlow } from "@/lib/hooks/useTransferFlow"; // 이체 과정에서 사용하는 상태를 전역으로 제공하기 위한 컨텍스트 프로바이더입니다.
import { useScenarioEngine } from "@/lib/hooks/useScenarioEngine";
import { useScenarioBackgroundClick } from "@/lib/hooks/useScenarioBackgroundClick";

import OverlayStep from "@/components/scenario/step/OverlayStep";
import ModalStep from "@/components/scenario/step/ModalStep";
import DialogStep from "@/components/scenario/step/DialogStep";
import ImageStep from "@/components/scenario/step/ImageStep";
import ChoiceStep from "@/components/scenario/step/ChoiceStep";

function pickAnswerIndexByGood(choices: any[] | undefined, wantGood: boolean) {
  if (!Array.isArray(choices) || choices.length === 0) return undefined;

  const idx = choices.findIndex((c) => c?.good === wantGood);
  if (idx >= 0) return idx;

  // fallback: success=0, fail=1
  return wantGood ? 0 : (choices.length > 1 ? 1 : 0);
}

/**
 * 단일 라우트(`/transfer-scenario`)만 노출되도록 구성합니다.
 * 개별 시나리오 단계는 내부 state 전환으로만 렌더링됩니다.
 * URL 쿼리 파라미터로 scenarioId와 stepId가 전달되면 시나리오 step을 표시합니다.
 */
function TransferScenarioContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // 시나리오 오버레이 코드추가
  const { currentStep, previousStep, nextStep, resume } = useScenarioEngine();
  const { lastErrorType } = useTransferFlow();

  const START_STEP_ID = 1001;

  const scenarioId = useMemo(() => {
    const v = searchParams.get("scenarioId");
    return v ? Number(v) : NaN;
  }, [searchParams]);

  useEffect(() => {
    const stepIdParam = searchParams.get("stepId");
    const stepId = stepIdParam ? Number(stepIdParam) : undefined;

    if (!Number.isNaN(scenarioId)) {
      void resume(scenarioId, stepId);
    }
  }, [resume, scenarioId, searchParams]);

  const engineStepId = currentStep?.type === "PRACTICE" ? currentStep.id : null;
  const engineNextId =
    currentStep?.type === "PRACTICE"
      ? ((currentStep as any).next ??
        (currentStep as any).nextStep ??
        (currentStep as any).next_step ??
        null)
      : null;

  const handleExitToMain = useCallback(
    (nextStepId: number | null) => {
      if (Number.isNaN(scenarioId)) {
        router.replace("/woorimain");
        return;
      }

      // nextStepId가 없으면 그냥 메인만
      if (!nextStepId) {
        router.replace("/woorimain");
        return;
      }

      router.replace(`/woorimain?scenarioId=${scenarioId}&stepId=${nextStepId}`);
    },
    [router, scenarioId]
  );

  const restartFromBeginning = useCallback(() => {
    const START_STEP_ID = 1001;
    if (Number.isNaN(scenarioId)) {
      router.replace("/woorimain");
      return;
    }
    router.replace(`/woorimain?scenarioId=${scenarioId}&stepId=${START_STEP_ID}`);
  }, [router, scenarioId]);

  const restartFromWrongPart = useCallback(async () => {
    if (!currentStep) return;

    const target =
      (currentStep as any).next ??
      (currentStep as any).nextStep ??
      (currentStep as any).next_step;

    if (!target) return;

    await resume(scenarioId, Number(target));
  }, [currentStep, resume, scenarioId]);

  const handleTransferResult = useCallback(async (result: "success" | "fail") => {
    if (!currentStep || currentStep.type !== "PRACTICE" || currentStep.id == null) return;

    const choices = currentStep.content?.choices as any[] | undefined;
    const answer = pickAnswerIndexByGood(choices, result === "success");

    await nextStep(currentStep.id, answer);
  }, [currentStep, nextStep]);

  // currentStep 변경 추적
  useEffect(() => {
    if (currentStep) {
      console.log("currentStep 변경:", currentStep.id, currentStep.type, currentStep.content);
    } else {
      console.log("currentStep이 null입니다");
    }
  }, [currentStep]);

  const nextStepByBackground = useCallback(
    async (nowStepId: number) => {
      if (!currentStep) return;

      if (currentStep.type === "DIALOG") {
        const choices = currentStep.content?.choices as any[] | undefined;
        const isBadBranchDialog =
          currentStep.content?.meta?.branch === "bad" &&
          Array.isArray(choices) &&
          choices.length >= 2;

        if (isBadBranchDialog) {
          const answer =
            lastErrorType === "amount" ? 0 :
              (lastErrorType === "account" || lastErrorType === "both") ? 1 :
                0;

          await nextStep(nowStepId, answer);
          return;
        }
      }

      await nextStep(nowStepId);
    },
    [currentStep, lastErrorType, nextStep]
  );

  const handleBackgroundClick = useScenarioBackgroundClick(nextStepByBackground, currentStep);

  return (
    <>
      <Suspense fallback={<div>로딩 중...</div>}>
        <ScenarioContainer
          engineStepId={engineStepId}
          engineNextId={engineNextId}
          onPracticeNext={async (nowStepId, answer) => {
            await nextStep(nowStepId, answer);
          }}
          onTransferResult={handleTransferResult}
          onExitToMain={handleExitToMain}
        />
      </Suspense>

      {currentStep && currentStep.type !== "PRACTICE" && (
        <>
          {currentStep.type === "IMAGE" && (
            <ImageStep
              content={currentStep.content}
              onBackgroundClick={handleBackgroundClick}
            />
          )}

          {currentStep.type === "OVERLAY" && (
            <OverlayStep
              content={currentStep.content}
              previousStep={previousStep}
              onBackgroundClick={handleBackgroundClick}
            />
          )}

          {currentStep.type === "MODAL" && (
            <ModalStep
              content={currentStep.content}
              onBackgroundClick={handleBackgroundClick}
            />
          )}

          {currentStep.type === "DIALOG" && (
            <DialogStep
              content={currentStep.content}
              previousStep={previousStep}
              onBackgroundClick={handleBackgroundClick}
              onRestartFromBeginning={restartFromBeginning}
              onRestartFromWrongPart={restartFromWrongPart}
            />
          )}

          {currentStep.type === "CHOICE" && (
            <ChoiceStep
              content={currentStep.content}
              previousStep={previousStep ?? null}
              onChoose={(nextStepId: number) => {
                const choices = currentStep.content?.choices as any[] | undefined;
                const idx = Array.isArray(choices)
                  ? choices.findIndex((c) => c?.next === nextStepId)
                  : -1;

                void nextStep(currentStep.id!, idx >= 0 ? idx : 0);
              }}
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