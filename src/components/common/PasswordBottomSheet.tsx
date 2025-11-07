"use client";
import { useState, useEffect } from "react";
import NumericKeypad from "@/components/common/NumericKeypad";

interface PasswordBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (password: string) => void;
}

export default function PasswordBottomSheet({
  isOpen,
  onClose,
  onConfirm,
}: PasswordBottomSheetProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState<"password" | "confirm">("password");

  // 비밀번호가 4자리 입력되면 자동으로 다음 단계로 이동
  useEffect(() => {
    if (step === "password" && password.length === 4) {
      setError("");
      // 약간의 딜레이 후 다음 단계로 이동
      const timer = setTimeout(() => {
        setStep("confirm");
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [password, step]);

  // 비밀번호 확인이 4자리 입력되면 자동으로 확인 처리
  useEffect(() => {
    if (step === "confirm" && confirmPassword.length === 4) {
      if (password !== confirmPassword) {
        setError("비밀번호가 일치하지 않습니다.");
        return;
      }
      setError("");
      // 약간의 딜레이 후 확인 처리
      const timer = setTimeout(() => {
        onConfirm(password);
        // 초기화
        setPassword("");
        setConfirmPassword("");
        setError("");
        setStep("password");
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [confirmPassword, password, step, onConfirm]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleClose = () => {
    setPassword("");
    setConfirmPassword("");
    setError("");
    setStep("password");
    onClose();
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setError("");
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    setError("");
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 transition-opacity duration-300"
      onClick={handleOverlayClick}
    >
      <div
        className="bg-white rounded-t-[20px] w-full max-w-[min(100%,_430px)] sm:max-w-[480px] md:max-w-[560px] lg:max-w-[768px] p-6 animate-slideUp max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-[20px] text-gray-700 font-semibold mb-2">
          계좌 비밀번호 등록
        </h2>
        <p className="text-[14px] text-gray-500 mb-6">
          {step === "password"
            ? "4자리 숫자 비밀번호를 입력해주세요"
            : "비밀번호를 한 번 더 입력해주세요"}
        </p>

        {step === "password" ? (
          <>
            {/* 비밀번호 입력 키패드 */}
            <NumericKeypad
              value={password}
              maxLength={4}
              onValueChange={handlePasswordChange}
            />

            {/* 에러 메시지 */}
            {error && (
              <p className="mt-4 text-[12px] text-red-500 text-center" role="alert">
                {error}
              </p>
            )}
          </>
        ) : (
          <>
            {/* 비밀번호 확인 키패드 */}
            <NumericKeypad
              value={confirmPassword}
              maxLength={4}
              onValueChange={handleConfirmPasswordChange}
            />

            {/* 에러 메시지 */}
            {error && (
              <p className="mt-4 text-[12px] text-red-500 text-center" role="alert">
                {error}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
