import { useCallback, useMemo, useState } from "react";
import { fetchScenarioFromApi } from "@/lib/api/scenario";
import { scenarioMockMap } from "@/lib/mocks/scenarioMock";
import { mockNextStep } from "@/lib/mocks/mockNextStep";
import type { ScenarioData, ScenarioStep, NextStepResponse } from "@/types/scenario";

/**
 * [시나리오 엔진 훅 안내]
 *
 * 이 훅은 "시나리오 한 편의 진행 상태"를 전담 관리합니다.
 * - 어디에서 데이터를 받아오는지(mock / API)
 * - 현재 몇 번째 step을 보여줘야 하는지
 * - 다음 step으로 어떻게 넘어가는지
 * 등의 로직을 모두 이 안에 숨기고, 화면 쪽에는 최소한의 API만 제공합니다.
 *
 * 외부에서 사용하는 메서드:
 *   - currentStep: 현재 화면에 보여줄 ScenarioStep (없으면 null)
 *   - isLoading: 시나리오 로딩 중 여부
 *   - error: 로딩/파싱 중 에러 메시지
 *   - start(scenarioId): 처음부터 시나리오를 시작할 때 사용
 *   - resume(scenarioId, stepId?): 특정 시점(stepId)부터 이어서 진행할 때 사용
 *   - nextStep(): 현재 step의 nextStep 필드를 따라 다음 step으로 이동
 *
 * mock ↔ API 전환:
 *   - 아래 USE_MOCK 플래그를 이 훅 내부에서만 사용합니다.
 *   - 전역 코드에서는 mock 데이터 파일을 직접 import하지 않습니다.
 */

// mock ↔ API 전환은 이 훅 내부에서만 처리합니다.
const USE_MOCK = true;

interface UseScenarioEngineResult {
  currentStep: ScenarioStep | null;
  previousStep: ScenarioStep | null;
  isLoading: boolean;
  error: string | null;
  start: (scenarioId: number) => Promise<void>;
  nextStep: (nowStepId: number) => Promise<void>;
  goToStep: (stepId: number) => void;
  resume: (scenarioId: number, stepId?: number) => Promise<void>;
}

export function useScenarioEngine(): UseScenarioEngineResult {
  const [scenario, setScenario] = useState<ScenarioData | null>(null);
  const [currentStepId, setCurrentStepId] = useState<number | null>(null);
   const [previousStepId, setPreviousStepId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadScenario = useCallback(async (scenarioId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      let data: ScenarioData;

      if (USE_MOCK) {
        const mock = scenarioMockMap[scenarioId as keyof typeof scenarioMockMap];
        if (!mock) {
          throw new Error("해당 ID의 mock 시나리오가 존재하지 않습니다.");
        }
        data = mock as ScenarioData;
      } else {
        const res = await fetchScenarioFromApi(scenarioId);
        // 백엔드에서 steps 배열로 온다고 가정하고 ScenarioData 형태로 변환
        const stepsMap: Record<number, ScenarioStep> = {};
        res.steps.forEach((step) => {
          stepsMap[step.id] = step;
        });
        data = {
          meta: res.scenario,
          steps: stepsMap,
        };
      }

      setScenario(data);
      // 첫 스텝은 가장 작은 id 를 기본으로 사용 (규칙: 1001 → 1002 → 1003 등)
      const firstStepId = Math.min(...Object.keys(data.steps).map((id) => Number(id)));
      setCurrentStepId(firstStepId);
      setPreviousStepId(null);
    } catch (e) {
      const message = e instanceof Error ? e.message : "알 수 없는 오류가 발생했습니다.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const start = useCallback(
    async (scenarioId: number) => {
      await loadScenario(scenarioId);
    },
    [loadScenario],
  );

  const resume = useCallback(
    async (scenarioId: number, stepId?: number) => {
      await loadScenario(scenarioId);
      if (stepId != null) {
        setCurrentStepId(stepId);
      }
    },
    [loadScenario],
  );

  // step 응답을 받아서 상태를 업데이트하는 유틸 함수
  const applyStep = useCallback((step: NextStepResponse["data"]["step"]) => {
    if (!scenario) return;
    
    // previousStepId 업데이트
    if (currentStepId != null) {
      setPreviousStepId(currentStepId);
    }
    
    // currentStepId를 응답의 nowStepId로 설정
    setCurrentStepId(step.nowStepId);
  }, [scenario, currentStepId]);

  // nextStep(nowStepId)는 백엔드 next-step API를 호출합니다.
  // USE_MOCK === true → mockNextStep 사용
  // USE_MOCK === false → 실제 API 호출
  const nextStep = useCallback(async (nowStepId: number) => {
    if (!scenario) return;
    
    try {
      let response: NextStepResponse;
      
      if (USE_MOCK) {
        response = mockNextStep(nowStepId);
      } else {
        // 실제 백엔드 API 호출
        // TODO: POST /users/me/scenarios/{scenarioId}/next-step 구현 필요
        const res = await fetch(`/api/users/me/scenarios/${scenario.meta.id}/next-step`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ nowStepId }),
        });
        
        if (!res.ok) {
          throw new Error("next-step API 호출에 실패했습니다.");
        }
        
        response = await res.json();
      }
      
      // 응답받은 step.nowStepId를 currentStepId로 설정
      applyStep(response.data.step);
    } catch (e) {
      const message = e instanceof Error ? e.message : "next-step 요청 중 오류가 발생했습니다.";
      setError(message);
    }
  }, [scenario, applyStep]);

  const goToStep = useCallback(
    (stepId: number) => {
      if (!scenario) return;
      if (!(stepId in scenario.steps)) return;

      if (currentStepId != null) {
        setPreviousStepId(currentStepId);
      }
      setCurrentStepId(stepId);
    },
    [scenario, currentStepId],
  );

  const currentStep = useMemo<ScenarioStep | null>(() => {
    if (!scenario || currentStepId == null) return null;
    return scenario.steps[currentStepId] ?? null;
  }, [scenario, currentStepId]);

  const previousStep = useMemo<ScenarioStep | null>(() => {
    if (!scenario || previousStepId == null) return null;
    return scenario.steps[previousStepId] ?? null;
  }, [scenario, previousStepId]);

  return {
    currentStep,
    previousStep,
    isLoading,
    error,
    start,
    nextStep,
    goToStep,
    resume,
  };
}


