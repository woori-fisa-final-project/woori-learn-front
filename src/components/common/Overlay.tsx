"use client"; // 스크롤 제어와 클릭 이벤트를 처리하기 위해 클라이언트 전용으로 선언합니다.
import { useEffect, ReactNode } from "react"; // 오버레이 생명주기 관리와 자식 렌더링을 위한 타입을 가져옵니다.

interface OverlayProps {
  isOpen: boolean; // 오버레이 표시 여부입니다.
  onClose?: () => void; // 배경을 클릭했을 때 실행할 콜백입니다.
  children: ReactNode; // 오버레이 위에 렌더링할 실제 모달 또는 콘텐츠입니다.
  className?: string; // 추가 스타일을 주입할 수 있는 클래스입니다.
  zIndex?: "z-40" | "z-50" | "z-[100]"; // 오버레이의 z-index 값을 선택할 수 있습니다.
  backgroundColor?: string; // 배경 색상 및 투명도를 제어하기 위한 클래스입니다.
}

export default function Overlay({
  isOpen,
  onClose,
  children,
  className = "",
  zIndex = "z-50",
  backgroundColor = "bg-black/55",
}: OverlayProps) {
  // 오버레이가 열릴 때 배경 스크롤 막기
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null; // 닫힌 상태에서는 아무것도 렌더링하지 않습니다.

  return (
    <div
      className={`fixed inset-0 ${zIndex} flex items-center justify-center backdrop-blur-[4px] ${backgroundColor} ${className}`}
      onClick={onClose}
    >
      <div onClick={(e) => e.stopPropagation()}>{children}</div> {/* 내부 콘텐츠 클릭 시 오버레이 닫힘 이벤트가 전파되지 않도록 막습니다. */}
    </div>
  );
}


