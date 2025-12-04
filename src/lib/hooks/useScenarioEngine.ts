// useScenarioEngine.ts
import { useCallback, useMemo, useState, useRef } from "react";
import { fetchScenarioFromApi, fetchScenarioResumeFromApi, postScenarioNextStepFromApi } from "@/lib/api/scenario";
import type { ApiQuiz, ScenarioData, ScenarioStep, NextStepApiData } from "@/types/scenario";

const QUIZ_ANSWER_BASE = 1;

export function useScenarioEngine() {
  const [scenario, setScenario] = useState<ScenarioData | null>(null);
  const [scenarioIdInPlay, setScenarioIdInPlay] = useState<number | null>(null);
  const [currentStepId, setCurrentStepId] = useState<number | null>(null);
  const [previousStepId, setPreviousStepId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [quizState, setQuizState] = useState<null | { stepId: number; quiz: ApiQuiz; status?: string }>(null);
  const quizInFlightRef = useRef(false);

  const loadScenarioDoc = useCallback(async (scenarioId: number) => {
    setScenarioIdInPlay(scenarioId);

    const res = await fetchScenarioFromApi(scenarioId);

    const stepsMap: Record<number, ScenarioStep> = {};
    res.steps.forEach((step: ScenarioStep) => {
      stepsMap[step.id] = step;
    });

    const data: ScenarioData = {
      meta: res.scenario ?? ({ id: scenarioId } as any),
      steps: stepsMap,
    };

    setScenario(data);
    return data;
  }, []);

  const applyNowStepId = useCallback((nowStepId: number | null) => {
    setPreviousStepId((prev) => (currentStepId != null ? currentStepId : prev));
    setCurrentStepId(nowStepId);
  }, [currentStepId]);

  const resume = useCallback(async (scenarioId: number, stepId?: number) => {
    setIsLoading(true);
    setError(null);
    try {
      setQuizState(null);
      await loadScenarioDoc(scenarioId);

      if (stepId == null) {
        const { nowStepId } = await fetchScenarioResumeFromApi(scenarioId);
        setPreviousStepId(null);
        setCurrentStepId(nowStepId);
        return;
      }

      setPreviousStepId(null);
      setCurrentStepId(stepId);
    } catch (e) {
      setError(e instanceof Error ? e.message : "resume 중 오류");
    } finally {
      setIsLoading(false);
    }
  }, [loadScenarioDoc]);

  const nextStep = useCallback(async (nowStepId: number, answer?: number) => {
    if (!scenario) return;
    if (scenarioIdInPlay == null) {
      setError("scenarioIdInPlay가 설정되지 않았습니다.");
      return;
    }

    try {
      const res: NextStepApiData = await postScenarioNextStepFromApi(scenarioIdInPlay, {
        nowStepId,
        ...(answer == null ? {} : { answer }),
      });

      if ((res.status === "QUIZ_REQUIRED" || res.status === "QUIZ_WRONG") && res.quiz) {
        setQuizState({ stepId: nowStepId, quiz: res.quiz as ApiQuiz, status: res.status });
        applyNowStepId(nowStepId);
        return res;
      }

      setQuizState(null);
      applyNowStepId(res.step ? res.step.nowStepId : null);
      return res;
    } catch (e: any) {
      console.error("[next-step ERROR]", e?.response?.status, e?.response?.data ?? e);
      setError(e instanceof Error ? e.message : "next-step 요청 중 오류");
    }
  }, [scenario, scenarioIdInPlay, applyNowStepId]);

  const submitQuizAnswer = useCallback(
    async (optionIndex: number) => {
      if (!quizState) return;
      if (quizInFlightRef.current) return;

      quizInFlightRef.current = true;
      try {
        return await nextStep(quizState.stepId, optionIndex + QUIZ_ANSWER_BASE);
      } finally {
        quizInFlightRef.current = false;
      }
    },
    [quizState, nextStep]
  );

  const currentStep = useMemo(() => {
    if (!scenario || currentStepId == null) return null;
    return scenario.steps[currentStepId] ?? null;
  }, [scenario, currentStepId]);

  const previousStep = useMemo(() => {
    if (!scenario || previousStepId == null) return null;
    return scenario.steps[previousStepId] ?? null;
  }, [scenario, previousStepId]);

  return { currentStep, previousStep, isLoading, error, resume, nextStep, quizState, submitQuizAnswer, setQuizState };
}
