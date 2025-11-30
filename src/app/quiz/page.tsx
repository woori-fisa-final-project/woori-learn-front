'use client';

import { useCallback, useEffect, useState, useRef, Suspense, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import QuizScreen, { type QuizContent } from '@/components/quiz/QuizScreen';
import axiosInstance from '@/utils/axiosInstance';
import { useScenarioHeader } from '@/lib/context/ScenarioHeaderContext';
import { devLog, devError } from '@/utils/logger';
import { useUserStore } from '@/lib/stores/userStore';
import { getCurrentUser } from '@/lib/api/user.api';
import { useScenarioEngine } from "@/lib/hooks/useScenarioEngine";

/**
 * 외부 데이터가 QuizContent 타입인지 검증하는 타입 가드
 * @param data 검증할 데이터
 * @returns QuizContent 타입 여부
 */
function isQuizContent(data: unknown): data is QuizContent {
  if (!data || typeof data !== 'object') return false;

  const quiz = data as Record<string, unknown>;

  // 필수 필드 검증
  if (typeof quiz.id !== 'string') return false;
  if (typeof quiz.title !== 'string') return false;
  if (typeof quiz.prompt !== 'string') return false;
  if (typeof quiz.correctAnswerId !== 'string') return false;

  // options 배열 검증
  if (!Array.isArray(quiz.options)) return false;

  // 각 옵션의 구조 검증
  return quiz.options.every((option: unknown) => {
    if (!option || typeof option !== 'object') return false;
    const opt = option as Record<string, unknown>;
    return typeof opt.id === 'string' && typeof opt.text === 'string';
  });
}

function QuizPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setTitle } = useScenarioHeader();

  const quizId = searchParams.get("id") || "1";

  const hasEngineParams = searchParams.has("scenarioId") || searchParams.has("stepId");
  const scenarioIdParam = searchParams.get("scenarioId");
  const stepIdParam = searchParams.get("stepId");

  const scenarioId = scenarioIdParam ? Number(scenarioIdParam) : NaN;
  const stepId = stepIdParam ? Number(stepIdParam) : undefined;

  const { currentStep, isLoading: engineLoading, error: engineError, resume, nextStep, quizState, submitQuizAnswer } = useScenarioEngine();

  const [quiz, setQuiz] = useState<QuizContent | null>(null);
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizError, setQuizError] = useState<string | null>(null);
  const [isWrong, setIsWrong] = useState(false);
  const [hasDeposited, setHasDeposited] = useState(false);
  const [isDepositing, setIsDepositing] = useState(false);
  const [depositMessage, setDepositMessage] = useState<string | null>(null);
  const { setAvailablePoints } = useUserStore();
  const inFlightRef = useRef(false);

  const REWARD_QUIZ_ID = "2";

  const REWARD_SCENARIO_ID_JSON = "2";

  useEffect(() => {
    setTitle('Quiz');
    return () => setTitle('');
  }, [setTitle]);

  const resumedKeyRef = useRef<string | null>(null);
  useEffect(() => {
    if (!hasEngineParams) return;
    if (!Number.isFinite(scenarioId)) return;

    const key = `${scenarioId}:${stepId ?? "null"}`;
    if (resumedKeyRef.current === key) return;
    resumedKeyRef.current = key;

    void resume(scenarioId, stepId);
  }, [hasEngineParams, resume, scenarioId, stepId]);

  const fetchQuizKeyRef = useRef<string | null>(null);
  useEffect(() => {
    if (!hasEngineParams) return;
    if (!currentStep) return;
    if (quizState) return;

    if (Number.isFinite(stepId as number) && stepId !== undefined && currentStep.id !== stepId) {
      return;
    }

    const key = `${scenarioId}:${currentStep.id}`;
    if (fetchQuizKeyRef.current === key) return;
    fetchQuizKeyRef.current = key;

    void nextStep(currentStep.id);
  }, [hasEngineParams, currentStep, quizState, nextStep, scenarioId, stepId]);

  useEffect(() => {
    if (hasEngineParams) return;
    setHasDeposited(false);
    setDepositMessage(null);
    setIsDepositing(false);
    inFlightRef.current = false;
  }, [hasEngineParams, quizId]);

  useEffect(() => {
    if (hasEngineParams) return;

    const controller = new AbortController();

    async function loadQuiz() {
      try {
        setQuizLoading(true);
        setQuizError(null);
        setIsWrong(false);

        const response = await fetch('/data/quizzes.json', { signal: controller.signal });

        if (!response.ok) {
          throw new Error(`퀴즈 데이터 로드 실패: ${response.status}`);
        }

        const data = await response.json();

        // 데이터 구조 검증
        if (!data || typeof data !== "object" || !Array.isArray((data as any).quizzes)) {
          throw new Error("퀴즈 데이터 형식이 올바르지 않습니다.");
        }

        // ID로 퀴즈 찾기 (타입 단언 없이)
        const foundQuiz = (data as any).quizzes.find((q: unknown) => {
          return q && typeof q === "object" && "id" in (q as any) && (q as any).id === quizId;
        });

        if (!foundQuiz) {
          throw new Error(`퀴즈 ID ${quizId}를 찾을 수 없습니다.`);
        }

        // 타입 가드로 검증
        if (!isQuizContent(foundQuiz)) {
          devError('[QuizPage] 퀴즈 데이터 구조가 올바르지 않음:', foundQuiz);
          throw new Error('퀴즈 데이터 구조가 올바르지 않습니다.');
        }

        devLog(`[QuizPage] 퀴즈 ${quizId} 로드 완료`);
        setQuiz(foundQuiz);
      } catch (err) {
        devError("[QuizPage] 퀴즈 로드 실패:", err);
        setQuizError(err instanceof Error ? err.message : "퀴즈를 불러올 수 없습니다.");
      } finally {
        setQuizLoading(false);
      }
    }

    void loadQuiz();
    return () => controller.abort();
  }, [hasEngineParams, quizId]);

  const engineQuiz: QuizContent | null = useMemo(() => {
    if (!quizState) return null;

    return {
      id: String(quizState.quiz.id),
      title: "퀴즈",
      prompt: quizState.quiz.question,
      options: quizState.quiz.options.map((text: string, idx: number) => ({
        id: String(idx), // optionIndex
        text,
      })),
      correctAnswerId: "__server__",
    };
  }, [quizState]);

  const rewardIfEligible = useCallback(
    async (quizIdStr: string, rewardScenarioId: string) => {
      if (quizIdStr !== REWARD_QUIZ_ID) return;

      if (inFlightRef.current) return;
      if (hasDeposited || isDepositing) return;

      inFlightRef.current = true;
      try {
        setIsDepositing(true);
        setDepositMessage(null);

        const res = await axiosInstance.post(`/users/me/scenarios/${rewardScenarioId}/reward`);

        const rewarded = res.data?.data?.rewarded;
        const rewardAmount = Number(res.data?.data?.amount ?? res.data?.data?.points ?? 1000);

        if (rewarded) {
          const serverBalance = Number(
            res.data?.data?.currentBalance ??
            res.data?.data?.balance ??
            res.data?.data?.points
          );

          if (!Number.isNaN(serverBalance)) {
            setAvailablePoints(serverBalance);
          } else {
            try {
              const user = await getCurrentUser();
              const p = user.points ?? user.point;
              if (typeof p === "number") setAvailablePoints(p);
            } catch (refreshError) {
              devError("[QuizPage] 보상 후 포인트 새로고침 실패:", refreshError);
            }
          }
        }

        setHasDeposited(true);
        setDepositMessage(
          rewarded ? `시나리오 완료! ${rewardAmount}포인트 적립 완료.` : "이미 보상을 받았습니다."
        );
        devLog("[QuizPage] 포인트 적립 완료 여부:", rewarded);
      } catch (err) {
        setHasDeposited(false);
        setDepositMessage("포인트 적립에 실패했습니다. 다시 시도해주세요.");
        devError("[QuizPage] 포인트 적립 실패:", err);
      } finally {
        setIsDepositing(false);
        inFlightRef.current = false;
      }
    },
    [hasDeposited, isDepositing, setAvailablePoints]
  );

  const handleSelectOptionEngine = useCallback(
    async (_quizId: string, optionId: string) => {
      const idx = Number(optionId);
      if (!Number.isFinite(idx)) return;

      const result = await submitQuizAnswer(idx);

      const isCorrect =
        !!result && result.status !== "QUIZ_REQUIRED" && result.status !== "QUIZ_WRONG";

      if (!isCorrect) return;

      const rewardScenarioId = Number.isFinite(scenarioId) ? String(scenarioId) : "1";
      await rewardIfEligible(_quizId, rewardScenarioId);

      router.push(`/woorimain?scenarioId=${Number.isFinite(scenarioId) ? scenarioId : 1}`);
    },
    [submitQuizAnswer, router, scenarioId, rewardIfEligible]
  );

  const handleSelectOptionJson = useCallback(
    async (_quizId: string, optionId: string) => {
      if (!quiz || quiz.id !== _quizId) return;

      const isCorrect = optionId === quiz.correctAnswerId;

      if (!isCorrect) {
        setIsWrong(true);
        return;
      }

      setIsWrong(false);

      await rewardIfEligible(quiz.id, REWARD_SCENARIO_ID_JSON);
    },
    [quiz, rewardIfEligible]
  );

  const pageLoading = hasEngineParams ? engineLoading || !engineQuiz : quizLoading;
  const pageError = hasEngineParams ? engineError : quizError;
  const activeQuiz = hasEngineParams ? engineQuiz : quiz;

  const showWrongMessage = hasEngineParams
    ? quizState?.status === "QUIZ_WRONG"
    : isWrong;

  const onSelectOption = hasEngineParams ? handleSelectOptionEngine : handleSelectOptionJson;

  if (pageLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-500">퀴즈를 불러오는 중...</p>
      </div>
    );
  }

  if (pageError || !activeQuiz) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-500">{pageError || '퀴즈를 불러올 수 없습니다.'}</p>
      </div>
    );
  }

  return (
    <div className="relative mx-auto h-[100dvh] w-full max-w-[430px] overflow-hidden bg-white">
      <div className="h-full px-[20px] py-[24px]">
        <QuizScreen quiz={activeQuiz} onSelectOption={onSelectOption} />

        {showWrongMessage && (
          <p className="mt-4 text-center text-[14px] font-medium text-red-600">
            정답이 아니에요. 다시 한 번 생각해볼까요?
          </p>
        )}
        {depositMessage && (
          <p className="text-center text-sm text-gray-700">{depositMessage}</p>
        )}
      </div>
    </div>
  );
}

export default function QuizPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <p className="text-gray-500">퀴즈를 불러오는 중...</p>
        </div>
      }
    >
      <QuizPageInner />
    </Suspense>
  );
}
