"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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

  const goToStep = (target: number) => {
    const next = Math.min(Math.max(target, 1), 7);
    setStep(next);
  };

  const handleReset = () => {
    setStep(1);
    setBankSheetOpen(false);
    setPasswordSheetOpen(false);
    resetFlow();
    setSelectedBank("국민은행");
  };

  const handleBackToMain = () => {
    handleReset();
    router.push("/woorimain");
  };

  return (
    <div className="relative mx-auto flex min-h-[100dvh] w-full max-w-[430px] flex-col bg-white">
      <main className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto px-[20px] pt-[60px]">
          {clampedStep <= 2 && (
            <Scenario1
              onOpenBankSheet={() => {
                setBankSheetOpen(true);
                goToStep(2);
              }}
              onContactTransfer={() => {}}
              onBack={handleBackToMain}
            />
          )}
          {clampedStep === 3 && (
            <Scenario3
              onNext={() => goToStep(4)}
              onBack={() => goToStep(1)}
            />
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
      </main>

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

