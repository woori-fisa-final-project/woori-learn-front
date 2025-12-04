/**
 * [SECURITY UPDATE] Gemini feedback 적용
 * - Wrapped localStorage access to avoid trusting tampered client state
 * - Documented requirement for server-side step validation
 */
"use client"; // 클라이언트 전용 훅이므로 브라우저 환경에서만 실행되도록 지정합니다.
import { useEffect } from "react"; // 단계 검증 로직을 컴포넌트 생명주기에 맞춰 실행하기 위해 useEffect를 사용합니다.
import { useRouter } from "next/navigation"; // 잘못된 단계 접근 시 지정된 라우트로 이동시키기 위해 라우터를 사용합니다.

// NOTE: Client-side validation is convenience only. Server must re-validate critical flows.
export function useStepValidation(currentStep: number, requiredStep?: number) { // 계좌 개설 단계 접근을 제한하는 커스텀 훅입니다.
  const router = useRouter(); // 필요 시 이전 단계로 돌려보내기 위해 라우터를 초기화합니다.

  useEffect(() => { // 컴포넌트가 렌더링될 때마다 현재 단계가 올바른지 검증합니다.
    if (currentStep === 1) { // 첫 번째 단계에서는 별도의 검증 없이 통과시킵니다.
      return;
    }

    const required = requiredStep ?? currentStep - 1; // 명시적으로 요구 단계가 주어지지 않으면 직전 단계를 기준으로 검증합니다.

    if (typeof window === "undefined") {
      return;
    }

    try {
      const savedStep = Number(localStorage.getItem("accountAuthStep") || 1); // localStorage에 저장된 사용자의 진행 단계를 읽어옵니다.
      // NOTE: This redirect is for UX only; server-side step validation must gatekeep actual access.
      if (Number.isNaN(savedStep) || savedStep < required) {
        router.push("/account/open/auth"); // 저장된 단계가 부족하거나 잘못된 경우 인증 첫 단계로 돌려보냅니다.
      }
    } catch (error) {
      console.warn("[useStepValidation] Failed to read accountAuthStep from localStorage:", error);
      // TODO: Fetch authoritative step data from secure API endpoint (e.g. /api/account/auth/step).
      router.push("/account/open/auth"); // localStorage 접근에 실패해도 보안을 위해 첫 단계로 이동시킵니다.
    }
  }, [router, currentStep, requiredStep]);
}

