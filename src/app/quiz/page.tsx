"use client"; // 퀴즈 데이터 선택과 헤더 설정을 위해 클라이언트 컴포넌트로 선언합니다.

import { useEffect } from "react";
import QuizScreen, { type QuizContent } from "@/components/quiz/QuizScreen";
import { useScenarioHeader } from "@/lib/context/ScenarioHeaderContext";

const mockQuiz: QuizContent = {
  id: "quiz-1",
  title: "Quiz 1",
  prompt: "설명 중 옳은 것을 고르시오.",
  options: [
    { id: "option-1", text: "계좌이체는 ATM이 아닌 다양한 채널에서도 이용할 수 있다." },
    { id: "option-2", text: "계좌이체는 계좌별 수수료와 이체 한도를 확인하고 이용해야 한다." },
    { id: "option-3", text: "계좌 내역조회는 타인의 계좌까지 열람할 수 있다." },
    { id: "option-4", text: "실수 거래 내역은 앱에서 직접 확인하고 정정할 수 있다." },
  ],
};

export default function QuizPage() {
  const { setTitle } = useScenarioHeader();

  useEffect(() => {
    setTitle("Quiz");
    return () => setTitle("");
  }, [setTitle]);

  // TODO: 추후 DB 혹은 API에서 퀴즈 콘텐츠를 불러와 내려줄 예정입니다.

  return (
    <div className="flex flex-col gap-[24px] px-[20px] py-[32px]">
      <QuizScreen quiz={mockQuiz} />
    </div>
  );
}

