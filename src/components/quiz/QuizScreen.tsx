"use client"; // 퀴즈 화면은 사용자 선택에 따라 즉시 반응하므로 클라이언트 컴포넌트로 선언합니다.

import { useMemo, useState } from "react";

export type QuizOption = {
  id: string;
  text: string;
};

export type QuizContent = {
  id: string;
  title: string;
  prompt: string;
  options: QuizOption[];
};

type QuizScreenProps = {
  quiz: QuizContent;
  onSelectOption?: (quizId: string, optionId: string) => void;
};

const OPTION_COLORS = ["bg-[#D6F4FF]", "bg-[#E4E1FF]", "bg-[#FFE6F1]", "bg-[#EAF7E5]"];

export default function QuizScreen({ quiz, onSelectOption }: QuizScreenProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const optionsWithPalette = useMemo(
    () =>
      quiz.options.map((option, index) => ({
        ...option,
        palette: OPTION_COLORS[index % OPTION_COLORS.length],
      })),
    [quiz.options]
  );

  const handleOptionClick = (optionId: string) => {
    setSelectedOption(optionId);
    onSelectOption?.(quiz.id, optionId);
  };

  return (
    <div className="flex w-full justify-center">
      <div className="relative w-full max-w-[360px] rounded-[24px] bg-[#FAF1E6] p-[24px] shadow-inner">
        <div className="absolute left-1/2 top-[18px] h-[18px] w-[150px] -translate-x-1/2 rounded-full bg-gradient-to-b from-[#F6EDE2] to-[#F1E4D6] shadow-[0px_6px_12px_rgba(0,0,0,0.08)]" />
        <div className="absolute left-1/2 top-[26px] h-[10px] w-[48px] -translate-x-1/2 rounded-full bg-[#B8ADA0] shadow-[0px_4px_8px_rgba(0,0,0,0.15)]" />
        <div className="relative mt-[44px] rounded-[16px] bg-white px-[20px] pb-[40px] pt-[48px] text-center shadow-[0px_4px_20px_rgba(0,0,0,0.05)]">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
            <img src="/images/quiz.png" alt="Quiz" className="h/[42px] w-auto drop-shadow" />
          </div>
          <h2 className="mt-[12px] text-[22px] font-bold text-gray-900">{quiz.title}</h2>
          <p className="mt-[16px] text-[15px] font-medium text-gray-700">{quiz.prompt}</p>

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
                {option.text}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

