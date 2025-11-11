// 퀴즈 화면에서 상태와 헤더를 제어하기 위해 클라이언트 컴포넌트로 선언합니다.
"use client"; // 퀴즈 데이터 선택과 헤더 설정을 위해 클라이언트 컴포넌트를 사용합니다.

// 헤더 제목을 조절하기 위해 useEffect 훅을 사용합니다.
import { useEffect } from "react";
// 재사용 가능한 퀴즈 화면 컴포넌트와 타입을 불러옵니다.
import QuizScreen, { type QuizContent } from "@/components/quiz/QuizScreen";
// 시나리오 헤더 컨텍스트를 통해 중앙 제목을 설정합니다.
import { useScenarioHeader } from "@/lib/context/ScenarioHeaderContext";

// 실제로는 API나 DB에서 주입될 퀴즈 데이터를 임시로 하드코딩합니다.
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
    setTitle("Quiz"); // 페이지에 진입하면 헤더 중앙에 타이틀을 표시합니다.
    return () => setTitle(""); // 페이지를 벗어날 때는 제목을 초기화합니다.
  }, [setTitle]);

  // TODO: 추후 DB 혹은 API에서 퀴즈 콘텐츠를 불러와 내려줄 예정입니다.

  return (
    <div className="flex flex-col gap-[24px] px-[20px] py-[32px]"> {/* 페이지 공통 여백을 설정합니다. */}
      <QuizScreen quiz={mockQuiz} /> {/* 재사용 가능한 퀴즈 화면 컴포넌트에 데이터를 전달합니다. */}
    </div>
  );
}

