"use client";

import { Suspense, useCallback, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useScenarioEngine } from "@/lib/hooks/useScenarioEngine";
import ScenarioRenderer from "@/components/scenario/ScenarioRenderer";
import ScenarioContainer from "./components/ScenarioContainer";
import { getNextStepId } from "@/utils/stepUtil";

/**
 * 자동이체 시나리오 페이지의 컨텐츠 컴포넌트
 * - URL 쿼리로 scenarioId/stepId를 받아 시나리오를 재개
 * - PRACTICE 스텝은 ScenarioContainer에서 진행
 * - 그 외 스텝은 ScenarioRenderer 활용
 */
function AutomaticPaymentScenarioContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentStep, previousStep, nextStep, resume } = useScenarioEngine();

  const scenarioIdParam = searchParams.get("scenarioId");
  const stepIdParam = searchParams.get("stepId");

  const scenarioId = useMemo(() => {
    const n = scenarioIdParam ? Number(scenarioIdParam) : NaN;
    return Number.isFinite(n) ? n : 1;
  }, [scenarioIdParam]);

  /**
   * scenarioId/stepId 쿼리가 바뀌면 해당 위치에서 시나리오를 재개
   * - stepId가 없으면 서버가 저장한 progress 기반으로 재개하는 흐름
   */
  useEffect(() => {
    const scenarioId = scenarioIdParam ? Number(scenarioIdParam) : NaN;
    const stepId = stepIdParam ? Number(stepIdParam) : undefined;

    if (!Number.isNaN(scenarioId)) {
      void resume(scenarioId, stepId);
    }
  }, [resume, scenarioIdParam, stepIdParam]);

  /**
   * PRACTICE 단계에서 다음 처리가 필요할 때 호출되는 함수
   * - 호출 시점의 nowStepId(+ 선택지 answer)를 엔진에 전달하여 nextStep을 진행
   */
  const onPracticeNext = useCallback(
    async (nowStepId: number, answer?: number): Promise<void> => {
      await nextStep(nowStepId, answer);
    },
    [nextStep]
  );

  return (
    <>
      <ScenarioContainer engineStep={currentStep} onPracticeNext={onPracticeNext} />

      {currentStep && currentStep.type !== "PRACTICE" && (
        <ScenarioRenderer
          step={currentStep}
          previousStep={previousStep}
          onNext={async (nowStepId, answer) => {
            await nextStep(nowStepId, answer);
          }}
          onBackgroundClick={async () => {
            const quizId = (currentStep as any)?.quizId;

            if (typeof quizId === "number") {
              router.push(`/quiz?scenarioId=${scenarioId}&stepId=${currentStep.id}`);
              return;
            }

            if (currentStep.type === "CHOICE") return;

            if (currentStep?.id != null) await nextStep(currentStep.id);
          }}
          onRestartFromBeginning={async () => {
            if (Number.isNaN(scenarioId)) {
              router.replace("/woorimain");
              return;
            }
            router.replace(`/woorimain?scenarioId=${scenarioId}&stepId=1001`);
          }}
          onRestartFromWrongPart={async () => {
            if (!currentStep) return;
            const target = getNextStepId(currentStep);
            if (!target || Number.isNaN(scenarioId)) return;
            await resume(scenarioId, target);
          }}
        />
      )}
    </>
  );
}

export default function AutomaticPaymentScenarioPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <p className="text-gray-500">로딩 중...</p>

        </div>
      }
    >
      <AutomaticPaymentScenarioContent />
    </Suspense>
  );
}