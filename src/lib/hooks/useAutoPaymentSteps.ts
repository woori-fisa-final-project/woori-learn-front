import { useState, useEffect, useRef } from "react";

type Step =
  | "account"
  | "form"
  | "amount"
  | "review"
  | "schedule"
  | "confirm"
  | "consent"
  | "complete";

const STEP_PREVIOUS_MAP: Partial<Record<Step, Step>> = {
  form: "account",
  amount: "form",
  review: "amount",
  schedule: "review",
  confirm: "schedule",
  consent: "confirm",
  complete: "consent",
};

/**
 * 자동이체 등록 플로우의 단계 관리를 위한 커스텀 훅
 */
export function useAutoPaymentSteps(
  setOnBack: (callback: (() => void) | null) => void,
  onCancel?: () => void
) {
  const [step, setStep] = useState<Step>("account");
  const stepRef = useRef(step);

  // step 상태가 변할 때마다 ref에 최신 값을 저장
  useEffect(() => {
    stepRef.current = step;
  }, [step]);

  // 뒤로가기 핸들러 설정
  useEffect(() => {
    const handleBack = () => {
      const current = stepRef.current;
      const prevStep = STEP_PREVIOUS_MAP[current];

      if (prevStep) {
        setStep(prevStep);
      } else if (current === "account" && onCancel) {
        onCancel();
      }
    };

    setOnBack(() => handleBack);

    return () => {
      setOnBack(null);
    };
  }, [setOnBack, onCancel]);

  return {
    step,
    setStep,
  };
}
