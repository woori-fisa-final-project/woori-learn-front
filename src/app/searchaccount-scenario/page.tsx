"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "next/navigation";

import { TransferFlowProvider } from "@/lib/hooks/useTransferFlow";
import { useScenarioEngine } from "@/lib/hooks/useScenarioEngine";
import ScenarioRenderer from "@/components/scenario/ScenarioRenderer";
import ScenarioContainer from "./components/ScenarioContainer";
import QuizScreen, { type QuizContent } from "@/components/quiz/QuizScreen";

function SearchAccountScenarioContent() {
  const searchParams = useSearchParams();
  const scenarioId = Number(searchParams.get("scenarioId") ?? "1");
  const stepIdParam = searchParams.get("stepId");
  const startStepId = stepIdParam ? Number(stepIdParam) : undefined;

  const { currentStep, previousStep, isLoading, error, resume, nextStep, quizState, submitQuizAnswer } = useScenarioEngine();

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

  const uiQuiz: QuizContent | null = useMemo(() => {
    if (!quizState) return null;
    return {
      id: String(quizState.quiz.id),
      title: "퀴즈",
      prompt: quizState.quiz.question,
      options: quizState.quiz.options.map((text: string, idx: number) => ({
        id: String(idx), // optionIndex
        text,
      })),
    };
  }, [quizState]);

  return (
    <TransferFlowProvider>
      <div className="relative mx-auto h-[100dvh] w-full max-w-[430px] bg-white">
        {/* UI (PRACTICE는 여기서 진행) */}
        <ScenarioContainer
          onPracticeNext={nextStep}
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

        {/* 퀴즈 오버레이 */}
        {uiQuiz && (
          <div
            className="absolute inset-0 z-[70] bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="h-full px-[20px] py-[24px]"
              onClick={(e) => e.stopPropagation()}>
              <QuizScreen
                quiz={uiQuiz}
                onSelectOption={(_, optionId) => {
                  const idx = Number(optionId);
                  if (!Number.isFinite(idx)) return;
                  void submitQuizAnswer(idx); // ✅ 여기서 answer 붙여 next-step 재호출
                }}
              />
            </div>
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
