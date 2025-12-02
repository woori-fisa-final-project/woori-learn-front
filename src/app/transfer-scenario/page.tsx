"use client"; // 이 페이지에서 클라이언트 전용 상태 관리와 훅을 사용함을 명시합니다.

import { useEffect, Suspense, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ScenarioContainer from "./components/ScenarioContainer";
import { useTransferFlow } from "@/lib/hooks/useTransferFlow";
import { useScenarioEngine } from "@/lib/hooks/useScenarioEngine";
import { useScenarioBackgroundClick } from "@/lib/hooks/useScenarioBackgroundClick";
import ScenarioRenderer from "@/components/scenario/ScenarioRenderer";
import DialogStep from "@/components/scenario/step/DialogStep";
import type { ScenarioStep } from "@/types/scenario";
import { getNextStepId } from "@/utils/stepUtil";

/**
 * choices 배열에서 "good" 분기에 해당하는 선택지 인덱스를 찾아서 반환
 * - wantGood=true -> good==true인 선택지 index
 * - wantGood=false -> good==false인 선택지 index 
 */
function pickAnswerIndexByGood(choices: any[] | undefined, wantGood: boolean) {
  if (!Array.isArray(choices) || choices.length === 0) return undefined;
  const idx = choices.findIndex((c) => c?.good === wantGood);
  if (idx >= 0) return idx;
  return wantGood ? 0 : (choices.length > 1 ? 1 : 0);
}

/**
 * 페이지 위에 오버레이를 띄워주는 호스트 컴포넌트
 * - PRACTICE 단계에서는 오버레이 띄우지 않기
 * - DIALOG는 DialogStep을 직접 렌더링
 * - 그 외는 공용 ScenarioRenderer로 렌더링
 */
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
  // step이 없거나 PRACTICE면 오버레이를 렌더링하지 않음
  if (!step || step.type === "PRACTICE") return null;

  /**
   * DIALOG는 별도 컴포넌트로 렌더링하여
   * - 이전 대사 연결
   * - 배경 클릭 진행
   * 등을 지원
   */
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

  // 그 외는 공용 렌더러로 처리
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

  /**
   * 시나리오 엔진 훅
   * - currentStep: 현재 엔진 단계(OVERLAY/CHOICE/DIALOG/PRACTICE 등)
   * - previousStep: 이전 단계(대사/연출 연결용)
   * - nextStep: nowStepId 기준으로 다음 단계로 진행 요청(API)
   * - resume: scenarioId/stepId로 특정 단계부터 재개
   */
  const { currentStep, previousStep, nextStep, resume } = useScenarioEngine();

  /**
   * 이체 실습에서 틀린 부분을 가져옴
   * - bad branch에서 어디가 틀렸는지에 따라 선택지 답안을 자동으로 고르기 위해 사용
   */
  const { lastErrorType } = useTransferFlow();

  /** URL에서 scenarioId를 읽어 숫자로 변환 */
  const scenarioId = useMemo(() => {
    const v = searchParams.get("scenarioId");
    return v ? Number(v) : NaN;
  }, [searchParams]);

  /**
   * URL 쿼리로 전달받은 scenarioId/stepId 기반으로 시나리오 재개
   * - stepId가 없으면 resume 내부에서 서버에 저장된 nowStepId로 재개
   */
  useEffect(() => {
    const stepIdParam = searchParams.get("stepId");
    const stepId = stepIdParam ? Number(stepIdParam) : undefined;

    if (!Number.isNaN(scenarioId)) {
      void resume(scenarioId, stepId);
    }
  }, [resume, scenarioId, searchParams]);

  /**
   * 실습(ScenarioContainer)에서 참고할 엔진 상태
   * - 엔진이 PRACTICE일 때만 stepId/nextId를 내려줌
   * - 실습 UI는 PRACTICE stepId 값을 보고 어느 화면을 보여줄지 동기화
   */
  const engineStepId = currentStep?.type === "PRACTICE" ? currentStep.id : null;
  const engineNextId = currentStep?.type === "PRACTICE" ? getNextStepId(currentStep) : null;

  /**
   * 실습 완료 후 메인으로 나갈 때의 라우팅 정책
   * - scenarioId가 없으면 그냥 /woorimain
   * - scenarioId가 있으면 이어하기가 가능하도록 scenarioId/stepId를 쿼리에 포함
   */
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

  /** (bad branch에서) 처음부터 다시하기 동작 */
  const restartFromBeginning = useCallback(() => {
    const START_STEP_ID = 1001;
    if (Number.isNaN(scenarioId)) return router.replace("/woorimain");
    router.replace(`/woorimain?scenarioId=${scenarioId}&stepId=${START_STEP_ID}`);
  }, [router, scenarioId]);

  /**
   * 틀린 부분부터 다시하기 동작
   * - currentStep에서 nextStepId를 계산한 뒤
   * - resume(scenarioId, target)으로 해당 단계부터 재개
   */
  const restartFromWrongPart = useCallback(async () => {
    const target = getNextStepId(currentStep);
    if (!target || Number.isNaN(scenarioId)) return;
    await resume(scenarioId, target);
  }, [currentStep, resume, scenarioId]);

  /**
   * 실습 결과에 따라 오버레이 선택지를 자동으로 선택해서 다음으로 진행
   * - PRACTICE step.content.choices 중 good 여부를 보고 answer(index) 선택
   */
  const handleTransferResult = useCallback(async (result: "success" | "fail") => {
    if (!currentStep || currentStep.type !== "PRACTICE" || currentStep.id == null) return;

    const choices = currentStep.content?.choices as any[] | undefined;
    const answer = pickAnswerIndexByGood(choices, result === "success");

    await nextStep(currentStep.id, answer);
  }, [currentStep, nextStep]);

  /** 배경 클릭 시 다음 스텝 진행 로직 */
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
          /**
           * amount가 틀렸으면 0번
           * account/both가 틀렸으면 1번
           */
          const answer =
            lastErrorType === "amount"
              ? 0 : (lastErrorType === "account" || lastErrorType === "both")
              ? 1 : 0;

          await nextStep(nowStepId, answer);
          return;
        }
      }

      // 일반적인 경우: 단순 nextStep
      await nextStep(nowStepId);
    },
    [currentStep, lastErrorType, nextStep]
  );

  const handleBackgroundClick = useScenarioBackgroundClick(nextStepByBackground, currentStep);

  return (
    <>
      {/* 실습 UI(기본 화면)
          - 엔진의 PRACTICE stepId에 맞춰 내부 화면 (step 1~7) 출력
          - 실습 화면에서 어떤 버튼 클릭 시 엔진 징행이 필요하면 onPracticeNext 호출 */}
      <ScenarioContainer
        engineStepId={engineStepId}
        engineNextId={engineNextId}
        onPracticeNext={async (nowStepId, answer) => {
          await nextStep(nowStepId, answer);
        }}
        onTransferResult={handleTransferResult}
        onExitToMain={handleExitToMain}
      />

      {/* 오버레이 UI
          - PRACTICE일 때는 숨기고, 그 외 step에서는 화면 위에 겹치기 */}
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
    <Suspense fallback={<div>로딩 중...</div>}>
      <TransferScenarioContent />
    </Suspense>
  );
}