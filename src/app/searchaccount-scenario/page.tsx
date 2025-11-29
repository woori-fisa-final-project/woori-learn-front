"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { TransferFlowProvider } from "@/lib/hooks/useTransferFlow";
import { useScenarioEngine } from "@/lib/hooks/useScenarioEngine";
import ScenarioRenderer from "@/components/scenario/ScenarioRenderer";
import ScenarioContainer from "./components/ScenarioContainer";

function SearchAccountScenarioContent() {
  const searchParams = useSearchParams();
  const scenarioId = Number(searchParams.get("scenarioId") ?? "1");
  const stepIdParam = searchParams.get("stepId");
  const startStepId = stepIdParam ? Number(stepIdParam) : undefined;

  const { currentStep, previousStep, isLoading, error, resume, nextStep, quizState, submitQuizAnswer } = useScenarioEngine();
  const router = useRouter();

  // 퀴즈가 필요하면 퀴즈 페이지로 이동
  useEffect(() => {
    if (quizState && currentStep) {
      router.push(`/quiz?scenarioId=${scenarioId}&stepId=${currentStep.id}`);
    }
  }, [quizState, currentStep, scenarioId, router]);

  // resume는 "처음 1번"만 (URL의 step 바뀐다고 매번 resume하면 끊김)
  const resumedKeyRef = useRef<string | null>(null);
  useEffect(() => {
    const key = `${scenarioId}:${startStepId ?? "resume"}`;
    if (resumedKeyRef.current === key) return;
    resumedKeyRef.current = key;

    void resume(scenarioId, startStepId);
  }, [resume, scenarioId, startStepId]);

  const isPractice = currentStep?.type === "PRACTICE";

  // engineNextId는 step 객체에 next 필드가 있다면 여기서 전달 가능
  const engineNextId = useMemo(() => {
    return (currentStep as any)?.next ?? null;
  }, [currentStep]);

  return (
    <TransferFlowProvider>
      <div className="relative mx-auto h-[100dvh] w-full max-w-[430px] bg-white">
        {/* UI (PRACTICE는 여기서 진행) */}
        <ScenarioContainer
          onPracticeNext={async (nowStepId, answer) => {
            await nextStep(nowStepId, answer);
          }}
          engineStepId={isPractice ? currentStep?.id ?? null : null}
        />

        {/* 오버레이/다이얼로그/모달/선택지 */}
        {!isPractice && (
          <div className="absolute inset-0 z-50">
            <ScenarioRenderer
              step={currentStep}
              previousStep={previousStep}
              onNext={(nowStepId: number, answer?: number) =>
                void nextStep(nowStepId, answer)
              }
              onBackgroundClick={() => {
                if (!currentStep) return;
                if (quizState) return;
                void nextStep(currentStep.id);
              }}
            />
          </div>
        )}

        {/* 로딩/에러 (선택) */}
        {isLoading && (
          <div className="absolute inset-0 z-[60] flex items-center justify-center bg-white/60">
            로딩 중...
          </div>
        )}
        {error && (
          <div className="absolute inset-0 z-[60] flex items-center justify-center bg-white/80">
            <p className="text-red-500">{error}</p>
          </div>
        )}
      </div>
    </TransferFlowProvider>
  );
}

export default function SearchAccountScenarioPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <p className="text-gray-500">로딩 중...</p>
        </div>
      }
    >
      <SearchAccountScenarioContent />
    </Suspense>
  );
}
