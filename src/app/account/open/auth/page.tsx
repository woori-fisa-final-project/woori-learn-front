"use client";
import { useState, useEffect } from "react";
import Step1AuthName from "./components/Step1AuthName";
import Step2AuthInfo from "./components/Step2AuthInfo";
import Step3Terms from "./components/Step3Terms";
import Step4Verify from "./components/Step4Verify";
import Step5UserInfo from "./components/Step5UserInfo";
import Step6Agree from "./components/Step6Agree";
import Step7Password from "./components/Step7Password";
import Step8Complete from "./components/Step8Complete";

export default function AccountAuthFlow() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 새로고침 시 항상 Step1부터 시작
    // handleNext()에서만 localStorage 업데이트하므로 여기서는 읽지 않음
    if (typeof window !== "undefined") {
      setIsLoading(false);
    }
  }, []);

  const handleNext = (nextStep: number) => {
    if (nextStep >= 1 && nextStep <= 8) {
      setStep(nextStep);
      // handleNext()에서만 localStorage 업데이트
      if (typeof window !== "undefined") {
        localStorage.setItem("accountAuthStep", String(nextStep));
      }
    }
  };

  const handleBack = (prevStep: number) => {
    if (prevStep >= 1) {
      setStep(prevStep);
      // 뒤로가기 시에는 localStorage 업데이트하지 않음
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    );
  }

  return (
    <>
      {step === 1 && <Step1AuthName onNext={() => handleNext(2)} />}
      {step === 2 && (
        <Step2AuthInfo
          onNext={() => handleNext(3)}
          onBack={() => handleBack(1)}
        />
      )}
      {step === 3 && (
        <Step3Terms onNext={() => handleNext(4)} onBack={() => handleBack(2)} />
      )}
      {step === 4 && (
        <Step4Verify
          onNext={() => handleNext(5)}
          onBack={() => handleBack(3)}
        />
      )}
      {step === 5 && (
        <Step5UserInfo
          onNext={() => handleNext(6)}
          onBack={() => handleBack(4)}
        />
      )}
      {step === 6 && (
        <Step6Agree onNext={() => handleNext(7)} onBack={() => handleBack(5)} />
      )}
      {step === 7 && (
        <Step7Password
          onNext={() => handleNext(8)}
          onBack={() => handleBack(6)}
        />
      )}
      {step === 8 && <Step8Complete />}
    </>
  );
}

