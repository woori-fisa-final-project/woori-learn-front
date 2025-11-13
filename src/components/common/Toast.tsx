"use client";

import { useEffect } from "react";

export type ToastType = "success" | "error" | "info" | "warning";

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
}

export default function Toast({
  message,
  type = "info",
  duration = 3000,
  onClose,
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getTypeStyles = () => {
    switch (type) {
      case "success":
        return "bg-green-600 text-white";
      case "error":
        return "bg-red-600 text-white";
      case "warning":
        return "bg-yellow-600 text-white";
      case "info":
      default:
        return "bg-gray-800 text-white";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return "✓";
      case "error":
        return "✕";
      case "warning":
        return "⚠";
      case "info":
      default:
        return "ℹ";
    }
  };

  return (
    <div
      className="fixed bottom-20 left-1/2 z-[9999] -translate-x-1/2 transform animate-fade-in-up"
      role="alert"
      aria-live="polite"
    >
      <div
        className={`flex items-center gap-3 rounded-lg px-6 py-4 shadow-lg ${getTypeStyles()}`}
      >
        <span className="text-lg font-bold">{getIcon()}</span>
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  );
}
