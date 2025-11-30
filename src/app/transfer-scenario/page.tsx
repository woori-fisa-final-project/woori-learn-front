"use client"; // 이 페이지에서 클라이언트 전용 상태 관리와 훅을 사용함을 명시합니다.

import { useEffect, Suspense, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ScenarioContainer from "./components/ScenarioContainer";
import { TransferFlowProvider, useTransferFlow } from "@/lib/hooks/useTransferFlow";
import { useScenarioEngine } from "@/lib/hooks/useScenarioEngine";
import { useScenarioBackgroundClick } from "@/lib/hooks/useScenarioBackgroundClick";
import ScenarioRenderer from "@/components/scenario/ScenarioRenderer";
import DialogStep from "@/components/scenario/step/DialogStep";
import type { ScenarioStep } from "@/types/scenario";
import { getNextStepId } from "@/utils/stepUtil";

function pickAnswerIndexByGood(choices: any[] | undefined, wantGood: boolean) {
  if (!Array.isArray(choices) || choices.length === 0) return undefined;

  const idx = choices.findIndex((c) => c?.good === wantGood);
  if (idx >= 0) return idx;

  // fallback: success=0, fail=1
  return wantGood ? 0 : (choices.length > 1 ? 1 : 0);
}

function TransferOverlayHost({
  step,
  previousStep,
  onNext,
  onBackgroundClick,
  onRestartFromBeginning,
  onRestartFromWrongPart,
}: {
  step: ScenarioStep | null;
  previousStep: ScenarioStep | null;
  onNext: (nowStepId: number, answer?: number) => Promise<void> | void;
  onBackgroundClick: () => Promise<void> | void;
  onRestartFromBeginning: () => void;
  onRestartFromWrongPart: () => Promise<void> | void;
}) {
  if (!step || step.type === "PRACTICE") return null;

  // DIALOG만 추가 props가 필요해서 예외 처리
  if (step.type === "DIALOG") {
    return (
      <DialogStep
        content={step.content}
        previousStep={previousStep}
        onBackgroundClick={onBackgroundClick}
        onRestartFromBeginning={onRestartFromBeginning}
        onRestartFromWrongPart={onRestartFromWrongPart}
      />
    );
  }

  return (
    <ScenarioRenderer
      step={step}
      previousStep={previousStep}
      onNext={onNext}
      onBackgroundClick={onBackgroundClick}
    />
  );
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
  const engineNextId = currentStep?.type === "PRACTICE" ? getNextStepId(currentStep) : null;

  const handleExitToMain = useCallback(
    (nextStepId: number | null) => {
      if (Number.isNaN(scenarioId)) {
        router.replace("/woorimain");
        return;
      }
      router.replace(`/woorimain?scenarioId=${scenarioId}&stepId=${nextStepId}`);
    },
    [router, scenarioId]
  );

  const restartFromBeginning = useCallback(() => {
    const START_STEP_ID = 1001;
    if (Number.isNaN(scenarioId)) return router.replace("/woorimain");
    router.replace(`/woorimain?scenarioId=${scenarioId}&stepId=${START_STEP_ID}`);
  }, [router, scenarioId]);

  const restartFromWrongPart = useCallback(async () => {
    const target = getNextStepId(currentStep);
    if (!target || Number.isNaN(scenarioId)) return;
    await resume(scenarioId, target);
  }, [currentStep, resume, scenarioId]);

  const handleTransferResult = useCallback(async (result: "success" | "fail") => {
    if (!currentStep || currentStep.type !== "PRACTICE" || currentStep.id == null) return;

    const choices = currentStep.content?.choices as any[] | undefined;
    const answer = pickAnswerIndexByGood(choices, result === "success");

    await nextStep(currentStep.id, answer);
  }, [currentStep, nextStep]);

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
            lastErrorType === "amount"
              ? 0 : (lastErrorType === "account" || lastErrorType === "both")
              ? 1 : 0;

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
      <ScenarioContainer
        engineStepId={engineStepId}
        engineNextId={engineNextId}
        onPracticeNext={async (nowStepId, answer) => {
          await nextStep(nowStepId, answer);
        }}
        onTransferResult={handleTransferResult}
        onExitToMain={handleExitToMain}
      />

      <TransferOverlayHost
        step={currentStep}
        previousStep={previousStep}
        onNext={async (nowStepId, answer) => {
          await nextStep(nowStepId, answer);
        }}
        onBackgroundClick={handleBackgroundClick}
        onRestartFromBeginning={restartFromBeginning}
        onRestartFromWrongPart={restartFromWrongPart}
      />
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