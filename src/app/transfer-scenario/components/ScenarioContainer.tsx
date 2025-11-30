"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useScenarioHeader } from "@/lib/context/ScenarioHeaderContext";
import { useTransferFlow } from "@/lib/hooks/useTransferFlow";
import Scenario1 from "./Scenario1";
import Scenario2 from "./Scenario2";
import Scenario3 from "./Scenario3";
import Scenario4 from "./Scenario4";
import Scenario5 from "./Scenario5";
import Scenario6 from "./Scenario6";
import Scenario7 from "./Scenario7";

type ScenarioContainerProps = {
  onPracticeNext: (nowStepId: number, answer?: number) => Promise<void> | void;
  onTransferResult?: (result: "success" | "fail") => void;
  engineStepId?: number | null;
  engineNextId?: number | null;
  onExitToMain?: (nextStepId: number | null) => void;
};

  const PRACTICE_TO_UI: Record<number, { step: number; bankSheet?: boolean; passwordSheet?: boolean }> = {
    1015: { step: 1 },
    1016: { step: 2, bankSheet: true },
    1017: { step: 3 },
    1019: { step: 4 },
    1024: { step: 5, passwordSheet: true },
    1026: { step: 6 },
    1028: { step: 7 },
  };

export default function ScenarioContainer({ onPracticeNext, onTransferResult, engineStepId, engineNextId, onExitToMain }: ScenarioContainerProps) {
  const router = useRouter(); // 플로우 종료 시 다른 페이지로 이동하기 위해 사용합니다.
  const { selectedBank, setSelectedBank, resetFlow, accountNumber, amount, setLastErrorType, } = useTransferFlow(); // 공통 이체 상태를 가져오고 초기화합니다.
  const [step, setStep] = useState<number>(1); // 현재 진행 중인 단계(1~7)를 관리합니다.
  const [isBankSheetOpen, setBankSheetOpen] = useState<boolean>(false); // 은행 선택 바텀 시트 열림 여부를 저장합니다.
  const [isPasswordSheetOpen, setPasswordSheetOpen] = useState<boolean>(false); // 비밀번호 입력 바텀 시트 열림 여부를 저장합니다.

  const inFlightRef = useRef(false);
  const handledStepIdRef = useRef<number | null>(null);

  useEffect(() => {
    handledStepIdRef.current = null;
    inFlightRef.current = false;

    if (engineStepId == null) return;
    const ui = PRACTICE_TO_UI[engineStepId];
    if (!ui) return;

    setStep(ui.step);
    setBankSheetOpen(!!ui.bankSheet);
    setPasswordSheetOpen(!!ui.passwordSheet);
  }, [engineStepId]);

  const completePractice = useCallback(
    async (expectedStepId: number, answer?: number) => {
      if (engineStepId == null) return;
      if (engineStepId !== expectedStepId) return;

      if (inFlightRef.current) return;
      if (handledStepIdRef.current === expectedStepId) return;

      inFlightRef.current = true;
      handledStepIdRef.current = expectedStepId;

      try {
        await onPracticeNext(expectedStepId, answer);
      } catch (e) {
        // 실패했으면 다시 시도 가능하게 풀어줌
        handledStepIdRef.current = null;
        throw e;
      } finally {
        inFlightRef.current = false;
      }
    },
    [engineStepId, onPracticeNext]
  );

  const clampedStep = useMemo(() => {
    return Math.min(Math.max(step, 1), 7);
  }, [step]);

  const goToStep = useCallback((target: number) => {
    const next = Math.min(Math.max(target, 1), 7);
    setStep(next);
  }, []);

  const handleReset = useCallback(() => {
    setStep(1); // 단계 상태를 초기화합니다.
    setBankSheetOpen(false); // 은행 선택 시트를 닫습니다.
    setPasswordSheetOpen(false); // 비밀번호 시트를 닫습니다.
    resetFlow(); // 컨텍스트의 플로우 데이터를 초기화합니다.
    setSelectedBank("국민은행"); // 기본 은행으로 되돌립니다.
  }, [resetFlow, setSelectedBank]);

  const handleBackToMain = useCallback(() => {
    handleReset(); // 플로우 상태를 초기화하고
    router.push("/woorimain"); // 메인 화면으로 이동합니다.
  }, [handleReset, router]);

  const { setOnBack } = useScenarioHeader();

  useEffect(() => {
    const handleHeaderBack = () => {
      if (isPasswordSheetOpen) {
        setPasswordSheetOpen(false); // 비밀번호 시트가 열려 있으면 닫고
        goToStep(4); // 금액 입력 단계로 돌아갑니다.
        return;
      }

      if (isBankSheetOpen) {
        setBankSheetOpen(false); // 은행 선택 시트를 닫고
        goToStep(1); // 최초 단계로 이동합니다.
        return;
      }

      if (clampedStep <= 2) {
        handleBackToMain(); // 초기 단계에서는 전체 플로우를 종료합니다.
        return;
      }

      if (clampedStep === 3) {
        goToStep(1); // 계좌 입력 이전 단계로 돌아갑니다.
        return;
      }

      if (clampedStep === 4 || clampedStep === 5) {
        goToStep(3); // 금액 입력 단계에서 계좌 입력 단계로 돌아갑니다.
        return;
      }

      if (clampedStep === 6) {
        goToStep(4); // 확인 단계에서 금액 입력 단계로 돌아갑니다.
        return;
      }

      if (clampedStep === 7) {
        handleReset(); // 완료 단계에서는 플로우를 초기화하고
        router.push("/woorimain"); // 메인 화면으로 이동합니다.
        return;
      }

      goToStep(clampedStep - 1); // 그 외 단계에서는 한 단계 뒤로 이동합니다.
    };

    setOnBack(() => handleHeaderBack); // 헤더 뒤로가기 콜백을 등록합니다.
    return () => setOnBack(null); // 컴포넌트 언마운트 시 콜백을 해제합니다.
  }, [
    clampedStep,
    goToStep,
    handleBackToMain,
    handleReset,
    isBankSheetOpen,
    isPasswordSheetOpen,
    router,
    setOnBack,
  ]);

  return (
    <div className="relative mx-auto flex h-full w-full max-w-[430px] flex-col bg-white">
      <div className="flex flex-1 flex-col px-[20px] pb-[24px]">
        {/* 1~2단계: 계좌 선택 및 추천 탭 */}
        {clampedStep <= 2 && (
          <Scenario1
            onOpenBankSheet={async () => {
              setBankSheetOpen(true);
              goToStep(2);
              // 시나리오 오버레이 코드추가
              await completePractice(1015)
            }}
            onContactTransfer={() => { }}
          />
        )}
        {clampedStep === 3 && (
          <Scenario3
            onNext={async () => {
              // 계좌 번호 입력 후 다음 버튼 클릭 시 다음 페이지로 이동
              goToStep(4);
              // 시나리오 오버레이 코드추가
              await completePractice(1017);
            }}
            onBack={() => goToStep(1)}
          />
        )}
        {(clampedStep === 4 || (clampedStep === 5 && isPasswordSheetOpen)) && (
          <Scenario4
            onNext={async () => {
              // 금액 입력 후 확인 버튼 클릭 시 다음 페이지로 이동
              setPasswordSheetOpen(true);
              goToStep(5);
              // 시나리오 오버레이 코드추가
              await completePractice(1019);
            }}
            onBack={() => goToStep(3)}
          />
        )}
        {clampedStep === 6 && (
          <Scenario6
            onConfirm={async () => {
              const CORRECT_ACCOUNT = "110-123-456789";
              const CORRECT_AMOUNT = 500000;

              // 계좌번호 정규화 (하이픈 제거하여 비교)
              const normalizedAccount = (accountNumber || "").replace(/-/g, "").trim();
              const normalizedCorrectAccount = CORRECT_ACCOUNT.replace(/-/g, "");

              // 금액 비교 (숫자 타입으로 변환하여 비교)
              const numericAmount = Number(amount) || 0;

              const isAccountCorrect = normalizedAccount === normalizedCorrectAccount;
              const isAmountCorrect = numericAmount === CORRECT_AMOUNT;

              // 디버깅: 실제 값 확인
              console.log("이체 검증:", {
                accountNumber,
                normalizedAccount,
                normalizedCorrectAccount,
                isAccountCorrect,
                amount,
                numericAmount,
                CORRECT_AMOUNT,
                isAmountCorrect,
              });

              // ✅ 어디가 틀렸는지 저장
              if (isAccountCorrect && isAmountCorrect) {
                setLastErrorType("none");
              } else if (!isAccountCorrect && isAmountCorrect) {
                setLastErrorType("account");
              } else if (isAccountCorrect && !isAmountCorrect) {
                setLastErrorType("amount");
              } else {
                setLastErrorType("both");
              }

              if (onTransferResult) {
                if (isAccountCorrect && isAmountCorrect) {
                  onTransferResult("success");
                } else {
                  onTransferResult("fail");
                }
              }
            }}
            onReenterAccount={() => goToStep(1)}
            onReenterAmount={() => goToStep(4)}
            onCancel={() => goToStep(1)}
            onBack={() => goToStep(4)}
          />
        )}
        {clampedStep === 7 && (
          <Scenario7
            onRestart={async () => {
              await completePractice(1028);
              onExitToMain?.(engineNextId ?? null);
              handleReset();
            }}
          />
        )}
      </div>

      {/* 은행 선택 시트 */}
      {isBankSheetOpen && (
        <Scenario2
          onClose={() => {
            setBankSheetOpen(false);
            goToStep(1);
          }}
          onSelect={async (bankName) => {
            setSelectedBank(bankName);
            setBankSheetOpen(false);
            goToStep(3);
            // 시나리오 오버레이 코드추가
            await completePractice(1016);
          }}
        />
      )}

      {/* 비밀번호 입력 시트 */}
      {isPasswordSheetOpen && clampedStep === 5 && (
        <Scenario5
          onSuccess={async () => {
            setPasswordSheetOpen(false);
            goToStep(6);
            await completePractice(1024, 0);
          }}
          onMaxFail={async () => {
            setPasswordSheetOpen(false);
            goToStep(4);
            await completePractice(1024, 1);
          }}
          onClose={() => {
            setPasswordSheetOpen(false);
            goToStep(4);
          }}
          maxAttempts={3}
        />
      )}
    </div>
  );
}

