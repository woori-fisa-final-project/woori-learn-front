"use client";

import { useEffect, useState } from "react";

type ExitModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onExit: () => void;
};

export default function ExitModal({ isOpen, onClose, onExit }: ExitModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const frame = requestAnimationFrame(() => {
      setIsVisible(true);
    });

    return () => {
      cancelAnimationFrame(frame);
      setIsVisible(false);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div
        className={`w-[80%] max-w-[320px] rounded-2xl bg-white p-6 text-center font-sans shadow-lg transition-all duration-200 ease-out ${
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <h2 className="text-lg font-semibold text-gray-900">
          학습을 종료하시겠어요? 🐝
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          지금 나가면 진행 중인 내용이 저장되지 않습니다.
        </p>

        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-medium text-gray-600 transition-colors duration-150 hover:bg-gray-50"
          >
            계속 진행
          </button>
          <button
            type="button"
            onClick={onExit}
            className="flex-1 rounded-xl bg-[#2482C5] py-3 text-sm font-medium text-white transition-colors duration-150 hover:bg-[#1E6FB1]"
          >
            나가기
          </button>
        </div>
      </div>
    </div>
  );
}
