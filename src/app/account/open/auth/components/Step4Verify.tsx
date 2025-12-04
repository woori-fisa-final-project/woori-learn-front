"use client";
// 본인확인4 - Figma 프레임 기준
import { useState } from "react";
import Button from "@/components/common/Button";
import StepHeader from "@/components/common/StepHeader";
import PageContainer from "@/components/common/PageContainer";
import VerificationCodeInput from "@/components/common/VerificationCodeInput";
import { useStepValidation } from "@/lib/hooks/useStepValidation";

interface Step4VerifyProps {
  onNext: () => void;
  onBack: () => void;
}

export default function Step4Verify({ onNext, onBack }: Step4VerifyProps) {
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(180); // 3분 = 180초
  const MAX_TIMER = 180; // 최대 3분

  // 이전 단계 통과 여부 검증
  useStepValidation(4);

  const handleVerify = () => {
    // 임시 검증: 123456 입력 시 성공
    if (verificationCode === "123456") {
      onNext();
    } else {
      setError("인증번호가 올바르지 않습니다.");
    }
  };

  const handleResend = () => {
    setTimer(180);
    setVerificationCode("");
    setError("");
    // 재요청 로직
  };

  const handleExtend = () => {
    // VerificationCodeInput 내부에서 시간을 관리하므로 여기서는 timer를 업데이트하여 동기화
    setTimer((prev) => {
      const newTime = Math.min(prev + 60, MAX_TIMER);
      return newTime;
    });
  };

  const handleTimerExpire = () => {
    setError("인증 시간이 만료되었습니다. 다시 요청해주세요.");
  };

  const isButtonEnabled = verificationCode.length === 6;

  return (
    <PageContainer>
      <div className="flex flex-col min-h-[calc(100dvh-60px)] w-full justify-between">
        {/* 헤더 및 콘텐츠 영역 */}
        <div className="flex-1 flex flex-col min-h-0">
          <StepHeader
            title="본인확인"
            description={
              <>
                문자메시지로받은
                <br />
                인증번호 6자리를 입력해 주세요
              </>
            }
            onBack={onBack}
          />

          {/* 인증번호 입력 */}
          <div className="mt-[32px] w-full">
            <VerificationCodeInput
              value={verificationCode}
              onChange={(value) => {
                setVerificationCode(value);
                setError("");
              }}
              timer={timer}
              maxTimer={MAX_TIMER}
              onTimerExpire={handleTimerExpire}
              onResend={handleResend}
              onExtend={handleExtend}
              error={error}
            />
          </div>
        </div>

        {/* 인증 버튼 */}
        <div 
          className="w-full shrink-0"
          style={{
            paddingBottom: "max(20px, env(safe-area-inset-bottom, 20px))",
          }}
        >
          <Button onClick={handleVerify} disabled={!isButtonEnabled}>
            인증하기
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}
