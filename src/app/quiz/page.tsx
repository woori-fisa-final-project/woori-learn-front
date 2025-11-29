"use client";

import { useEffect, useState, Suspense, useRef, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import QuizScreen, { type QuizContent } from "@/components/quiz/QuizScreen";
import { useScenarioHeader } from "@/lib/context/ScenarioHeaderContext";
import { devLog, devError } from "@/utils/logger";
import { useScenarioEngine } from "@/lib/hooks/useScenarioEngine";

/**
 * 외부 데이터가 QuizContent 타입인지 검증하는 타입 가드
 * @param data 검증할 데이터
 * @returns QuizContent 타입 여부
 */
function isQuizContent(data: unknown): data is QuizContent {
  if (!data || typeof data !== "object") return false;

  const quiz = data as Record<string, unknown>;

  // 필수 필드 검증
  if (typeof quiz.id !== "string") return false;
  if (typeof quiz.title !== "string") return false;
  if (typeof quiz.prompt !== "string") return false;
  if (typeof quiz.correctAnswerId !== "string") return false;

  // options 배열 검증
  if (!Array.isArray(quiz.options)) return false;

  // 각 옵션의 구조 검증
  return quiz.options.every((option: unknown) => {
    if (!option || typeof option !== "object") return false;
    const opt = option as Record<string, unknown>;
    return typeof opt.id === "string" && typeof opt.text === "string";
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

  const { currentStep, isLoading, error, resume, nextStep, quizState, submitQuizAnswer } = useScenarioEngine();

  const [jsonQuiz, setJsonQuiz] = useState<QuizContent | null>(null);
  const [jsonLoading, setJsonLoading] = useState(false);
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [jsonWrong, setJsonWrong] = useState(false);

  useEffect(() => {
    setTitle("Quiz");
    return () => setTitle("");
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

    const controller = new AbortController();

    async function loadQuiz() {
      try {
        setJsonLoading(true);
        setJsonError(null);
        setJsonWrong(false);

        // JSON 파일에서 퀴즈 데이터 로드
        const response = await fetch("/data/quizzes.json", { signal: controller.signal });

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
          devError("[QuizPage] 퀴즈 데이터 구조가 올바르지 않음:", foundQuiz);
          throw new Error("퀴즈 데이터 구조가 올바르지 않습니다.");
        }

        devLog(`[QuizPage] 퀴즈 ${quizId} 로드 완료`);
        setJsonQuiz(foundQuiz);
      } catch (err) {
        devError("[QuizPage] 퀴즈 로드 실패:", err);
        setJsonError(err instanceof Error ? err.message : "퀴즈를 불러올 수 없습니다.");
      } finally {
        setJsonLoading(false);
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

  const handleSelectOptionEngine = async (_quizId: string, optionId: string) => {
    const idx = Number(optionId);
    if (!Number.isFinite(idx)) return;

    const result = await submitQuizAnswer(idx);

    // 정답이면 woorimain으로 이동
    if (result && result.status !== "QUIZ_REQUIRED" && result.status !== "QUIZ_WRONG") {
      router.push(`/woorimain?scenarioId=${scenarioId}`);
    }
    // 오답이면 아래 메시지로 처리(페이지 닫히지 않게)
  };

  const handleSelectOptionJson = (_quizId: string, optionId: string) => {
    if (!jsonQuiz) return;

    const isCorrect = optionId === jsonQuiz.correctAnswerId;
    if (isCorrect) {
      setJsonWrong(false);
      // 상단 코드 베이스 우선: 여기서는 별도 라우팅 강제하지 않음
      // (원하면 여기서 router.push(...) 붙이면 됨)
      return;
    }

    setJsonWrong(true);
  };

  const pageLoading = hasEngineParams ? isLoading || !engineQuiz : jsonLoading;
  const pageError = hasEngineParams ? error : jsonError;
  const activeQuiz = hasEngineParams ? engineQuiz : jsonQuiz;

  const showWrongMessage = hasEngineParams
    ? quizState?.status === "QUIZ_WRONG"
    : jsonWrong;

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
      <div className="flex h-[100dvh] items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-gray-500">{pageError || "퀴즈를 불러올 수 없습니다."}</p>
          {hasEngineParams && (
            <button
              onClick={() => router.back()}
              className="mt-4 rounded-lg bg-blue-500 px-4 py-2 text-white"
            >
              돌아가기
            </button>
          )}
        </div>
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
      </div>
    </div>
  );
}

export default function QuizPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-500">퀴즈를 불러오는 중...</p>
      </div>
    }>
      <QuizPageInner />
    </Suspense>
  );
}