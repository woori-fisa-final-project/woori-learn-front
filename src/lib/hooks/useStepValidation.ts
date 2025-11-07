"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * 계좌 개설 단계별 접근 검증 Hook
 * @param currentStep 현재 단계 번호 (1-8)
 * @param requiredStep 이전 단계에서 완료되어야 하는 단계 번호 (Step1은 검증 불필요)
 */
export function useStepValidation(currentStep: number, requiredStep?: number) {
  const router = useRouter();

  useEffect(() => {
    // Step1은 검증 불필요
    if (currentStep === 1) {
      return;
    }

    // requiredStep이 제공되지 않은 경우, currentStep - 1을 기본값으로 사용
    const required = requiredStep ?? currentStep - 1;

    if (typeof window !== "undefined") {
      const savedStep = Number(localStorage.getItem("accountAuthStep") || 1);
      if (savedStep < required) {
        router.push("/account/open/auth");
        return;
      }
    }
  }, [router, currentStep, requiredStep]);
}

