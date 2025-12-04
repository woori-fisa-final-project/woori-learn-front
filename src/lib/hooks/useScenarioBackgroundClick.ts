import { useCallback } from "react";
import type { ScenarioStep } from "@/types/scenario";

/**
 * 시나리오 배경 클릭 시 다음 스텝으로 이동하는 로직을 처리하는 커스텀 훅
 * 
 * @param nextStep - 다음 스텝으로 이동하는 함수
 * @param currentStep - 현재 스텝 정보
 * @returns 배경 클릭 핸들러 함수
 */
export function useScenarioBackgroundClick(
  nextStep: (nowStepId: number) => Promise<void>,
  currentStep: ScenarioStep | null
) {
  const handleBackgroundClick = useCallback(async () => {
    // CHOICE 단계에서는 ChoiceStep 내부에서 onChoiceNext를 통해 이동하므로
    // 여기서는 일반 nextStep을 호출하지 않습니다.
    if (currentStep?.type === "CHOICE") return;
    // PRACTICE 단계에서는 content.button을 통해 next-step을 요청하므로
    // 여기서는 일반 nextStep을 호출하지 않습니다.
    if (currentStep?.type === "PRACTICE") return;
    if (currentStep?.id != null) {
      await nextStep(currentStep.id);
    }
  }, [nextStep, currentStep]);

  return handleBackgroundClick;
}





