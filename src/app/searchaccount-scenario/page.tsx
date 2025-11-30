"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { TransferFlowProvider } from "@/lib/hooks/useTransferFlow";
import { useScenarioEngine } from "@/lib/hooks/useScenarioEngine";
import ScenarioRenderer from "@/components/scenario/ScenarioRenderer";
import ScenarioContainer from "./components/ScenarioContainer";
import { ScenarioStep } from "@/types";
import DialogStep from "@/components/scenario/step/DialogStep";
import { useScenarioBackgroundClick } from "@/lib/hooks/useScenarioBackgroundClick";

const SCENARIO_ID = 1;

const LOCAL_PRACTICE_IDS = new Set<number>([1034, 1036, 1039, 1040, 1043, 1047]);

function toFiniteNumber(v: string | null): number | null {
  if (v == null) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function SearchAccountOverlayHost({
  step,
  previousStep,
  onNext,
  onBackgroundClick,
}: {
  step: ScenarioStep | null;
  previousStep: ScenarioStep | null;
  onNext: (nowStepId: number, answer?: number) => Promise<void> | void;
  onBackgroundClick: () => Promise<void> | void;
}) {
  if (!step || step.type === "PRACTICE") return null;

  // DIALOG는 extra props 필요할 수 있어서 분기
  if (step.type === "DIALOG") {
    return (
      <DialogStep
        content={step.content}
        previousStep={previousStep}
        onBackgroundClick={onBackgroundClick}
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

function SearchAccountScenarioContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const scenarioId = useMemo(() => {
    const n = toFiniteNumber(searchParams.get("scenarioId"));
    return n ?? SCENARIO_ID;
  }, [searchParams]);

  useEffect(() => {
    const raw = searchParams.get("scenarioId");
    const parsed = toFiniteNumber(raw);
    if (parsed != null) return;

    const sp = new URLSearchParams(searchParams.toString());
    sp.set("scenarioId", String(SCENARIO_ID));

    // URL을 교정해서 이후 로직(quiz 이동, resume 등)이 NaN에 안 걸리게 한다
    router.replace(`/searchaccount-scenario?${sp.toString()}`);
  }, [router, searchParams]);

  // 엔진 시작 stepId(woorimain에서 넘겨주는 값)
  const startStepId = useMemo(() => {
    const n = toFiniteNumber(searchParams.get("stepId"));
    return n ?? undefined;
  }, [searchParams]);

  const { currentStep, previousStep, isLoading, error, resume, nextStep, quizState } = useScenarioEngine();

  const advance = useCallback(
    async (nowStepId: number, answer?: number) => {
      await nextStep(nowStepId, answer);
    },
    [nextStep]
  );

  // 2) resume는 “처음 1번만”
  const resumedKeyRef = useRef<string | null>(null);
  useEffect(() => {
    const key = `${scenarioId}:${startStepId ?? "resume"}`;
    if (resumedKeyRef.current === key) return;
    resumedKeyRef.current = key;

    void resume(scenarioId, startStepId);
  }, [resume, scenarioId, startStepId]);

  // 퀴즈가 필요하면 퀴즈 페이지로 이동
  useEffect(() => {
    if (quizState && currentStep) {
      router.push(`/quiz?scenarioId=${scenarioId}&stepId=${currentStep.id}`);
    }
  }, [quizState, currentStep, scenarioId, router]);

  useEffect(() => {
    if (!currentStep) return;
    if (currentStep.type !== "PRACTICE") return;

    if (!LOCAL_PRACTICE_IDS.has(currentStep.id)) {
      router.replace(`/woorimain?scenarioId=${scenarioId}&stepId=${currentStep.id}`);
    }
  }, [currentStep, scenarioId, router]);

  const isPractice = currentStep?.type === "PRACTICE";
  const engineStepId = isPractice ? currentStep?.id ?? null : null;

  const handleExitToMain = useCallback(
    () => {
      router.replace("/woorimain");
    },
    [router]
  );

  // 배경 클릭으로 nextStep 호출 보호(CHOICE/QUIZ 등)
  const nextStepByBackground = useCallback(
    async (nowStepId: number) => {
      if (!currentStep) return;
      if (quizState) return;
      if (currentStep.type === "CHOICE") return;
      await advance(nowStepId);
    },
    [advance, currentStep, quizState]
  );

  const handleBackgroundClick = useScenarioBackgroundClick(nextStepByBackground, currentStep);


  return (
    <TransferFlowProvider>
      <div className="relative mx-auto h-[100dvh] w-full max-w-[430px] bg-white">
        {/* UI (PRACTICE는 여기서 진행) */}
        <ScenarioContainer
          engineStepId={engineStepId}
          onPracticeNext={advance}
          onExitToMain={handleExitToMain}
        />

        <SearchAccountOverlayHost
          step={currentStep}
          previousStep={previousStep}
          onNext={advance}
          onBackgroundClick={handleBackgroundClick}
        />

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
