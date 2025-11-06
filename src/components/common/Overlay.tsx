"use client";
import { useEffect, ReactNode } from "react";

interface OverlayProps {
  isOpen: boolean;
  onClose?: () => void;
  children: ReactNode;
  className?: string;
  zIndex?: "z-40" | "z-50" | "z-[100]";
  backgroundColor?: string;
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

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 ${zIndex} flex items-center justify-center backdrop-blur-[4px] ${backgroundColor} ${className}`}
      onClick={onClose}
    >
      <div onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>
  );
}

