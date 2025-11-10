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
  const router = useRouter();
  const { selectedBank, setSelectedBank, resetFlow } = useTransferFlow();
  const [step, setStep] = useState<number>(1);
  const [isBankSheetOpen, setBankSheetOpen] = useState<boolean>(false);
  const [isPasswordSheetOpen, setPasswordSheetOpen] = useState<boolean>(false);

  const clampedStep = useMemo(() => {
    return Math.min(Math.max(step, 1), 7);
  }, [step]);

  const goToStep = useCallback((target: number) => {
    const next = Math.min(Math.max(target, 1), 7);
    setStep(next);
  }, []);

  const handleReset = useCallback(() => {
    setStep(1);
    setBankSheetOpen(false);
    setPasswordSheetOpen(false);
    resetFlow();
    setSelectedBank("국민은행");
  }, [resetFlow, setSelectedBank]);

  const handleBackToMain = useCallback(() => {
    handleReset();
    router.push("/woorimain");
  }, [handleReset, router]);

  const { setOnBack } = useScenarioHeader();

  useEffect(() => {
    const handleHeaderBack = () => {
      if (isPasswordSheetOpen) {
        setPasswordSheetOpen(false);
        goToStep(4);
        return;
      }

      if (isBankSheetOpen) {
        setBankSheetOpen(false);
        goToStep(1);
        return;
      }

      if (clampedStep <= 2) {
        handleBackToMain();
        return;
      }

      if (clampedStep === 3) {
        goToStep(1);
        return;
      }

      if (clampedStep === 4 || clampedStep === 5) {
        goToStep(3);
        return;
      }

      if (clampedStep === 6) {
        goToStep(4);
        return;
      }

      if (clampedStep === 7) {
        handleReset();
        router.push("/woorimain");
        return;
      }

      goToStep(clampedStep - 1);
    };

    setOnBack(() => handleHeaderBack);
    return () => {
      setOnBack(null);
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

