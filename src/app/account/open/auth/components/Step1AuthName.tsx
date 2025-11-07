"use client";
// 본인확인1 - Figma 프레임 기준
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import StepHeader from "@/components/common/StepHeader";
import PageContainer from "@/components/common/PageContainer";
import { useAccountData } from "@/lib/hooks/useAccountData";

interface Step1AuthNameProps {
  onNext: () => void;
}

export default function Step1AuthName({ onNext }: Step1AuthNameProps) {
  const router = useRouter();
  const [realName, setRealName] = useState("");
  const { updateAccountData, accountData } = useAccountData();

  // 기존 데이터가 있으면 불러오기
  useEffect(() => {
    if (accountData.realName) {
      setRealName(accountData.realName);
    }
  }, [accountData.realName]);

  const handleBack = () => {
    router.push("/mypage");
  };

  const handleNext = () => {
    if (realName.trim()) {
      updateAccountData({ realName: realName.trim() });
      onNext();
    }
  };

  const isButtonEnabled = realName.trim().length > 0;

  return (
    <PageContainer>
      <div className="flex flex-col min-h-[calc(100dvh-60px)] w-full justify-between">
        {/* 헤더 및 콘텐츠 영역 */}
        <div className="flex-1 flex flex-col min-h-0">
          <StepHeader
            title="본인확인"
            description="고객님의 이름을 알려주세요"
            onBack={handleBack}
          />

          {/* 이름 입력 필드 */}
          <div className="mt-[32px] w-full">
            <Input
              label="이름"
              type="text"
              placeholder="입력"
              value={realName}
              onChange={(e) => setRealName(e.target.value)}
            />
          </div>
        </div>

        {/* 다음 버튼 */}
        <div 
          className="w-full shrink-0"
          style={{
            paddingBottom: "max(20px, env(safe-area-inset-bottom, 20px))",
          }}
        >
          <Button onClick={handleNext} disabled={!isButtonEnabled}>
            다음
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}
