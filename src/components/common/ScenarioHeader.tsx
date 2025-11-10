"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import ExitModal from "./ExitModal";
import { useScenarioHeader } from "@/lib/context/ScenarioHeaderContext";

type ScenarioHeaderProps = {
  className?: string;
};

export default function ScenarioHeader({ className = "" }: ScenarioHeaderProps) {
  const router = useRouter();
  const { onBack } = useScenarioHeader();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBack = useCallback(() => {
    if (onBack) {
      onBack();
      return;
    }
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }
    router.push("/woorimain");
  }, [onBack, router]);

  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleExit = useCallback(() => {
    setIsModalOpen(false);
    router.push("/home");
  }, [router]);

  return (
    <>
      <header
        className={`sticky top-0 z-40 flex h-[60px] items-center justify-between bg-white px-[20px] font-sans ${className}`}
      >
        <button
          type="button"
          onClick={handleBack}
          className="w-[14px] h-[7px] flex items-center justify-center -rotate-90 shrink-0"
          aria-label="뒤로가기"
        >
          <img src="/images/backicon.png" alt="뒤로가기" className="h-full w-full object-contain" />
        </button>  
        <button
          type="button"
          onClick={handleOpenModal}
          className="text-[14px] font-medium text-[#2F6FD9]"
          aria-label="학습 종료"
        >
          학습 종료
        </button>
      </header>

      <ExitModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onExit={handleExit}
      />
    </>
  );
}
