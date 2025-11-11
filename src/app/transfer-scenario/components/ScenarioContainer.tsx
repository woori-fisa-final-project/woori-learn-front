"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useScenarioHeader } from "@/lib/context/ScenarioHeaderContext";
import { useTransferFlow } from "@/lib/hooks/useTransferFlow";
import Scenario1 from "./Scenario1";
import Scenario2 from "./Scenario2";
import Scenario3 from "./Scenario3";
import Scenario4 from "./Scenario4";
import Scenario5 from "./Scenario5";
import Scenario6 from "./Scenario6";
import Scenario7 from "./Scenario7";

export default function ScenarioContainer() {
  const router = useRouter(); // 플로우 종료 시 다른 페이지로 이동하기 위해 사용합니다.
  const { selectedBank, setSelectedBank, resetFlow } = useTransferFlow(); // 공통 이체 상태를 가져오고 초기화합니다.
  const [step, setStep] = useState<number>(1); // 현재 진행 중인 단계(1~7)를 관리합니다.
  const [isBankSheetOpen, setBankSheetOpen] = useState<boolean>(false); // 은행 선택 바텀 시트 열림 여부를 저장합니다.
  const [isPasswordSheetOpen, setPasswordSheetOpen] = useState<boolean>(false); // 비밀번호 입력 바텀 시트 열림 여부를 저장합니다.

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
    return () => {
      setOnBack(null); // 컴포넌트 언마운트 시 콜백을 해제합니다.
    };
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
            onOpenBankSheet={() => {
              setBankSheetOpen(true);
              goToStep(2);
            }}
            onContactTransfer={() => {}}
          />
        )}
        {clampedStep === 3 && (
          <Scenario3 onNext={() => goToStep(4)} onBack={() => goToStep(1)} />
        )}
        {(clampedStep === 4 || (clampedStep === 5 && isPasswordSheetOpen)) && (
          <Scenario4
            onNext={() => {
              setPasswordSheetOpen(true);
              goToStep(5);
            }}
            onBack={() => goToStep(3)}
          />
        )}
        {clampedStep === 6 && (
          <Scenario6
            onConfirm={() => goToStep(7)}
            onReenterAccount={() => goToStep(1)}
            onReenterAmount={() => goToStep(4)}
            onCancel={() => goToStep(1)}
            onBack={() => goToStep(4)}
          />
        )}
        {clampedStep === 7 && (
          <Scenario7
            onRestart={() => {
              handleReset();
              router.push("/woorimain");
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
          onSelect={(bankName) => {
            setSelectedBank(bankName);
            setBankSheetOpen(false);
            goToStep(3);
          }}
        />
      )}

      {/* 비밀번호 입력 시트 */}
      {isPasswordSheetOpen && clampedStep === 5 && (
        <Scenario5
          onSuccess={() => {
            setPasswordSheetOpen(false);
            goToStep(6);
          }}
          onClose={() => {
            setPasswordSheetOpen(false);
            goToStep(4);
          }}
        />
      )}
    </div>
  );
}

