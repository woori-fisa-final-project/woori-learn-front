"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import QuizScreen, { type QuizContent } from "@/components/quiz/QuizScreen";
import { useScenarioHeader } from "@/lib/context/ScenarioHeaderContext";
import { devLog, devError } from "@/utils/logger";

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
        const foundQuiz = Array.isArray(data?.quizzes)
          ? data.quizzes.find((q: QuizContent) => q.id === quizId)
          : undefined;
          
        if (!foundQuiz) {
          throw new Error(`퀴즈 ID ${quizId}를 찾을 수 없습니다.`);
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

