"use client"; // 모달 열림 상태를 제어하므로 클라이언트 전용으로 선언합니다.
import React from "react"; // 모달 콘텐츠를 ReactNode로 받을 수 있게 타입을 가져옵니다.
import Overlay from "./Overlay"; // 배경 클릭을 제어하는 공통 오버레이 컴포넌트입니다.
import Button from "@/components/common/Button"; // 확인/취소 버튼에 공통 버튼 컴포넌트를 사용합니다.

interface ModalProps {
  isOpen: boolean; // 모달 표시 여부입니다.
  onClose: () => void; // 모달을 닫기 위한 콜백입니다.
  title?: string; // 기본 모달 헤더에 표시할 제목입니다.
  description?: string; // 본문에 표시할 설명 텍스트입니다.
  confirmText?: string; // 확인 버튼에 표시할 라벨입니다.
  cancelText?: string; // 취소 버튼 텍스트(기본값은 "취소")입니다.
  onConfirm?: () => void; // 확인 버튼 클릭 시 실행할 콜백입니다.
  zIndex?: "z-40" | "z-50" | "z-[100]"; // 필요 시 다른 레이어보다 위에 올리기 위한 z-index
  children?: React.ReactNode; // 커스텀 콘텐츠를 렌더링하고 싶을 때 사용할 슬롯입니다.
}

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  confirmText = "확인",
  cancelText = "취소",
  onConfirm,
  zIndex,
  children,
}: ModalProps) {
  const handleConfirm = onConfirm ?? onClose;
  // 오버레이로 감싼 기본 모달 레이아웃을 제공하며, children이 주어지면 그대로 렌더링합니다.
  return (
    <Overlay isOpen={isOpen} onClose={onClose} zIndex={zIndex}>
      <div className="bg-white rounded-[20px] w-[350px] max-w-[calc(100vw-40px)] mx-auto p-6 animate-slideDown">
        {children ? (
          children
        ) : (
          <>
            {title && (
              <h2 className="text-[20px] text-gray-700 font-semibold text-center mb-6">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-[16px] text-gray-600 text-center mb-8 w-full whitespace-pre-line">
                {description}
              </p>
            )}
            <div className="flex gap-3 w-full">
              <Button variant="secondary" onClick={onClose} size="sm">
                {cancelText}
              </Button>
              <Button variant="primary" onClick={handleConfirm} size="sm">
                {confirmText}
              </Button>
            </div>
          </>
        )}
      </div>
    </Overlay>
  );
}
