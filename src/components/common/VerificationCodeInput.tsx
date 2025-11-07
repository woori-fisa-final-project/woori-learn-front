"use client";
import { useState, useEffect } from "react";

interface VerificationCodeInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  timer?: number; // seconds
  maxTimer?: number; // 최대 시간 (기본값 180초 = 3:00)
  onTimerExpire?: () => void;
  onResend?: () => void;
  onExtend?: () => void;
  error?: string;
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
  const [timeLeft, setTimeLeft] = useState(timer || 0);
  const [displayValue, setDisplayValue] = useState("");

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
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/[^0-9]/g, "").slice(0, 6);
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
          {timeLeft > 0 && (
            <span className="text-[13px] text-primary-400 font-normal shrink-0 whitespace-nowrap">
              {formatTime(timeLeft)}
            </span>
          )}
        </div>
        {canExtend && (
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
