/**
 * [SECURITY UPDATE] Gemini feedback 적용
 * - Wrapped localStorage access to avoid trusting tampered client state
 * - Documented requirement for server-side step validation
 */
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// NOTE: Client-side validation is convenience only. Server must re-validate critical flows.
export function useStepValidation(currentStep: number, requiredStep?: number) {
  const router = useRouter();

  useEffect(() => {
    if (currentStep === 1) {
      return;
    }

    const required = requiredStep ?? currentStep - 1;

    if (typeof window === "undefined") {
      return;
    }

    try {
      const savedStep = Number(localStorage.getItem("accountAuthStep") || 1);
      // NOTE: This redirect is for UX only; server-side step validation must gatekeep actual access.
      if (Number.isNaN(savedStep) || savedStep < required) {
        router.push("/account/open/auth");
      }
    } catch (error) {
      console.warn("[useStepValidation] Failed to read accountAuthStep from localStorage:", error);
      // TODO: Fetch authoritative step data from secure API endpoint (e.g. /api/account/auth/step).
      router.push("/account/open/auth");
    }
  }, [router, currentStep, requiredStep]);
}

