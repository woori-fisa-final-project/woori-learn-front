"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useScenarioEngine } from "@/lib/hooks/useScenarioEngine";
import ScenarioRenderer from "@/components/scenario/ScenarioRenderer";
import ScenarioContainer from "./components/ScenarioContainer";
import { ScenarioStep } from "@/types";
import DialogStep from "@/components/scenario/step/DialogStep";
import { useScenarioBackgroundClick } from "@/lib/hooks/useScenarioBackgroundClick";

const SCENARIO_ID = 1;

/** 해당 목록에 없는 PRACTICE step을 만나면, woorimain으로 이동시켜 메인에서 이어서 처리하도록 위임 */
const LOCAL_PRACTICE_IDS = new Set<number>([1034, 1036, 1039, 1040, 1043, 1047]);

/** 문자열을 number로 파싱 */
function toFiniteNumber(v: string | null): number | null {
  if (v == null) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

/**
 * 오버레이 표시용 호스트 컴포넌트
 * - PRACTICE 타입은 로컬 UI 컴포넌트(ScenarioContainer)에서만 처리하므로 여기서는 렌더링하지 않음
 * - DIALOG는 DialogStep으로 따로 렌더링
 * - 그 외 타입은 ScenarioRenderer가 공통으로 렌더링
 */
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

/** 실제 시나리오 진행 로직을 담당하는 컴포넌트 */
function SearchAccountScenarioContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  /**
   * scenarioId 결정
   * - 쿼리에 scenarioId가 있으면 그 값을 사용
   */
  const scenarioId = useMemo(() => {
    const n = toFiniteNumber(searchParams.get("scenarioId"));
    return n ?? SCENARIO_ID;
  }, [searchParams]);

  /** scenarioId 쿼리 정규화 */
  useEffect(() => {
    const raw = searchParams.get("scenarioId");
    const parsed = toFiniteNumber(raw);
    if (parsed != null) return;

    const sp = new URLSearchParams(searchParams.toString());
    sp.set("scenarioId", String(SCENARIO_ID));

    router.replace(`/searchaccount-scenario?${sp.toString()}`);
  }, [router, searchParams]);

  /**
   * 시작 stepId
   * - 쿼리에 stepId가 있으면 그 step부터 resume
   * - 없으면 서버의 resume 결과(nowStepId)를 사용
   */
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

  const resumedKeyRef = useRef<string | null>(null);

  /**
   * scenarioId / startStepId가 정해지면 resume 실행
   * - startStepId가 없으면 resume API 기반 nowStepId로 시작
   */
  useEffect(() => {
    const key = `${scenarioId}:${startStepId ?? "resume"}`;
    if (resumedKeyRef.current === key) return;
    resumedKeyRef.current = key;

    void resume(scenarioId, startStepId);
  }, [resume, scenarioId, startStepId]);

  /**
   * 퀴즈가 있다면 퀴즈 페이지로 이동
   * - quizState + currentStep 존재할 때 stepId를 함께 전달
   */
  useEffect(() => {
    if (quizState && currentStep) {
      router.push(`/quiz?scenarioId=${scenarioId}&stepId=${currentStep.id}`);
    }
  }, [quizState, currentStep, scenarioId, router]);

  /**
   * PRACTICE step을 만났을 때, 이 라우트에서 처리할지/메인으로 위임할지 판단
   * - LOCAL_PRACTICE_IDS에 없으면 메인으로 보내서 이어서 진행하도록 함
   */
  useEffect(() => {
    if (!currentStep) return;
    if (currentStep.type !== "PRACTICE") return;

    if (!LOCAL_PRACTICE_IDS.has(currentStep.id)) {
      router.replace(`/woorimain?scenarioId=${scenarioId}&stepId=${currentStep.id}`);
    }
  }, [currentStep, scenarioId, router]);

  const isPractice = currentStep?.type === "PRACTICE";
  const engineStepId = isPractice ? currentStep?.id ?? null : null;

  const handleExitToMain = useCallback(() => {
    router.replace("/woorimain");
  }, [router]);

  /**
   * 배경 클릭으로 nextStep 진행하는 규칙
   * - 퀴즈 상태일 때는 진행 금지
   * - CHOICE는 Choice UI에서 선택으로 진행해야 하므로 배경 탭 진행 금지
   * - 나머지는 advance
   */
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