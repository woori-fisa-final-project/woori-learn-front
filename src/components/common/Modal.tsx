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
  confirmButtonColor = "bg-primary-400",
  cancelButtonColor = "bg-gray-100",
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
            <p className="text-[16px] text-gray-600 text-center mb-8 w-full">
              {description}
            </p>
            <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
              <button
                onClick={onClose}
                type="button"
                style={{
                  flex: 1,
                  height: '50px',
                  minHeight: '50px',
                  backgroundColor: '#f5f5f5',
                  color: '#4a4a4a',
                  borderRadius: '10px',
                  fontSize: '16px',
                  fontWeight: 400,
                  border: 'none',
                  outline: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                type="button"
                style={{
                  flex: 1,
                  height: '50px',
                  minHeight: '50px',
                  backgroundColor: '#648ddb',
                  color: '#ffffff',
                  borderRadius: '10px',
                  fontSize: '16px',
                  fontWeight: 400,
                  border: 'none',
                  outline: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
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
