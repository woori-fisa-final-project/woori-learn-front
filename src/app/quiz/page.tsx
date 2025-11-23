'use client';

import { useCallback, useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import QuizScreen, { type QuizContent } from '@/components/quiz/QuizScreen';
import axiosInstance from '@/utils/axiosInstance';
import { useScenarioHeader } from '@/lib/context/ScenarioHeaderContext';
import { devLog, devError } from '@/utils/logger';

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

function QuizContent() {
  const { setTitle } = useScenarioHeader();
  const searchParams = useSearchParams();
  const quizId = searchParams.get('id') || '1'; // 기본값 1

  const [quiz, setQuiz] = useState<QuizContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasDeposited, setHasDeposited] = useState(false);
  const [isDepositing, setIsDepositing] = useState(false);
  const [depositMessage, setDepositMessage] = useState<string | null>(null);

  useEffect(() => {
    setTitle('Quiz');
    return () => setTitle('');
  }, [setTitle]);

  useEffect(() => {
    setHasDeposited(false);
    setDepositMessage(null);
    setIsDepositing(false);
  }, [quizId]);

  useEffect(() => {
    async function loadQuiz() {
      try {
        setIsLoading(true);
        setError(null);

        // JSON 파일에서 퀴즈 데이터 로드
        const response = await fetch('/data/quizzes.json');

        if (!response.ok) {
          throw new Error(`퀴즈 데이터 로드 실패: ${response.status}`);
        }

        const data = await response.json();

        // 데이터 구조 검증
        if (!data || typeof data !== 'object' || !Array.isArray(data.quizzes)) {
          throw new Error('퀴즈 데이터 형식이 올바르지 않습니다.');
        }

        // ID로 퀴즈 찾기 (타입 단언 없이)
        const foundQuiz = data.quizzes.find((q: unknown) => {
          return q && typeof q === 'object' && 'id' in q && q.id === quizId;
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
        devError('[QuizPage] 퀴즈 로드 실패:', err);
        setError(
          err instanceof Error ? err.message : '퀴즈를 불러올 수 없습니다.'
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadQuiz();
  }, [quizId]);

  const handleSelectOption = useCallback(
    async (selectedQuizId: string, optionId: string) => {
      if (!quiz || quiz.id !== selectedQuizId) return;
      if (quiz.id !== '2') return; // 해당 시나리오 퀴즈에만 포인트 적립
      if (hasDeposited || isDepositing) return;

      if (optionId !== quiz.correctAnswerId) {
        setDepositMessage('정답을 선택하면 포인트가 적립돼요.');
        return;
      }

      try {
        setIsDepositing(true);
        setDepositMessage(null);

        const scenarioId = '2';
        const res = await axiosInstance.post(
          `/users/me/scenarios/${scenarioId}/reward`
        );
        const rewarded = res.data?.data?.rewarded;

        setHasDeposited(true);
        setDepositMessage(
          rewarded
            ? '시나리오 완료! 1000포인트 적립 완료.'
            : '이미 보상을 받았습니다.'
        );
        devLog('[QuizPage] 포인트 적립 완료 여부:', rewarded);
      } catch (err) {
        setHasDeposited(false);
        setDepositMessage('포인트 적립에 실패했습니다. 다시 시도해주세요.');
        devError('[QuizPage] 포인트 적립 실패:', err);
      } finally {
        setIsDepositing(false);
      }
    },
    [quiz, hasDeposited, isDepositing]
  );

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
        <p className="text-gray-500">{error || '퀴즈를 불러올 수 없습니다.'}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[24px] px-[20px] py-[32px]">
      <QuizScreen quiz={quiz} onSelectOption={handleSelectOption} />
      {depositMessage && (
        <p className="text-center text-sm text-gray-700">{depositMessage}</p>
      )}
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
      <QuizContent />
    </Suspense>
  );
}
