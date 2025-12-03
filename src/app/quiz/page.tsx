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

/**
 * QuizPageInner
 * - 실제 퀴즈 페이지 로직을 수행하는 컴포넌트
 * - 엔진 모드(ScenarioEngine 기반): URL에 scenarioId/stepId가 있으면 서버 퀴즈 진행(quizState)을 사용
 * - JSON 모드(정적 파일 기반): URL에 engine 파라미터가 없으면 /data/quizzes.json에서 퀴즈를 로드
 */
function QuizPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setTitle } = useScenarioHeader();

  const quizId = searchParams.get("id") || "1";

  /**
   * 엔진 모드 여부 판단
   * - scenarioId 또는 stepId가 있으면 시나리오 엔진에서 넘어온 퀴즈로 간주
   */
  const hasEngineParams = searchParams.has("scenarioId") || searchParams.has("stepId");
  const scenarioIdParam = searchParams.get("scenarioId");
  const stepIdParam = searchParams.get("stepId");

  // 엔진 모드에서 사용할 scenarioId/stepId 파싱
  const scenarioId = scenarioIdParam ? Number(scenarioIdParam) : NaN;
  const stepId = stepIdParam ? Number(stepIdParam) : undefined;

  /**
   * 시나리오 엔진 훅
   * - quizState가 있으면 서버가 퀴즈를 요구중(또는 오답)이라는 의미
   * - submitQuizAnswer로 정답/오답 제출 후, nextStep 결과에 따라 진행이 바뀜
   */
  const { currentStep, isLoading: engineLoading, error: engineError, resume, nextStep, quizState, submitQuizAnswer } = useScenarioEngine();

  /** JSON 모드에서 로딩할 퀴즈 상태 */
  const [quiz, setQuiz] = useState<QuizContent | null>(null);
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizError, setQuizError] = useState<string | null>(null);
  /**
   * 오답 메시지 표시 상태
   * - 엔진 모드: quizState.status === "QUIZ_WRONG"을 활용
   * - JSON 모드: isWrong 플래그로 관리
   */
  const [isWrong, setIsWrong] = useState(false);
  /**
   * 포인트 적립 관련 상태
   * - 중복 적립 방지
   */
  const [hasDeposited, setHasDeposited] = useState(false);
  const [isDepositing, setIsDepositing] = useState(false);
  const [depositMessage, setDepositMessage] = useState<string | null>(null);
  /** 전역 유저 포인트 상태 업데이트용 */
  const { setAvailablePoints } = useUserStore();
  /** API 중복 호출을 막기 위한 플래그 */
  const inFlightRef = useRef(false);

  const REWARD_QUIZ_ID = "2";

  const REWARD_SCENARIO_ID_JSON = "2";

  useEffect(() => {
    setTitle('Quiz');
    return () => setTitle('');
  }, [setTitle]);

  /**
   * [엔진 모드] resume 호출
   * - scenarioId/stepId 조합이 바뀔 때만 resume 호출되도록 resumedKeyRef로 중복 방지
   */
  const resumedKeyRef = useRef<string | null>(null);
  useEffect(() => {
    if (!hasEngineParams) return;
    if (!Number.isFinite(scenarioId)) return;

    const key = `${scenarioId}:${stepId ?? "null"}`;
    if (resumedKeyRef.current === key) return;
    resumedKeyRef.current = key;

    // 시나리오 문서 로드 + stepId가 있으면 해당 step으로 진입, 없으면 resume API결과로 진입
    void resume(scenarioId, stepId);
  }, [hasEngineParams, resume, scenarioId, stepId]);

  /**
   * [엔진 모드] "퀴즈를 띄우기 위한 nextStep 트리거"
   * - 현재 step에서 nextStep을 호출했을 때 서버가 QUIZ_REQUIRED/QUIZ_WRONG과 함께 quiz를 내려주면 quizState가 채워짐
   * - 이미 quizState가 있으면 중복 호출하지 않음
   */
  const fetchQuizKeyRef = useRef<string | null>(null);
  useEffect(() => {
    if (!hasEngineParams) return;
    if (!currentStep) return;
    if (quizState) return;

    if (Number.isFinite(stepId as number) && stepId !== undefined && currentStep.id !== stepId) {
      return;
    }

    // scenarioId:currentStep.id 조합으로 nextStep 호출 중복 방지
    const key = `${scenarioId}:${currentStep.id}`;
    if (fetchQuizKeyRef.current === key) return;
    fetchQuizKeyRef.current = key;

    // 서버가 퀴즈 요구 상태라면 quizState에 quiz가 채워짐
    void nextStep(currentStep.id);
  }, [hasEngineParams, currentStep, quizState, nextStep, scenarioId, stepId]);

  /** [JSON 모드] quizId가 바뀌면 보상 관련 상태 초기화 */
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

  /**
   * [엔진 모드] quizState(ApiQuiz)를 QuizScreen에서 쓸 QuizContent로 변환
   * - correctAnswerId는 서버 판정이므로 "__server__" 같은 더미값을 둠
   * - optionId는 index 기반 문자열로 구성 (submitQuizAnswer에서 index로 다시 변환)
   */
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

  /**
   * 보상 지급 로직
   * - 특정 퀴즈 정답/완료 시 서버로 reward 요청
   * - 보상 성공 시 store의 포인트를 서버값으로 동기화
   */
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

  /**
   * [엔진 모드] 보기 선택 핸들러
   * 1) optionId(문자열 index)를 숫자로 변환
   * 2) submitQuizAnswer로 서버에 제출
   * 3) 정답이면 보상 처리 후 메인으로 이동
   */
  const handleSelectOptionEngine = useCallback(
    async (_quizId: string, optionId: string) => {
      const idx = Number(optionId);
      if (!Number.isFinite(idx)) return;

      const result = await submitQuizAnswer(idx);

      // 서버가 QUIZ_WRONG/QUIZ_REQUIRED이면 아직 정답 처리 완료가 아니므로 이동하지 않음
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

  /**
   * 오답 메시지 표시 여부
   * - 엔진: quizState.status 기반
   * - JSON: isWrong 기반
   */
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
