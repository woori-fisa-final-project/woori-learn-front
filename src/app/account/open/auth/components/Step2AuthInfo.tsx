"use client"; // 클라이언트 컴포넌트로 상태와 브라우저 API를 사용할 수 있도록 지정합니다.
// 본인확인2 - Figma 프레임 기준
import { useState, useEffect } from "react"; // 입력값을 관리하고 초기 데이터를 세팅하기 위해 React 훅을 사용합니다.
import Button from "@/components/common/Button"; // 하단의 다음 버튼에 사용할 공통 버튼 컴포넌트입니다.
import StepHeader from "@/components/common/StepHeader"; // 단계 제목과 설명을 표시하는 공통 헤더입니다.
import PageContainer from "@/components/common/PageContainer"; // 페이지 레이아웃과 여백을 감싸는 공통 컨테이너입니다.
import { useAccountData } from "@/lib/hooks/useAccountData"; // 계좌 개설 플로우 데이터를 공유하는 커스텀 훅입니다.
import { useStepValidation } from "@/lib/hooks/useStepValidation"; // 이전 단계가 완료되었는지 검증하는 훅입니다.

interface Step2AuthInfoProps {
  onNext: () => void; // 현재 단계가 완료되면 다음 단계로 이동시키는 콜백입니다.
  onBack: () => void; // 상단 뒤로가기 버튼에서 호출할 콜백입니다.
}

export default function Step2AuthInfo({ onNext, onBack }: Step2AuthInfoProps) {
  const { accountData, updateAccountData } = useAccountData(); // 컨텍스트에서 저장된 값을 가져오고 업데이트할 수 있게 합니다.
  const [birthDate, setBirthDate] = useState(""); // 주민등록번호 앞 6자리(생년월일)를 저장합니다.
  const [genderCode, setGenderCode] = useState(""); // 주민등록번호 뒤 첫 번째 자리(성별 코드)를 저장합니다.
  const [phoneCarrier, setPhoneCarrier] = useState("SKT"); // 기본 통신사 값을 SKT로 설정합니다.
  const [phoneNumber, setPhoneNumber] = useState(""); // 휴대폰 번호 입력값을 저장합니다.

  useStepValidation(2);

  useEffect(() => {
    if (accountData.birthDate) setBirthDate(accountData.birthDate); // 저장된 생년월일이 있으면 입력값을 복원합니다.
    if (accountData.genderCode) setGenderCode(accountData.genderCode); // 저장된 성별 코드가 있으면 채워 넣습니다.
    if (accountData.phoneCarrier) setPhoneCarrier(accountData.phoneCarrier); // 이전에 선택한 통신사가 있으면 그대로 사용합니다.
    if (accountData.phoneNumber) setPhoneNumber(accountData.phoneNumber); // 저장된 전화번호가 있으면 입력 필드에 반영합니다.
  }, [accountData]);

  const handleBirthDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 6); // 숫자만 허용하고 6자리까지 입력을 제한합니다.
    setBirthDate(value); // 상태에 생년월일(YYMMDD)을 저장합니다.
  };

  const handleGenderCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^1-4]/g, "").slice(0, 1); // 주민번호 뒷자리 첫 번째 숫자만 입력받습니다.
    setGenderCode(value); // 성별 코드를 상태로 저장합니다.
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 11); // 하이픈 없는 숫자만 허용하고 11자리까지 제한합니다.
    setPhoneNumber(value); // 휴대폰 번호를 상태에 저장합니다.
  };

  const handleCarrierChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPhoneCarrier(e.target.value); // 통신사 선택값을 상태에 저장합니다.
  };

  const handleNext = () => {
    if (isFormValid()) {
      updateAccountData({
        birthDate,
        genderCode,
        phoneCarrier,
        phoneNumber,
      }); // 모든 입력값을 컨텍스트에 저장합니다.
      onNext(); // 검증 통과 시 다음 단계로 이동합니다.
    }
  };

  const isFormValid = () => {
    return (
      birthDate.length === 6 &&
      genderCode.length === 1 &&
      phoneCarrier &&
      phoneNumber.length >= 10
    ); // 기본 입력 검증: 생년월일 6자리, 성별 1자리, 전화번호 10자리 이상, 통신사 선택 여부를 확인합니다.
  };

  return (
    // PageContainer를 사용해 공통 레이아웃과 패딩을 적용합니다.
    <PageContainer>
      <div className="flex flex-col min-h-[calc(100dvh-60px)] w-full justify-between">
        {/* 헤더 및 콘텐츠 영역 */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {/* StepHeader는 항상 위에 고정되도록 flex-shrink-0으로 감쌉니다. */}
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
