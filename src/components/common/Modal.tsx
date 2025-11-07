"use client";
import React from "react";
import Overlay from "./Overlay";
import Button from "@/components/common/Button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  confirmText: string;
  cancelText?: string;
  onConfirm: () => void;
  // confirmButtonColor?: string;
  // cancelButtonColor?: string;
  children?: React.ReactNode;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  confirmText,
  cancelText = "취소",
  onConfirm,
  // confirmButtonColor = "bg-primary-400",
  // cancelButtonColor = "bg-gray-100",
  children,
}: ModalProps) {
  return (
    <Overlay isOpen={isOpen} onClose={onClose}>
      <div className="bg-white rounded-[20px] w-[350px] max-w-[calc(100vw-40px)] mx-auto p-6 animate-slideDown">
        {children ? (
          children
        ) : (
          <>
            <h2 className="text-[20px] text-gray-700 font-semibold text-center mb-6">
              {title}
            </h2>
            <p className="text-[16px] text-gray-600 text-center mb-8 w-full whitespace-pre-line">
              {description}
            </p>
            <div className="flex gap-3 w-full">
              <Button variant="secondary" onClick={onClose} size="sm">
                {cancelText}
              </Button>
              <Button variant="primary" onClick={onConfirm} size="sm">
                {confirmText}
              </Button>
            </div>
          </>
        )}
      </div>
    </Overlay>
  );
}
