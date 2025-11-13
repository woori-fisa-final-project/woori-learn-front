"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import Toast, { type ToastType } from "@/components/common/Toast";

interface ToastContextValue {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showWarning: (message: string) => void;
  showInfo: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

interface ToastState {
  message: string;
  type: ToastType;
  duration: number;
  isVisible: boolean;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState>({
    message: "",
    type: "info",
    duration: 3000,
    isVisible: false,
  });

  const showToast = useCallback((message: string, type: ToastType = "info", duration: number = 3000) => {
    setToast({
      message,
      type,
      duration,
      isVisible: true,
    });
  }, []);

  const showSuccess = useCallback((message: string) => {
    showToast(message, "success");
  }, [showToast]);

  const showError = useCallback((message: string) => {
    showToast(message, "error", 4000); // 에러는 조금 더 길게
  }, [showToast]);

  const showWarning = useCallback((message: string) => {
    showToast(message, "warning");
  }, [showToast]);

  const showInfo = useCallback((message: string) => {
    showToast(message, "info");
  }, [showToast]);

  const handleClose = useCallback(() => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  }, []);

  return (
    <ToastContext.Provider
      value={{
        showToast,
        showSuccess,
        showError,
        showWarning,
        showInfo,
      }}
    >
      {children}
      {toast.isVisible && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={handleClose}
        />
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
