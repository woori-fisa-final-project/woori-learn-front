"use client";

import { useEffect, useState } from "react";
import Button from "@/components/common/Button";
import NumericKeypad from "@/components/common/NumericKeypad";

const REQUIRED_PASSWORD = "1234";

type Scenario5Props = {
  onSuccess: () => void;
  onClose: () => void;
};

export default function Scenario5({ onSuccess, onClose }: Scenario5Props) {
  const [password, setPassword] = useState("");
  const [hasError, setHasError] = useState(false);
  const [failureCount, setFailureCount] = useState(0);

  useEffect(() => {
    setPassword("");
    setHasError(false);
    setFailureCount(0);
  }, []);

  const handleValueChange = (value: string) => {
    if (value.length > 4) return;
    setPassword(value);
    if (hasError) {
      setHasError(false);
    }

    if (value.length === 4) {
      if (value === REQUIRED_PASSWORD) {
        setFailureCount(0);
        setTimeout(() => {
          setPassword("");
          onSuccess();
        }, 120);
      } else {
        setHasError(true);
        setFailureCount((prev) => prev + 1);
        setPassword("");
      }
    }
  };

  const handleSubmit = () => {
    if (password.length < 4) {
      return;
    }

    if (password !== REQUIRED_PASSWORD) {
      setHasError(true);
      setFailureCount((prev) => prev + 1);
      setPassword("");
      return;
    }

    setFailureCount(0);
    setPassword("");
    onSuccess();
  };

  const handleClose = () => {
    setPassword("");
    setHasError(false);
    setFailureCount(0);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          handleClose();
        }
      }}
    >
      <div
        className="w-full max-w-[430px] rounded-t-[32px] bg-white"
        onClick={(event) => event.stopPropagation()}
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
            {hasError && (
              <p className="mt-[16px] text-center text-[13px] font-medium text-[#D63333]">
                비밀번호가 올바르지 않습니다. (실패 {failureCount}회)
              </p>
            )}
          </div>

          <div className="mt-[28px]">
            <Button onClick={handleSubmit} disabled={password.length < 4}>
              확인
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

