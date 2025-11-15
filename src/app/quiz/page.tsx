"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import QuizScreen, { type QuizContent } from "@/components/quiz/QuizScreen";
import { useScenarioHeader } from "@/lib/context/ScenarioHeaderContext";
import { devLog, devError } from "@/utils/logger";

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

function QuizContent() {
  const { setTitle } = useScenarioHeader();
  const searchParams = useSearchParams();
  const quizId = searchParams.get("id") || "1"; // 기본값 1

  const [quiz, setQuiz] = useState<QuizContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setTitle("Quiz");
    return () => setTitle("");
  }, [setTitle]);

  useEffect(() => {
    async function loadQuiz() {
      try {
        setIsLoading(true);
        setError(null);

        // JSON 파일에서 퀴즈 데이터 로드
        const response = await fetch("/data/quizzes.json");

        if (!response.ok) {
          throw new Error(`퀴즈 데이터 로드 실패: ${response.status}`);
        }

        const data = await response.json();

        // 데이터 구조 검증
        if (!data || typeof data !== "object" || !Array.isArray(data.quizzes)) {
          throw new Error("퀴즈 데이터 형식이 올바르지 않습니다.");
        }

        // ID로 퀴즈 찾기 (타입 단언 없이)
        const foundQuiz = data.quizzes.find((q: unknown) => {
          return q && typeof q === "object" && "id" in q && q.id === quizId;
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
        setQuiz(foundQuiz);
      } catch (err) {
        devError("[QuizPage] 퀴즈 로드 실패:", err);
        setError(err instanceof Error ? err.message : "퀴즈를 불러올 수 없습니다.");
      } finally {
        setIsLoading(false);
      }
    }

    loadQuiz();
  }, [quizId]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-500">퀴즈를 불러오는 중...</p>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-500">{error || "퀴즈를 불러올 수 없습니다."}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[24px] px-[20px] py-[32px]">
      <QuizScreen quiz={quiz} />
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
      <QuizContent />
    </Suspense>
  );
}

