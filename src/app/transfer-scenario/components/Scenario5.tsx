"use client";

import { useEffect, useState, useRef } from "react";
import Button from "@/components/common/Button";
import NumericKeypad from "@/components/common/NumericKeypad";
import { useTransferFlow } from "@/lib/hooks/useTransferFlow";

/**
 * ------------------------------------------------------------------
 * [Scenario 5] 계좌 비밀번호 입력 모달
 * : 송금 최종 단계 직전, 보안을 위해 계좌 비밀번호 4자리를 입력받습니다.
 * ------------------------------------------------------------------
 */

type Scenario5Props = {
  /** 비밀번호 검증 성공 시 실행될 콜백 (다음 시나리오로 이동) */
  onSuccess: () => void;
  /** 모달 닫기 버튼 또는 배경 클릭 시 실행될 콜백 */
  onClose: () => void;
};

export default function Scenario5({ onSuccess, onClose }: Scenario5Props) {
  // 전역 상태에서 '출금 계좌번호'와 '비밀번호 저장 함수' 가져오기
  const { sourceAccountNumber, setEnteredPassword } = useTransferFlow();

  /**
   * ----------------------------------------------------------------
   * State & Ref 관리
   * ----------------------------------------------------------------
   */
  const [password, setPassword] = useState("");       // 현재 입력된 비밀번호 (4자리)
  const [hasError, setHasError] = useState(false);    // 비밀번호 불일치 에러 상태
  const [failureCount, setFailureCount] = useState(0); // 비밀번호 틀린 횟수 카운트
  
  // 성공 시 딜레이를 주기 위한 타이머 Ref (메모리 누수 방지용)
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 컴포넌트 언마운트 시 타이머 정리 (Cleanup)
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  /**
   * ----------------------------------------------------------------
   * API 통신
   * ----------------------------------------------------------------
   * transactions-password
   * ----------------------------------------------------------------
   */
  
  /** * 백엔드 비밀번호 검증 요청 
   * @param pw 사용자가 입력한 4자리 비밀번호
   */
  const validatePasswordFromBackend = async (pw: string) => {
  try {
    // 출금 계좌번호(내 계좌) 하이픈 제거
    const rawAccount = sourceAccountNumber.replace(/\D/g, "");

    console.log("🔍 rawAccount:", rawAccount);
    console.log("🔍 sourceAccountNumber:", sourceAccountNumber);


    const res = await fetch("http://localhost:8080/education/accounts/transactions-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        accountNumber: rawAccount, // 반드시 출금 계좌
        password: pw,              // 입력받은 비밀번호
      }),
    });

    if (!res.ok) return false;

    const json = await res.json();

    return json.code === 200 && json.data === true;
  } catch (err) {
    console.error("비밀번호 검증 실패:", err);
    return false;
  }
};


  /**
   * ----------------------------------------------------------------
   * Event Handlers
   * ----------------------------------------------------------------
   */

  /** * 숫자 키패드 입력 처리 핸들러 
   * : 4자리가 입력되면 자동으로 검증 로직을 수행합니다.
   */
  const handleValueChange = async (value: string) => {
    if (value.length > 4) return; // 4자리 초과 입력 방지
    setPassword(value);

    // 입력이 시작되면 에러 상태 초기화
    if (hasError) setHasError(false);

    // 4자리가 모두 입력되었을 때 자동 검증 시작
    if (value.length === 4) {
      const isValid = await validatePasswordFromBackend(value);

      if (isValid) {
        // 1. 검증 성공: 전역 상태에 비밀번호 저장
        setEnteredPassword(value);

        // 2. UX를 위해 약간의 딜레이(150ms) 후 성공 콜백 실행
        timerRef.current = setTimeout(() => {
          setPassword(""); // 보안을 위해 로컬 상태 초기화
          onSuccess();
        }, 150);
      } else {
        // 1. 검증 실패: 에러 표시 및 실패 횟수 증가
        setHasError(true);
        setFailureCount((prev) => prev + 1);
        setPassword(""); // 입력 필드 초기화
      }
    }
  };

  /** * [확인] 버튼 클릭 핸들러 
   * : 보통 4자리 입력 시 자동 수행되지만, 수동 클릭을 위한 예비 로직입니다.
   */
  const handleSubmit = async () => {
    if (password.length < 4) return;

    const isValid = await validatePasswordFromBackend(password);
    
    if (!isValid) {
      setHasError(true);
      setFailureCount((prev) => prev + 1);
      setPassword("");
      return;
    }

    setEnteredPassword(password);
    setPassword("");
    onSuccess();
  };

  /** * 모달 닫기 핸들러 
   * : 상태를 모두 초기화하고 부모 컴포넌트에 닫힘을 알립니다.
   */
  const handleClose = () => {
    setPassword("");
    setHasError(false);
    setFailureCount(0);
    onClose();
  };

  /**
   * ----------------------------------------------------------------
   * UI Render
   * ----------------------------------------------------------------
   */
  return (
    // 1. 배경 (Backdrop) - 클릭 시 모달 닫힘
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40"
      onClick={(event) => {
        // 배경(dimmed 영역)을 직접 클릭했을 때만 닫기 (내부 클릭 무시)
        if (event.target === event.currentTarget) {
          handleClose();
        }
      }}
    >
      {/* 2. 모달 컨텐츠 (Bottom Sheet 스타일) */}
      <div
        className="w-full max-w-[430px] rounded-t-[32px] bg-white"
        onClick={(e) => e.stopPropagation()} // 배경 클릭 이벤트 전파 방지
      >
        {/* 2-1. 헤더 (닫기 버튼) */}
        <header className="flex items-center justify-between px-[20px] pt-[24px]">
          <button
            type="button"
            onClick={handleClose}
            className="flex h-[32px] w-[32px] items-center justify-center text-[18px] text-gray-500"
            aria-label="닫기"
          >
            ✕
          </button>
        </header>

        {/* 2-2. 본문 영역 */}
        <div className="mt-[12px] px-[20px] pb-[32px]">
          <section className="text-center">
            <h2 className="text-[22px] font-semibold text-gray-900">
              계좌 비밀번호를 입력해주세요
            </h2>
            <p className="mt-[10px] text-[13px] text-gray-500">
              숫자 4자리 비밀번호를 입력하면 이체가 완료돼요.
            </p>
          </section>

          {/* 2-3. 보안 키패드 및 에러 메시지 */}
          <div className="mt-[28px]">
            <NumericKeypad
              value={password}
              onValueChange={handleValueChange}
              shuffleNumbers // 보안을 위해 숫자 배열 랜덤 섞기
            />

            {hasError && (
              <p className="mt-[16px] text-center text-[13px] font-medium text-[#D63333]">
                비밀번호가 올바르지 않습니다. (실패 {failureCount}회)
              </p>
            )}
          </div>

          {/* 2-4. 하단 액션 버튼 */}
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