"use client";
// 시작하기 - Figma 프레임 기준
import { useState, useEffect } from "react";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import StepHeader from "@/components/common/StepHeader";
import PageContainer from "@/components/common/PageContainer";
import { useAccountData } from "@/lib/hooks/useAccountData";
import { useStepValidation } from "@/lib/hooks/useStepValidation";

// 휴대폰 번호 마스킹 처리 (가운데 자리만 마스킹)
const maskPhoneNumber = (phoneNumber: string): string => {
  if (!phoneNumber) return "";
  // 숫자만 추출
  const numbers = phoneNumber.replace(/[^0-9]/g, "");
  if (numbers.length === 11) {
    // 010-1234-5678 -> 010-****-5678
    return `${numbers.slice(0, 3)}-****-${numbers.slice(7)}`;
  }
  if (numbers.length === 10) {
    // 010-123-4567 -> 010-***-4567
    return `${numbers.slice(0, 3)}-***-${numbers.slice(6)}`;
  }
  if (numbers.length > 3) {
    // 기타 길이: 앞 3자리 유지, 나머지 중간 자리 마스킹
    const prefix = numbers.slice(0, 3);
    const suffixLength = Math.min(4, Math.max(numbers.length - 3, 0));
    const suffix = numbers.slice(-suffixLength);
    const middleLength = Math.max(numbers.length - (3 + suffixLength), 0);
    const middle = "*".repeat(middleLength || 1);
    return `${prefix}-${middle}-${suffix}`;
  }
  return numbers;
};

interface Step5UserInfoProps {
  onNext: () => void;
  onBack: () => void;
}

export default function Step5UserInfo({ onNext, onBack }: Step5UserInfoProps) {
  const { accountData, updateAccountData } = useAccountData();
  const [englishName, setEnglishName] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  // 이전 단계 통과 여부 검증
  useStepValidation(5);

  useEffect(() => {
    if (accountData.email) {
      setEmail(accountData.email);
    }
    if (accountData.englishName) {
      setEnglishName(accountData.englishName);
    }
  }, [accountData]);

  // 영문 이름 입력 핸들러 (영어만 허용)
  const handleEnglishNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // 영어 대소문자와 공백만 허용
    const englishOnly = value.replace(/[^a-zA-Z\s]/g, "");
    setEnglishName(englishOnly);
  };

  // 이메일 입력 핸들러 (이메일 양식 검증)
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    
    // 실시간 이메일 양식 검증
    if (value.trim().length > 0) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        setEmailError("올바른 이메일 형식을 입력해주세요.");
      } else {
        setEmailError("");
      }
    } else {
      setEmailError("");
    }
  };

  const handleNext = () => {
    if (isFormValid()) {
      updateAccountData({
        englishName: englishName.trim(),
        email: email.trim(),
      });
      onNext();
    }
  };

  const isFormValid = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return (
      englishName.trim().length > 0 &&
      email.trim().length > 0 &&
      emailRegex.test(email.trim()) &&
      !emailError
    );
  };

  const maskedPhoneNumber = maskPhoneNumber(accountData.phoneNumber || "");

  return (
    <PageContainer>
      <div className="flex flex-col min-h-[calc(100dvh-60px)] w-full justify-between">
        {/* 헤더 및 콘텐츠 영역 */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="flex-shrink-0">
            <StepHeader
              title="시작하기"
              description={
                <>
                  비대면 금융거래를 위해
                  <br />
                  고객님의 정보를 입력해주세요
                </>
              }
              onBack={onBack}
            />
          </div>

          {/* 스크롤 가능한 콘텐츠 영역 */}
          <div className="flex-1 overflow-y-auto min-h-0">
            {/* 영문명 입력 */}
            <div className="mt-[28px] w-full">
              <Input
                label="영문 이름"
                type="text"
                placeholder="영어 이름을 작성해주세요"
                value={englishName}
                onChange={handleEnglishNameChange}
              />
            </div>

            {/* 전화번호 표시 (읽기 전용) */}
            {accountData.phoneNumber && (
              <div className="mt-4 w-full flex flex-col gap-[8px]">
                <label className="text-[16px] text-gray-600 font-medium leading-[25px]">
                  휴대폰 번호
                </label>
                <div className="bg-white border border-gray-300 rounded-[15px] h-[64px] flex items-center px-5">
                  <p className="text-[16px] text-gray-600 font-medium">
                    {maskedPhoneNumber}
                  </p>
                </div>
              </div>
            )}

            {/* 이메일 입력 */}
            <div className="mt-4 w-full pb-4">
              <Input
                label="이메일"
                type="email"
                placeholder="이메일을 입력해주세요"
                value={email}
                onChange={handleEmailChange}
                aria-invalid={!!emailError}
              />
              {emailError && (
                <p className="mt-2 text-[12px] text-red-500" role="alert">
                  {emailError}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 다음 버튼 */}
        <div 
          className="w-full shrink-0"
          style={{
            paddingBottom: "max(20px, env(safe-area-inset-bottom, 20px))",
          }}
        >
          <Button onClick={handleNext} disabled={!isFormValid()}>
            모두 입력했어요
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}
