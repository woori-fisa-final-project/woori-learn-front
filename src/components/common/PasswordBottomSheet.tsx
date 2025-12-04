"use client"; // 비밀번호 입력 상태를 관리하므로 클라이언트 전용으로 선언합니다.
import { useState, useEffect } from "react"; // 단계 전환과 비밀번호 상태를 관리합니다.
import NumericKeypad from "@/components/common/NumericKeypad"; // 숫자 입력을 위한 공통 키패드 컴포넌트입니다.

interface PasswordBottomSheetProps {
  isOpen: boolean; // 바텀 시트 열림 여부입니다.
  onClose: () => void; // 사용자가 바깥을 클릭하거나 닫기 동작을 했을 때 호출할 콜백입니다.
  onConfirm: (password: string) => void; // 비밀번호가 두 번 일치했을 때 상위에서 처리할 콜백입니다.
}

export default function PasswordBottomSheet({
  isOpen,
  onClose,
  onConfirm,
}: PasswordBottomSheetProps) {
  const [password, setPassword] = useState(""); // 첫 번째 비밀번호 입력 값입니다.
  const [confirmPassword, setConfirmPassword] = useState(""); // 두 번째 확인 입력 값입니다.
  const [error, setError] = useState(""); // 두 입력이 일치하지 않을 때 보여줄 에러 메시지입니다.
  const [step, setStep] = useState<"password" | "confirm">("password"); // 현재 진행 중인 단계(입력/확인)를 추적합니다.

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
    setPassword(""); // 내부 입력 상태를 초기화합니다.
    setConfirmPassword("");
    setError("");
    setStep("password");
    onClose(); // 바텀 시트를 닫도록 상위 콜백을 호출합니다.
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setError("");
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value); // 확인 단계 입력값을 업데이트합니다.
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
        <p className="text-[16px] text-gray-700 font-medium text-center mb-6">
          {step === "password"
            ? "사용하실 비밀번호 4자리를 입력해주세요."
            : "다시 한번 입력해 주세요."}
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
