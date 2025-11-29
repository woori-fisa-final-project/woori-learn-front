"use client";

import { Suspense, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useScenarioEngine } from "@/lib/hooks/useScenarioEngine";
import ScenarioRenderer from "@/components/scenario/ScenarioRenderer";
import ScenarioContainer from "./components/ScenarioContainer";

function AutomaticPaymentScenarioContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentStep, previousStep, nextStep, resume } = useScenarioEngine();

  useEffect(() => {
    const scenarioIdParam = searchParams.get("scenarioId");
    const stepIdParam = searchParams.get("stepId");

    const scenarioId = scenarioIdParam ? Number(scenarioIdParam) : NaN;
    const stepId = stepIdParam ? Number(stepIdParam) : undefined;

    if (!Number.isNaN(scenarioId)) {
      void resume(scenarioId, stepId);
    }
  }, [resume, searchParams]);

  const onPracticeNext = useCallback(
    async (nowStepId: number, answer?: number): Promise<void> => {
      await nextStep(nowStepId, answer);
    },
    [nextStep]
  );

  return (
    <>
      {/* 실제 화면(UI 흐름)은 컨테이너가 담당 */}
      <ScenarioContainer
        engineStep={currentStep}
        onPracticeNext={onPracticeNext}
      />

      {/* 시나리오 오버레이는 page에서 “항상 최상단”으로 */}
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
              router.push(`quiz?scenarioId=1&stepId=1119`);
              return;
            }
            if (currentStep.type === "CHOICE") return;
            if (currentStep.type === "PRACTICE") return;
            if (currentStep?.id != null)
              await nextStep(currentStep.id);
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
