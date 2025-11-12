"use client";

import Overlay from "@/components/common/Overlay";
import { ReactNode, useEffect } from "react";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  showCloseButton?: boolean;
}

export default function BottomSheet({
  isOpen,
  onClose,
  title,
  children,
  showCloseButton = true,
}: BottomSheetProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <Overlay
      isOpen={isOpen}
      onClose={onClose}
      backgroundColor="bg-black/45"
      zIndex="z-[100]"
    >
      {/* ✅ Overlay 자체가 fixed inset-0로 되어 있다고 가정 */}
      <div className="absolute bottom-0 left-1/2 w-full max-w-[390px] -translate-x-1/2 animate-slideUp rounded-t-[20px] bg-white pb-[50px] shadow-2xl">
        {(title || showCloseButton) && (
          <header className="flex items-center justify-between px-[20px] pt-[22px] pb-[12px]">
            <h2 className="text-[20px] font-semibold text-gray-800">
              {title}
            </h2>
            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                aria-label="바텀시트 닫기"
                className="text-[18px] text-gray-400 transition"
              >
                ✕
              </button>
            )}
          </header>
        )}
        <div className="px-[20px]">{children}</div>
      </div>
    </Overlay>
  );
}
