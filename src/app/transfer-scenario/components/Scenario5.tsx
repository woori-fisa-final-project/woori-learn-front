"use client"; // 클라이언트 컴포넌트로 선언하여 바텀 시트 상호작용을 처리합니다.

import { useEffect, useState } from "react"; // 비밀번호 입력 상태와 실패 횟수를 관리하기 위해 React 훅을 사용합니다.
import NumericKeypad from "@/components/common/NumericKeypad"; // 숫자 패드 UI를 제공하는 공통 컴포넌트입니다.

const REQUIRED_PASSWORD = "1234"; // 시나리오에서 사용되는 고정 비밀번호 값입니다.
const MAX_ATTEMPTS = 3;

type Scenario5Props = {
  onSuccess: (password: string) => void | Promise<void>; // 비밀번호 검증에 성공했을 때 호출되는 콜백입니다. 입력된 비밀번호를 전달합니다.
  onMaxFail: (failureCount: number) => void | Promise<void>;
  onClose: () => void; // 바텀 시트를 닫을 때 실행되는 콜백입니다.
  maxAttempts?: number;
};

export default function Scenario5({ onSuccess, onMaxFail, onClose, maxAttempts = MAX_ATTEMPTS, }: Scenario5Props) {
  const [password, setPassword] = useState(""); // 현재 입력 중인 비밀번호 값을 저장합니다.
  const [hasError, setHasError] = useState(false); // 마지막 입력에서 오류가 발생했는지 여부입니다.
  const [failureCount, setFailureCount] = useState(0); // 실패 횟수를 기록하여 사용자에게 노출합니다.
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    setPassword("");
    setHasError(false);
    setFailureCount(0);
    setLocked(false);
  }, []);


  const handleClose = () => {
    setPassword("");
    setHasError(false);
    setFailureCount(0);
    setLocked(false);
    onClose();
  };

  const handleWrong = async () => {
    const nextCount = failureCount + 1;

    setHasError(true);
    setPassword("");
    setFailureCount(nextCount);

    if (nextCount >= maxAttempts) {
      setLocked(true);
      await onMaxFail(nextCount);
    }
  };

  const handleValueChange = async (value: string) => {
    if (locked) return;

    if (value.length > 4) return;     // 4자리보다 길어지지 않도록 제한합니다.

    setPassword(value);
    if (hasError) setHasError(false); // 숫자 입력이 다시 시작되면 오류 표시를 제거합니다.

    if (value.length !== 4) return;

    if (value === REQUIRED_PASSWORD) {
      const entered = value;
      setPassword("");
      setFailureCount(0);
      setHasError(false);
      await onSuccess(entered);
    } else {
      void handleWrong();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          handleClose(); // 바깥 영역을 클릭하면 시트를 닫습니다.
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
        </div>
      </div>
    </div>
  );
}

