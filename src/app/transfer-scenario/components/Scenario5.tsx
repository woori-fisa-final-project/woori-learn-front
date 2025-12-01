"use client";

import { useEffect, useState, useRef } from "react";
import Button from "@/components/common/Button";
import NumericKeypad from "@/components/common/NumericKeypad";
import { useTransferFlow } from "@/lib/hooks/useTransferFlow";
import axiosInstance from "@/utils/axiosInstance";

type Scenario5Props = {
  // 비밀번호 문자열을 받아야 하므로 타입을 명시합니다.
  onSuccess: (password: string) => void;
  onClose: () => void;
};

export default function Scenario5({ onSuccess, onClose }: Scenario5Props) {
  const { sourceAccountNumber } = useTransferFlow();4

  const [password, setPassword] = useState("");
  const [hasError, setHasError] = useState(false);
  const [failureCount, setFailureCount] = useState(0);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setPassword("");
    setHasError(false);
    setFailureCount(0);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

    const validatePasswordFromBackend = async (pw: string) => {
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
  };

  const handleValueChange = async (value: string) => {
    if (value.length > 4) return;
    
    setPassword(value); 

    if (hasError) setHasError(false);

    if (value.length === 4) {
      // 검증할 때도 최신 값(value) 사용
      const isValid = await validatePasswordFromBackend(value);

      if (isValid) {
        setFailureCount(0);
        if (timerRef.current) clearTimeout(timerRef.current);
        
        timerRef.current = setTimeout(() => {

          console.log("Scenario5 -> 부모에게 전달:", value);
          
          setPassword(""); 
          onSuccess(value); 
        }, 120);
      } else {
        setHasError(true);
        setFailureCount((prev) => prev + 1);
        setPassword("");
      }
    }
  };

  const handleSubmit = async () => {
    if (password.length < 4) return;

    const isValid = await validatePasswordFromBackend(password);
    
    if (!isValid) {
      setHasError(true);
      setFailureCount((prev) => prev + 1);
      setPassword("");
      return;
    }

    // 제출 시점에는 이미 입력이 끝났으므로 password 상태를 써도 안전하지만
    // 확실하게 지역 변수에 담아서 보냅니다.
    const finalPassword = password;
    
    setFailureCount(0);
    setPassword("");
    
    console.log("Scenario5(수동) -> 부모에게 전달:", finalPassword);
    onSuccess(finalPassword);
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