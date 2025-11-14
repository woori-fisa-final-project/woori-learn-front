// 퀴즈 화면 컴포넌트는 사용자 입력을 즉시 반영해야 하므로 클라이언트 컴포넌트로 선언합니다.
"use client"; // 퀴즈 화면은 사용자 선택에 따라 즉시 반응하므로 클라이언트 컴포넌트로 선언합니다.

// 옵션 배열을 순회하면서 색상 팔레트를 계산하기 위해 React 훅을 사용합니다.
import { useMemo, useState } from "react";
import Image from "next/image";

export type QuizOption = {
  id: string;
  text: string;
};

export type QuizContent = {
  id: string;
  title: string;
  prompt: string;
  options: QuizOption[];
  correctAnswerId: string;
};

type QuizScreenProps = {
  quiz: QuizContent;
  onSelectOption?: (quizId: string, optionId: string) => void;
};

const OPTION_COLORS = ["bg-[#D6F4FF]", "bg-[#E4E1FF]", "bg-[#FFE6F1]", "bg-[#EAF7E5]"];

export default function QuizScreen({ quiz, onSelectOption }: QuizScreenProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null); // 사용자가 클릭한 보기의 식별자를 기억합니다.

  const optionsWithPalette = useMemo(
    () =>
      quiz.options.map((option, index) => ({
        ...option,
        palette: OPTION_COLORS[index % OPTION_COLORS.length], // 보기 순서에 따라 배경색을 반복 적용합니다.
      })),
    [quiz.options]
  );

  const handleOptionClick = (optionId: string) => {
    setSelectedOption(optionId); // 선택된 옵션을 상태에 저장하여 강조 표시합니다.
    onSelectOption?.(quiz.id, optionId); // 상위에서 콜백을 제공하면 선택 결과를 전달합니다.
  };

  return (
    <div className="flex w-full justify-center">
      <div className="relative w-full max-w-[360px] rounded-[24px] bg-[#FAF1E6] p-[24px] shadow-inner"> {/* 퀴즈 카드의 베이스 배경을 생성합니다. */}
        <div className="absolute left-1/2 top-[18px] h-[18px] w-[150px] -translate-x-1/2 rounded-full bg-gradient-to-b from-[#F6EDE2] to-[#F1E4D6] shadow-[0px_6px_12px_rgba(0,0,0,0.08)]" /> {/* 카드 상단에 걸려 있는 스트립을 표현합니다. */}
        <div className="absolute left-1/2 top-[26px] h-[10px] w-[48px] -translate-x-1/2 rounded-full bg-[#B8ADA0] shadow-[0px_4px_8px_rgba(0,0,0,0.15)]" /> {/* 집게의 클립 부분을 나타냅니다. */}
        <div className="relative mt-[44px] rounded-[16px] bg-white px-[20px] pb-[40px] pt-[48px] text-center shadow-[0px_4px_20px_rgba(0,0,0,0.05)]"> {/* 실제 퀴즈 내용을 담는 흰색 카드입니다. */}
          <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2"> {/* 집게 아래에 아이콘을 부착합니다. */}
            <Image src="/images/quiz.png" alt="Quiz" className="h-[42px] w-auto drop-shadow" width={42} height={42} /> {/* 퀴즈 상단 장식 이미지를 표시합니다. */}
          </div>
          <h2 className="mt-[12px] text-[22px] font-bold text-gray-900">{quiz.title}</h2> {/* 퀴즈 제목을 강조해 보여줍니다. */}
          <p className="mt-[16px] text-[15px] font-medium text-gray-700">{quiz.prompt}</p> {/* 문제 지문을 안내 문장으로 보여줍니다. */}

          <div className="mt-[24px] space-y-[12px]">
            {optionsWithPalette.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => handleOptionClick(option.id)}
                className={`w-full rounded-[24px] px-[18px] py-[14px] text-[14px] font-medium transition ${
                  option.palette
                } ${
                  selectedOption === option.id
                    ? "ring-2 ring-[#2F6FD9] ring-offset-2 ring-offset-white"
                    : "hover:ring-2 hover:ring-[#2F6FD9]/60 hover:ring-offset-2 hover:ring-offset-white"
                }`}
              >
                {option.text} {/* 각 보기의 내용을 버튼 라벨로 그대로 보여줍니다. */}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

