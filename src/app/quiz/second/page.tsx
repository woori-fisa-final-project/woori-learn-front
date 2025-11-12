"use client";

import { useEffect } from "react";
import QuizScreen, { type QuizContent } from "@/components/quiz/QuizScreen";
import { useScenarioHeader } from "@/lib/context/ScenarioHeaderContext";

const mockQuiz: QuizContent = {
  id: "quiz-2",
  title: "Quiz 2",
  prompt: "설명 중 옳은 것을 고르시오.",
  options: [
    { id: "option-1", text: "자동이체 해지 여부는 해지 완료 화면에서 한 번 더 확인할 수 있다." },
    { id: "option-2", text: "정기예금은 만기 전에 해지해도 이자가 동일하게 지급된다." },
    { id: "option-3", text: "자동이체 등록일은 지정일과 다르게 설정할 수 없다." },
    { id: "option-4", text: "적금은 금액과 주기를 자유롭게 조절할 수 있는 상품만 존재한다." },
  ],
};

export default function QuizSecondPage() {
  const { setTitle } = useScenarioHeader();

  useEffect(() => {
    setTitle("Quiz");
    return () => setTitle("");
  }, [setTitle]);

  return (
    <div className="flex flex-col gap-[24px] px-[20px] py-[32px]">
      <QuizScreen quiz={mockQuiz} />
    </div>
  );
}

