"use client";
import React from "react";
import Overlay from "./Overlay";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  confirmText: string;
  cancelText?: string;
  onConfirm: () => void;
  confirmButtonColor?: string;
  cancelButtonColor?: string;
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
  confirmButtonColor = "bg-[#648DDB]",
  cancelButtonColor = "bg-[#f5f5f5]",
  children,
}: ModalProps) {
  return (
    <Overlay isOpen={isOpen} onClose={onClose}>
      <div className="bg-white rounded-[20px] w-[350px] mx-auto p-6 animate-slideDown">
        {children ? (
          children
        ) : (
          <>
            <h2 className="text-[20px] text-[#414141] font-semibold text-center mb-6">
              {title}
            </h2>
            <p className="text-[16px] text-[#4a4a4a] text-center mb-8 w-full">
              {description}
            </p>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className={`flex-1 h-[50px] ${cancelButtonColor} rounded-[10px] text-[16px] text-[#4a4a4a] font-regular`}
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                className={`flex-1 h-[50px] ${confirmButtonColor} rounded-[10px] text-[16px] text-white font-regular`}
              >
                {confirmText}
              </button>
            </div>
          </>
        )}
      </div>
    </Overlay>
  );
}
