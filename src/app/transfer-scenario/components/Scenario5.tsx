"use client";

import { useCallback, useEffect, useRef, useState } from "react"; // 비밀번호 입력 상태와 실패 횟수를 관리하기 위해 React 훅을 사용합니다.
import NumericKeypad from "@/components/common/NumericKeypad"; // 숫자 패드 UI를 제공하는 공통 컴포넌트입니다.
import { useTransferFlow } from "@/lib/hooks/useTransferFlow";
import axiosInstance from "@/utils/axiosInstance";

const MAX_ATTEMPTS = 3; // 최대 시도 횟수 기본값

type Scenario5Props = {
  onSuccess: (password: string) => void | Promise<void>; // 비밀번호 검증에 성공했을 때 호출되는 콜백입니다. 입력된 비밀번호를 전달합니다.
  onClose: () => void; // 바텀 시트를 닫을 때 실행되는 콜백입니다.
  onMaxFail?: (failureCount: number) => void | Promise<void>;  // 실패 횟수가 최대치에 도달했을 때 호출
  maxAttempts?: number;
};

export default function Scenario5({ onSuccess, onMaxFail, onClose, maxAttempts = MAX_ATTEMPTS, }: Scenario5Props) {
  const { sourceAccountNumber } = useTransferFlow();
  const [password, setPassword] = useState(""); // 현재 입력 중인 비밀번호 값을 저장합니다.
  const [hasError, setHasError] = useState(false); // 마지막 입력에서 오류가 발생했는지 여부입니다.
  const [failureCount, setFailureCount] = useState(0); // 실패 횟수를 기록하여 사용자에게 노출합니다.
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /** 최초 마운트 시 상태 초기화 */
  useEffect(() => {
    setPassword("");
    setHasError(false);
    setFailureCount(0);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const validatePasswordFromBackend = useCallback(
    async (pw: string) => {
      if (!sourceAccountNumber) {
        console.error("출금 계좌 번호가 유효하지 않습니다.");
        return false;
      }
      try {
        const rawAccount = sourceAccountNumber.replace(/\D/g, "");
        const res = await axiosInstance.post("/education/accounts/transactions-password-verification", {
          accountNumber: rawAccount,
          password: pw
        });
        const { code, data } = res.data;
        return code === 200 && data === true;
      } catch (err) {
        console.error("비밀번호 검증 실패:", err);
        return false;
      }
    }, [sourceAccountNumber]);

  /**오답 처리
   * - 실패 횟수 + 1, 오류 표시/입력값 초기화
   * - 실패 횟수가 maxAttempts 이상이면 onMaxFail 호출
   */
  const handleWrong = useCallback(async () => {
    const nextCount = failureCount + 1;

    setHasError(true);
    setPassword("");
    setFailureCount(nextCount);

    if (nextCount >= maxAttempts) {
      await onMaxFail?.(nextCount);
    }
  }, [failureCount, maxAttempts, onMaxFail]);

  const handleClose = () => {
    setPassword("");
    setHasError(false);
    setFailureCount(0);
    onClose();
  };

  const handleValueChange = useCallback(
    async (value: string) => {
      if (value.length > 4) return;     // 4자리보다 길어지지 않도록 제한합니다.

      setPassword(value);
      if (hasError) setHasError(false); // 숫자 입력이 다시 시작되면 오류 표시를 제거합니다.

      if (value.length !== 4) return; // 4자리 되기 전엔 판정하지 않고 대기

      const isValid = await validatePasswordFromBackend(value);

      if (isValid) {
        setFailureCount(0);
        setHasError(false);

        if (timerRef.current) clearTimeout(timerRef.current);

        // (기존 브랜치의 120ms 딜레이 유지)
        timerRef.current = setTimeout(() => {
          const entered = value;
          setPassword("");
          void onSuccess(entered);
        }, 120);
      } else {
        void handleWrong();
      }
    },
    [hasError, validatePasswordFromBackend, onSuccess, handleWrong]
  );


  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        className="w-full max-w-[430px] rounded-t-[32px] bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between px-[20px] pt-[24px]">
          <span className="text-[16px] font-semibold text-gray-900"></span>
          <button
            type="button"
            onClick={handleClose}
            className="flex h-[32px] w-[32px] items-center justify-center text-[18px] text-gray-500"
            aria-label="닫기"
          >
            ✕
          </button>
        </header>

        <div className="mt-[12px] px-[20px] pb-[32px]">
          <section className="text-center">
            <h2 className="text-[22px] font-semibold text-gray-900">
              계좌 비밀번호를 입력해주세요
            </h2>
            <p className="mt-[10px] text-[13px] text-gray-500">
              숫자 4자리 비밀번호를 입력하면 이체가 완료돼요.
            </p>
          </section>

          <div className="mt-[28px]">
            <NumericKeypad
              value={password}
              onValueChange={handleValueChange}
              shuffleNumbers
            />
            {/* 오답일 경우 오류 문구 노출 */}
            {hasError && (
              <p className="mt-[16px] text-center text-[13px] font-medium text-[#D63333]">
                비밀번호가 올바르지 않습니다. (실패 {failureCount}회)
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}