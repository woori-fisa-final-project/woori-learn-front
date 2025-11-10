"use client";
// 본인확인2 - Figma 프레임 기준
import { useState, useEffect } from "react";
import Button from "@/components/common/Button";
import StepHeader from "@/components/common/StepHeader";
import PageContainer from "@/components/common/PageContainer";
import { useAccountData } from "@/lib/hooks/useAccountData";
import { useStepValidation } from "@/lib/hooks/useStepValidation";

interface Step2AuthInfoProps {
  onNext: () => void;
  onBack: () => void;
}

export default function Step2AuthInfo({ onNext, onBack }: Step2AuthInfoProps) {
  const { accountData, updateAccountData } = useAccountData();
  const [birthDate, setBirthDate] = useState("");
  const [genderCode, setGenderCode] = useState("");
  const [phoneCarrier, setPhoneCarrier] = useState("SKT");
  const [phoneNumber, setPhoneNumber] = useState("");

  // 이전 단계 통과 여부 검증
  useStepValidation(2);

  useEffect(() => {
    if (accountData.birthDate) setBirthDate(accountData.birthDate);
    if (accountData.genderCode) setGenderCode(accountData.genderCode);
    if (accountData.phoneCarrier) setPhoneCarrier(accountData.phoneCarrier);
    if (accountData.phoneNumber) setPhoneNumber(accountData.phoneNumber);
  }, [accountData]);

  const handleBirthDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 6);
    setBirthDate(value);
  };

  const handleGenderCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^1-4]/g, "").slice(0, 1);
    setGenderCode(value);
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 11);
    setPhoneNumber(value);
  };

  const handleCarrierChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPhoneCarrier(e.target.value);
  };

  const handleNext = () => {
    if (isFormValid()) {
      updateAccountData({
        birthDate,
        genderCode,
        phoneCarrier,
        phoneNumber,
      });
      onNext();
    }
  };

  const isFormValid = () => {
    return (
      birthDate.length === 6 &&
      genderCode.length === 1 &&
      phoneCarrier &&
      phoneNumber.length >= 10
    );
  };

  return (
    <PageContainer>
      <div className="flex flex-col min-h-[calc(100dvh-60px)] w-full justify-between">
        {/* 헤더 및 콘텐츠 영역 */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="flex-shrink-0">
            <StepHeader
              title="본인확인"
              description={
                <>
                  이용 중인 통신사 정보와
                  <br />
                  휴대폰번호를 입력해 주세요
                </>
              }
              onBack={onBack}
            />
          </div>

          {/* 스크롤 가능한 콘텐츠 영역 */}
          <div className="flex-1 overflow-y-auto min-h-0">
            {/* 휴대폰 번호 입력 */}
            <div className="mt-[28px] w-full flex flex-col gap-[8px]">
              <label className="text-[16px] text-gray-600 font-medium leading-[25px]">
                휴대폰 번호
              </label>
              <div className="bg-white border border-gray-300 rounded-[15px] h-[64px] flex items-center px-5">
                <div className="flex items-center gap-3 flex-1">
                  {/* 통신사 선택 드롭다운 */}
                  <div className="relative flex-shrink-0">
                    <select
                      value={phoneCarrier}
                      onChange={handleCarrierChange}
                      className="text-[16px] text-gray-700 font-medium bg-transparent outline-none border-none cursor-pointer appearance-none pr-6"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 6L11 1' stroke='%2373787C' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right center",
                      }}
                    >
                      <option value="SKT">SKT</option>
                      <option value="KT">KT</option>
                      <option value="LGU+">LGU+</option>
                    </select>
                  </div>
                  {/* 전화번호 입력 */}
                  <input
                    type="tel"
                    placeholder="입력"
                    value={phoneNumber}
                    onChange={handlePhoneNumberChange}
                    className="flex-1 text-[16px] text-gray-600 font-medium placeholder:text-gray-400 outline-none min-w-0"
                  />
                </div>
              </div>
            </div>

            {/* 생년월일 및 성별 입력 */}
            <div className="mt-4 w-full flex flex-col gap-[8px]">
              <label className="text-[16px] text-gray-600 font-medium leading-[25px]">
                생년월일
              </label>
              <div className="bg-white border border-gray-300 rounded-[15px] h-[64px] flex items-center px-5">
                <div className="flex items-center gap-2 w-full">
                  {/* 생년월일 입력 (6자리) */}
                  <input
                    type="text"
                    placeholder="000000"
                    value={birthDate}
                    onChange={handleBirthDateChange}
                    className="text-[16px] text-gray-600 font-medium outline-none"
                    style={{
                      width: "100px",
                      fontFamily: "Pretendard, sans-serif",
                    }}
                    maxLength={6}
                  />
                  {/* 구분선 */}
                  <span className="text-gray-400 text-[14px]">-</span>
                  {/* 성별 입력 (1자리) */}
                  <input
                    type="text"
                    placeholder="0"
                    value={genderCode}
                    onChange={handleGenderCodeChange}
                    className="text-[16px] text-gray-600 font-medium outline-none"
                    style={{
                      width: "10px",
                      fontFamily: "Pretendard, sans-serif",
                    }}
                    maxLength={1}
                  />
                  {/* 마스킹 텍스트 */}
                  <span
                    className="text-[12px] text-gray-500 font-medium ml-3"
                    style={{ fontFamily: "Pretendard, sans-serif" }}
                  >
                    ●●●●●●
                  </span>
                </div>
              </div>
            </div>

            {/* 이름 표시 (읽기 전용) */}
            {accountData.realName && (
              <div className="mt-4 w-full flex flex-col gap-[8px] pb-4">
                <label className="text-[16px] text-gray-600 font-medium leading-[25px]">
                  이름
                </label>
                <div className="bg-white border border-gray-300 rounded-[15px] h-[64px] flex items-center px-5">
                  <p className="text-[16px] text-gray-600 font-medium">
                    {accountData.realName}
                  </p>
                </div>
              </div>
            )}
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
            다음
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}
