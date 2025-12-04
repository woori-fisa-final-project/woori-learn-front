"use client";
import { useState } from "react";
import Button from "@/components/common/Button";
import StepHeader from "@/components/common/StepHeader";
import PageContainer from "@/components/common/PageContainer";
import PasswordBottomSheet from "@/components/common/PasswordBottomSheet";
import { useAccountData } from "@/lib/hooks/useAccountData";
import { useStepValidation } from "@/lib/hooks/useStepValidation";
import Image from "next/image";

interface Step7PasswordProps {
  onNext: () => void;
  onBack: () => void;
}

export default function Step7Password({
  onNext,
  onBack,
}: Step7PasswordProps) {
  const { updateAccountData } = useAccountData();
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  // 이전 단계 통과 여부 검증
  useStepValidation(7);

  const handlePasswordRegister = () => {
    setIsBottomSheetOpen(true);
  };

  const handlePasswordConfirm = (password: string) => {
    updateAccountData({ accountPassword: password });
    setIsBottomSheetOpen(false);
    onNext();
  };

  return (
    <PageContainer>
      <div className="flex flex-col min-h-[calc(100dvh-60px)] w-full justify-between">
        {/* 헤더 및 콘텐츠 영역 */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="flex-shrink-0">
            <StepHeader
              title="입출금계좌 개설"
              description={
                <>
                  WON통장 개설을 위해
                  <br />
                  계좌 비밀번호를 등록해주세요
                </>
              }
              onBack={onBack}
            />
          </div>

          {/* 콘텐츠 영역 */}
          <div className="flex-1 flex flex-col min-h-0">
            {/* 비밀번호 등록 안내 */}
            <div className="mt-[28px] w-full space-y-3">
              <div className="flex items-start gap-2">
                <div className="w-[4px] h-[4px] rounded-full bg-gray-400 mt-2"></div>
                <p className="text-[14px] text-gray-700 font-normal flex-1">
                  금융 사기로 인한 고객님의 피해를 최소화하기 위해 비밀번호를
                  설정합니다.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-[4px] h-[4px] rounded-full bg-gray-400 mt-2"></div>
                <p className="text-[14px] text-gray-700 font-normal flex-1">
                  새로 개설한 입출금계좌는 별도 비밀번호를 설정해야 합니다.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-[4px] h-[4px] rounded-full bg-gray-400 mt-2"></div>
                <p className="text-[14px] text-gray-700 font-normal flex-1">
                  장기미사용으로 인해 이체거래가 제한될 수 있습니다.
                </p>
              </div>
            </div>

            {/* 비밀번호 배경 이미지 */}
            <div className="flex-1 flex items-center justify-center mt-8">
              <Image
                src="/images/passwordbackimg.png"
                alt="비밀번호"
                className="w-full max-w-[300px] object-contain"
                width={300}
                height={300}
              />
            </div>
          </div>
        </div>

        {/* 비밀번호 등록 버튼 */}
        <div 
          className="w-full shrink-0"
          style={{
            paddingBottom: "max(20px, env(safe-area-inset-bottom, 20px))",
          }}
        >
          <Button onClick={handlePasswordRegister}>비밀번호 등록하기</Button>
        </div>

        {/* 비밀번호 바텀시트 */}
        <PasswordBottomSheet
          isOpen={isBottomSheetOpen}
          onClose={() => setIsBottomSheetOpen(false)}
          onConfirm={handlePasswordConfirm}
        />
      </div>
    </PageContainer>
  );
}
