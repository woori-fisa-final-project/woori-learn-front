"use client"; // 클라이언트 컴포넌트로 선언하여 바텀 시트 상호작용을 처리합니다.

import { useEffect, useState, useRef } from "react"; // 비밀번호 입력 상태와 실패 횟수를 관리하기 위해 React 훅을 사용합니다.
import Button from "@/components/common/Button"; // 바텀 시트 하단의 확인 버튼을 렌더링합니다.
import NumericKeypad from "@/components/common/NumericKeypad"; // 숫자 패드 UI를 제공하는 공통 컴포넌트입니다.

const REQUIRED_PASSWORD = "1234"; // 시나리오에서 사용되는 고정 비밀번호 값입니다.

type Scenario5Props = {
  onSuccess: (password: string) => void; // 비밀번호 검증에 성공했을 때 호출되는 콜백입니다. 입력된 비밀번호를 전달합니다.
  onClose: () => void; // 바텀 시트를 닫을 때 실행되는 콜백입니다.
};

export default function Scenario5({ onSuccess, onClose }: Scenario5Props) {
  const [password, setPassword] = useState(""); // 현재 입력 중인 비밀번호 값을 저장합니다.
  const [hasError, setHasError] = useState(false); // 마지막 입력에서 오류가 발생했는지 여부입니다.
  const [failureCount, setFailureCount] = useState(0); // 실패 횟수를 기록하여 사용자에게 노출합니다.
  const timerRef = useRef<NodeJS.Timeout | null>(null); // setTimeout 타이머를 저장하여 cleanup 시 정리합니다.

  useEffect(() => {
    setPassword("");
    setHasError(false);
    setFailureCount(0); // 바텀 시트가 열릴 때마다 상태를 초기화합니다.

    // 컴포넌트 언마운트 시 타이머 정리 (메모리 누수 방지)
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleValueChange = (value: string) => {
    if (value.length > 4) return; // 4자리보다 길어지지 않도록 제한합니다.
    setPassword(value);
    if (hasError) {
      setHasError(false); // 숫자 입력이 다시 시작되면 오류 표시를 제거합니다.
    }

    if (value.length === 4) {
      if (value === REQUIRED_PASSWORD) {
        setFailureCount(0); // 성공하면 실패 횟수를 초기화합니다.
        // 이전 타이머가 있으면 정리
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
        timerRef.current = setTimeout(() => {
          const enteredPassword = value;
          setPassword(""); // 비밀번호 입력을 비우고
          onSuccess(enteredPassword); // 성공 콜백을 실행하며 입력된 비밀번호를 전달합니다.
        }, 120);
      } else {
        setHasError(true); // 오류 메시지를 표시합니다.
        setFailureCount((prev) => prev + 1); // 실패 횟수를 1 증가시킵니다.
        setPassword(""); // 다시 입력할 수 있도록 비밀번호를 초기화합니다.
      }
    }
  };

  const handleSubmit = () => {
    if (password.length < 4) {
      return; // 4자리가 채워지지 않으면 제출하지 않습니다.
    }

    if (password !== REQUIRED_PASSWORD) {
      setHasError(true); // 잘못된 경우 오류 메시지를 표시합니다.
      setFailureCount((prev) => prev + 1); // 실패 횟수를 증가시킵니다.
      setPassword(""); // 다시 입력하도록 비밀번호를 초기화합니다.
      return;
    }

    const enteredPassword = password;
    setFailureCount(0); // 성공 시 실패 횟수를 초기화하고
    setPassword(""); // 비밀번호 입력을 비웁니다.
    onSuccess(enteredPassword); // 성공 콜백을 실행하며 입력된 비밀번호를 전달합니다.
  };

  const handleClose = () => {
    setPassword(""); // 닫을 때 입력값을 초기화합니다.
    setHasError(false); // 오류 상태를 초기화합니다.
    setFailureCount(0); // 실패 횟수를 초기화합니다.
    onClose(); // 상위에서 전달한 닫기 콜백을 호출합니다.
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

