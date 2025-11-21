"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import ScenarioLayout from "@/components/scenario/ScenarioLayout";
import ScenarioRenderer from "@/components/scenario/ScenarioRenderer";
import { useScenarioEngine } from "@/lib/hooks/useScenarioEngine";

/**
 * [단일 시나리오 진행 페이지 안내]
 *
 * 이 파일은 "특정 시나리오 ID에 대한 실제 진행 화면"입니다.
 * URL 예시: / (education)/scenario/1000  → 시나리오 ID: 1000
 *
 * ──────────────────────────────────────────────────────────────
 * ▸ 이 페이지의 책임(최소 책임 원칙)
 *   1) URL에서 scenarioId 읽기
 *      - useParams()로 [scenarioId] 파라미터를 읽어서 숫자로 변환합니다.
 *
 *   2) 시나리오 엔진 훅 호출
 *      - useScenarioEngine() 사용
 *        → currentStep, isLoading, error, nextStep, resume 를 제공합니다.
 *
 *   3) 초기 진입 시 resume(scenarioId) 호출
 *      - useEffect 안에서 scenarioId가 유효할 때만 resume(scenarioId)를 호출합니다.
 *      - 실제 데이터 로딩(mocks/API 전환 포함)은 모두 useScenarioEngine 내부에서 처리합니다.
 *
 *   4) 화면 클릭 시 nextStep() 호출
 *      - 전체 화면 div에 onClick 핸들러로 nextStep을 연결합니다.
 *      - 사용자가 어디를 클릭하든 다음 Step으로 이동하는 "탭 진행" UX를 유지합니다.
 *
 *   5) ScenarioRenderer에 step 전달
 *      - <ScenarioRenderer step={currentStep} onChoiceNext={...} /> 형태로 현재 Step만 넘깁니다.
 *      - 어떤 UI를 어떻게 그릴지는 모두 ScenarioRenderer와 각 Step 컴포넌트가 담당합니다.
 *
 * ※ 이 페이지에는 새로운 비즈니스 로직을 절대 넣지 않습니다.
 *    - 네트워크 요청, mock 전환, Step 타입 파싱 등은 모두 lib/hooks, lib/types, lib/mocks에서 처리합니다.
 *    - 여기서는 "시나리오 엔진을 호출해서 화면에 보여주는 역할"만 수행합니다.
 *
 * ──────────────────────────────────────────────────────────────
 * ▸ 시나리오 전체 구조를 보고 싶을 때 참조할 파일
 *   - 타입 정의:        src/lib/types/scenario.ts
 *   - mock 데이터:      src/lib/mocks/scenarioMock.ts
 *   - 시나리오 엔진:    src/lib/hooks/useScenarioEngine.ts
 *   - 시작 트리거 훅:   src/lib/hooks/useScenarioTrigger.ts
 *   - 시나리오 렌더러:  src/components/scenario/ScenarioRenderer.tsx
 *   - Step 컴포넌트들:  src/components/scenario/step/*
 *   - Weebee 컴포넌트:  src/components/scenario/character/Weebee.tsx
 */
export default function ScenarioDetailPage() {
  const params = useParams();
  const scenarioId = Number(params?.scenarioId);
  const router = useRouter();

  const { currentStep, previousStep, isLoading, error, nextStep, goToStep, resume } =
    useScenarioEngine();
  const isGradientBackground =
    currentStep?.type === "DIALOG" ||
    currentStep?.type === "IMAGE" ||
    currentStep?.type === "CHOICE";

  // ScenarioPage 책임 최소화 규칙:
  // - scenarioId 읽기
  // - resume() 호출
  // - nextStep() 호출
  // - ScenarioRenderer에 step 전달
  // - 화면 클릭 시 nextStep 실행
  useEffect(() => {
    if (!Number.isNaN(scenarioId)) {
      void resume(scenarioId);
    }
  }, [resume, scenarioId]);

  

  const handleScreenClick = async () => {
    // CHOICE 단계에서는 ChoiceStep 내부에서 onChoiceNext를 통해 이동하므로
    // 여기서는 일반 nextStep을 호출하지 않습니다.
    if (currentStep?.type === "CHOICE") return;
    // PRACTICE 단계에서는 content.button을 통해 next-step을 요청하므로
    // 여기서는 일반 nextStep을 호출하지 않습니다.
    if (currentStep?.type === "PRACTICE") return;
    if (currentStep?.id != null) {
      await nextStep(currentStep.id);
    }
  };

  const handleChoiceNext = (nextStepId: number) => {
    // Choice에서 선택된 nextStepId로 즉시 이동합니다.
    goToStep(nextStepId);
  };

  return (
    <ScenarioLayout>
      <div
        className="relative max-w-[390px] w-full mx-auto flex flex-col min-h-[84dvh] px-[20px] pt-[30px]"
        onClick={handleScreenClick}
      >
        {isGradientBackground && (
          <div className="pointer-events-none absolute inset-x-0 top-0 -bottom-[60px] z-0 bg-gradient-to-b from-[#ffffff] to-[#549AE4]" />
        )}
        {isLoading && (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-sm text-gray-400">시나리오를 불러오는 중입니다...</p>
          </div>
        )}

        {!isLoading && error && (
          <div className="flex flex-1 items-center justify-center">
            {/* mock 시나리오가 없는 경우 등 에러 상황에서는 텍스트 대신 로딩 이미지를 노출합니다. */}
            <div className="flex flex-col items-center gap-3">
              <div className="relative h-[120px] w-[120px]">
                <Image
                  src="/images/loading2.gif"
                  alt="시나리오 로딩 이미지"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        )}

        {!isLoading && !error && (
          <div className="flex flex-1">
            {/* PRACTICE 타입이 아닐 때만 ScenarioRenderer 사용 (오버레이 표시) */}
            {currentStep && currentStep.type !== "PRACTICE" && (
              <ScenarioRenderer
                step={currentStep}
                previousStep={previousStep}
                onChoiceNext={handleChoiceNext}
                onBackgroundClick={handleScreenClick}
              />
            )}
            {/* PRACTICE 타입일 때는 오버레이를 렌더링하지 않고 기존 실습 화면을 그대로 표시 */}
            {/* 기존 실습 화면은 children으로 전달되거나 별도로 렌더링됩니다 */}
          </div>
        )}
      </div>
    </ScenarioLayout>
  );
}


