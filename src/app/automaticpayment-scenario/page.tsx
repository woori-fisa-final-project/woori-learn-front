"use client";

import { Suspense, useCallback, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useScenarioEngine } from "@/lib/hooks/useScenarioEngine";
import ScenarioRenderer from "@/components/scenario/ScenarioRenderer";
import ScenarioContainer from "./components/ScenarioContainer";
import { getNextStepId } from "@/utils/stepUtil";

function AutomaticPaymentScenarioContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentStep, previousStep, nextStep, resume } = useScenarioEngine();

  const scenarioId = useMemo(() => {
    const raw = searchParams.get("scenarioId");
    const n = raw ? Number(raw) : NaN;
    return Number.isFinite(n) ? n : 1;
  }, [searchParams]);

  useEffect(() => {
    const scenarioIdParam = searchParams.get("scenarioId");
    const stepIdParam = searchParams.get("stepId");

    const sid = scenarioIdParam ? Number(scenarioIdParam) : NaN;
    const stepId = stepIdParam ? Number(stepIdParam) : undefined;

    if (!Number.isNaN(sid)) {
      void resume(sid, stepId);
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
              router.push(`quiz?scenarioId=${scenarioId}&stepId=${currentStep.id}`);
              return;
            }

            if (currentStep.type === "CHOICE") return;
            if (currentStep.type === "PRACTICE") return;

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
