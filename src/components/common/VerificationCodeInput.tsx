"use client"; // 인증번호 입력과 타이머를 브라우저에서 제어하므로 클라이언트 전용입니다.
import { useState, useEffect } from "react"; // 타이머와 입력 상태를 관리하기 위해 React 훅을 사용합니다.

interface VerificationCodeInputProps {
  value: string; // 외부에서 관리되는 인증번호 값입니다.
  onChange: (value: string) => void; // 입력이 변경될 때 부모로 값을 전달하는 콜백입니다.
  label?: string; // 입력 필드 위에 표시할 레이블입니다.
  timer?: number; // seconds
  maxTimer?: number; // 최대 시간 (기본값 180초 = 3:00)
  onTimerExpire?: () => void; // 타이머가 종료되었을 때 호출되는 콜백입니다.
  onResend?: () => void; // 인증번호를 재요청할 때 호출되는 콜백입니다.
  onExtend?: () => void; // 시간이 연장될 때 호출되는 콜백입니다.
  error?: string; // 입력 오류 메시지입니다.
}

export default function VerificationCodeInput({
  value,
  onChange,
  label = "인증번호",
  timer,
  maxTimer = 180, // 최대 3분
  onTimerExpire,
  onResend,
  onExtend,
  error,
}: VerificationCodeInputProps) {
  const [timeLeft, setTimeLeft] = useState(timer || 0); // 현재 남은 시간을 초 단위로 관리합니다.
  const [displayValue, setDisplayValue] = useState(""); // 내부 입력 필드에 표시할 값입니다.

  useEffect(() => {
    if (timer !== undefined) {
      setTimeLeft(timer);
    }
  }, [timer]);

  useEffect(() => {
    setDisplayValue(value);
  }, [value]);

  useEffect(() => {
    if (timeLeft > 0) {
      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            onTimerExpire?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timeLeft, onTimerExpire]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`; // 남은 시간을 mm:ss 형식으로 변환합니다.
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/[^0-9]/g, "").slice(0, 6); // 숫자만 허용하고 6자리로 제한합니다.
    setDisplayValue(inputValue);
    onChange(inputValue);
  };

  const handleExtend = () => {
    if (onExtend && timeLeft > 0 && timeLeft < maxTimer) {
      // 최대 시간을 넘지 않도록 체크
      const newTime = Math.min(timeLeft + 60, maxTimer);
      // 부모 컴포넌트에 알리고, timer prop이 업데이트되면 내부 timeLeft도 자동 업데이트됨
      onExtend();
      // 즉시 UI 업데이트를 위해 내부 상태도 업데이트
      setTimeLeft(newTime);
    }
  };

  const canExtend = timeLeft > 0 && timeLeft < maxTimer;

  return (
    <div className="w-full flex flex-col gap-[8px]">
      {label && (
        <label className="text-[16px] text-gray-600 font-medium leading-[25px]">
          {label}
        </label>
      )}
      <div className="bg-white border border-gray-300 rounded-[15px] h-[64px] flex items-center px-5">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <input
            type="text"
            inputMode="numeric"
            value={displayValue}
            onChange={handleInputChange}
            placeholder="인증번호 6자리"
            className="flex-1 text-[16px] text-gray-600 font-medium placeholder:text-gray-400 outline-none min-w-0"
            maxLength={6}
          />
          {timeLeft > 0 && ( // 남은 시간이 존재할 때만 타이머를 표시합니다.
            <span className="text-[13px] text-primary-400 font-normal shrink-0 whitespace-nowrap">
              {formatTime(timeLeft)}
            </span>
          )}
        </div>
        {canExtend && ( // 남은 시간이 있고 최대 시간 미만일 때만 연장 버튼을 노출합니다.
          <button
            onClick={handleExtend}
            className="bg-gray-100 rounded-[6px] h-[32px] px-3 text-[12px] text-gray-600 font-normal ml-2 shrink-0 whitespace-nowrap hover:bg-gray-200 transition-colors"
          >
            시간연장
          </button>
        )}
      </div>
      {error && (
        <p className="text-[12px] text-red-500 mt-1" role="alert">
          {error}
        </p>
      )}
      {onResend && (
        <button
          onClick={onResend}
          className="text-[15px] text-gray-500 underline hover:text-gray-700 transition-colors mt-1"
        >
          재요청하기
        </button>
      )}
    </div>
  );
}
