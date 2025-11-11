"use client"; // 시나리오 헤더는 라우터와 모달 상태를 제어하므로 클라이언트 전용으로 선언합니다.

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import ExitModal from "./ExitModal";
import { useScenarioHeader } from "@/lib/context/ScenarioHeaderContext";

type ScenarioHeaderProps = {
  className?: string; // 헤더 외부 스타일을 확장하기 위한 클래스입니다.
};

export default function ScenarioHeader({ className = "" }: ScenarioHeaderProps) {
  const router = useRouter(); // 기본 뒤로가기 라우팅을 처리합니다.
  const { onBack, title } = useScenarioHeader(); // 컨텍스트에서 단계별 맞춤 뒤로가기 핸들러와 중앙 타이틀을 가져옵니다.
  const [isModalOpen, setIsModalOpen] = useState(false); // 학습 종료 모달의 열림 상태입니다.

  const handleBack = useCallback(() => {
    if (onBack) {
      onBack();
      return;
    }
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }
    router.push("/woorimain"); // 뒤로갈 히스토리가 없을 때는 메인 페이지로 이동합니다.
  }, [onBack, router]);

  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true); // 학습 종료 모달을 엽니다.
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false); // 모달을 닫고 상태를 초기화합니다.
  }, []);

  const handleExit = useCallback(() => {
    setIsModalOpen(false);
    router.push("/home"); // 학습 종료를 선택하면 홈 페이지로 이동합니다.
  }, [router]);

  return (
    <>
      <header
        className={`sticky top-0 z-40 flex items-center bg-white px-[20px] py-[16px] font-sans ${className}`}
      >
        <div className="flex flex-1 justify-start">
          <button
            type="button"
            onClick={handleBack}
            className="flex h-[24px] w-[24px] items-center justify-center"
            aria-label="뒤로가기"
          >
            <img src="/images/backicon.png" alt="뒤로가기" className="h-[12px] w-[12px] -rotate-90 object-contain" />
          </button>
        </div>

        <div className="flex flex-1 justify-center">
          <span className="text-[15px] font-semibold text-gray-600">{title}</span>
        </div>

        <div className="flex flex-1 justify-end">
          <button
            type="button"
            onClick={handleOpenModal}
            className="whitespace-nowrap text-[14px] font-medium text-[#2F6FD9]"
            aria-label="학습 종료"
          >
            학습 종료
          </button>
        </div>
      </header>

      <ExitModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onExit={handleExit}
      />
    </>
  );
}
