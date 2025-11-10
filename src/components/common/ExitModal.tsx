"use client"; // 모달 애니메이션과 클릭 이벤트를 처리하므로 클라이언트 전용으로 선언합니다.

import { useEffect, useState } from "react";

type ExitModalProps = {
  isOpen: boolean; // 모달 표시 여부입니다.
  onClose: () => void; // 모달을 닫고 학습을 계속하도록 안내하는 콜백입니다.
  onExit: () => void; // 학습을 종료할 때 실행할 콜백입니다.
};

export default function ExitModal({ isOpen, onClose, onExit }: ExitModalProps) {
  const [isVisible, setIsVisible] = useState(false); // 진입 애니메이션을 제어하기 위한 내부 상태입니다.

  useEffect(() => {
    if (!isOpen) return; // 닫힌 상태에서는 애니메이션을 초기화하지 않습니다.

    const frame = requestAnimationFrame(() => {
      setIsVisible(true); // 렌더 후 다음 프레임에서 표시 플래그를 true로 전환하여 트랜지션을 부드럽게 시작합니다.
    });

    return () => {
      cancelAnimationFrame(frame);
      setIsVisible(false); // 모달이 닫히면 애니메이션 상태를 초기화합니다.
    };
  }, [isOpen]);

  if (!isOpen) return null; // 모달이 열리지 않았다면 렌더링을 생략합니다.

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
