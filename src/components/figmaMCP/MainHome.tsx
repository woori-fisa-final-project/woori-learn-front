"use client";
import { useRouter } from "next/navigation";

const logoImage = "/images/logo.png";
const accountImage = "/images/account-image.png";
const utilityImage = "/images/utility-image.png";
const savingsImage = "/images/savings-image.png";
const loanImage = "/images/loan-image.png";
const profileIcon = "/images/profile-icon.svg";
const checkIcon = "/images/check-icon.svg";

function ProgressBarType2Complete() {
  return (
    <div className="bg-white rounded-[10px] p-6 flex items-center justify-between">
      <div className="flex flex-col items-center gap-0.5 w-12">
        <div className="bg-[#0043ce] rounded-full w-5 h-5 flex items-center justify-center p-0.5">
          <img alt="체크" className="w-full h-full" src={checkIcon} />
        </div>
        <p className="text-[12px] text-[#666] text-center">계좌이체</p>
      </div>
      <div className="flex-1 h-px bg-[#0043ce] mx-2" />
      <div className="flex flex-col items-center gap-0.5 w-12">
        <div className="bg-[#0043ce] rounded-full w-5 h-5 flex items-center justify-center p-0.5">
          <img alt="체크" className="w-full h-full" src={checkIcon} />
        </div>
        <p className="text-[12px] text-[#666] text-center">공과금</p>
      </div>
      <div className="flex-1 h-px bg-[#0043ce] mx-2" />
      <div className="flex flex-col items-center gap-0.5 w-12">
        <div className="bg-[#0043ce] rounded-full w-5 h-5 flex items-center justify-center p-0.5">
          <img alt="체크" className="w-full h-full" src={checkIcon} />
        </div>
        <p className="text-[12px] text-[#666] text-center">예/적금</p>
      </div>
      <div className="flex-1 h-px bg-[#0043ce] mx-2" />
      <div className="flex flex-col items-center gap-0.5 w-12">
        <div className="bg-[#0043ce] rounded-full w-5 h-5 flex items-center justify-center p-0.5">
          <img alt="체크" className="w-full h-full" src={checkIcon} />
        </div>
        <p className="text-[12px] text-[#666] text-center">대출</p>
      </div>
      <div className="flex-1 h-px bg-[#0043ce] mx-2" />
      <div className="flex flex-col items-center gap-0.5 w-12">
        <div className="bg-[#10b981] rounded-full w-5 h-5 flex items-center justify-center p-0.5">
          <img alt="체크" className="w-full h-full" src={checkIcon} />
        </div>
        <p className="text-[12px] text-[#10b981] text-center">마무리 퀴즈</p>
      </div>
    </div>
  );
}

export default function MainHome() {
  const router = useRouter();

  const handleProfileClick = () => {
    router.push("/mypage/profile");
  };

  return (
    <div className="bg-white relative w-full min-h-screen max-w-[390px] w-full mx-auto px-[20px] pt-[60px] flex flex-col items-center justify-start">
      {/* Logo */}
      <div className="relative w-[100px] h-[58px]">
        <img
          alt="로고"
          className="w-full h-full object-contain"
          src={logoImage}
        />
      </div>

      {/* Profile Section */}
      <div className="flex items-center justify-end mt-[13px] w-full">
        <button
          onClick={handleProfileClick}
          className="flex flex-col items-center gap-1 cursor-pointer"
        >
          <div className="w-7 h-7 relative">
            <img alt="프로필" className="w-full h-full" src={profileIcon} />
          </div>
          <p className="text-[12px] text-[#999]">내 정보</p>
        </button>
      </div>

      {/* Service Cards Grid */}
      <div className="mt-[103px] grid grid-cols-2 gap-3">
        {/* 계좌 조회/이체 */}
        <div className="bg-[#2677cc] border border-[#729fdc] rounded-[10px] p-4 h-[109px] relative">
          <img
            alt="계좌 조회"
            className="absolute bottom-4 right-4 w-[66px] h-[59px] object-contain"
            src={accountImage}
          />
          <p className="text-[18px] text-[#bbd2ed] font-semibold leading-tight">
            계좌 조회/
            <br />
            이체
          </p>
        </div>

        {/* 공과금 */}
        <div className="bg-[#1164c9] border border-[#6393d9] rounded-[8px] p-4 h-[108px] relative">
          <img
            alt="공과금"
            className="absolute bottom-4 right-4 w-[60px] h-[83px] object-contain"
            src={utilityImage}
          />
          <p className="text-[18px] text-[#c6eaec] font-semibold leading-tight">공과금</p>
        </div>

        {/* 예/적금 */}
        <div className="bg-[#f5f4e8] border border-[#e8e7db] rounded-[10px] p-4 h-[108px] relative">
          <img
            alt="예적금"
            className="absolute bottom-4 right-4 w-[58px] h-[90px] object-contain"
            src={savingsImage}
          />
          <p className="text-[18px] text-[#605f55] font-semibold">예/적금</p>
        </div>

        {/* 대출 */}
        <div className="bg-[#1164c9] border border-[#729fdc] rounded-[8px] p-4 h-[108px] relative">
          <img
            alt="대출"
            className="absolute bottom-4 right-4 w-[67px] h-[76px] object-contain"
            src={loanImage}
          />
          <p className="text-[18px] text-[#bbd2ed] font-semibold leading-tight">대출</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-[155px]">
        <ProgressBarType2Complete />
      </div>

      {/* 전체 달성률 */}
      <div className="mt-[20px]">
        <h2 className="text-[18px] text-[#4a4a4a] font-bold">전체 달성률</h2>
      </div>

      {/* 교육별 진행도 */}
      <div className="mt-[58px]">
        <h2 className="text-[18px] text-[#4a4a4a] font-bold mb-[21px]">교육별 진행도</h2>
        
        {/* 거래내역 조회 */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-[14px] text-[#4a4a4a] font-semibold">거래내역 조회</p>
          <p className="text-[12px] text-black">50%</p>
        </div>
        <div className="bg-[#f5f5f5] rounded-full h-2 flex">
          {/* TODO: 진행률 바를 동적으로 변경 - style={{ width: `${progress}%` }} 형태로 수정 필요 */}
          <div className="bg-[#648ddb] rounded-full h-full w-[190px]" />
        </div>

        {/* 공과금 */}
        <div className="flex items-center justify-between mt-4 mb-4">
          <p className="text-[14px] text-[#4a4a4a] font-semibold">공과금</p>
          <p className="text-[12px] text-black">100%</p>
        </div>
        <div className="bg-[#f5f5f5] rounded-full h-2 flex">
          {/* TODO: 진행률 바를 동적으로 변경 - style={{ width: `${progress}%` }} 형태로 수정 필요 */}
          <div className="bg-[#648ddb] rounded-full h-full w-[169px]" />
        </div>

        {/* 예/적금 */}
        <div className="flex items-center justify-between mt-4 mb-4">
          <p className="text-[14px] text-[#4a4a4a] font-semibold">예/적금</p>
          <p className="text-[12px] text-black">100%</p>
        </div>
        <div className="bg-[#f5f5f5] rounded-full h-2 flex">
          {/* TODO: 진행률 바를 동적으로 변경 - style={{ width: `${progress}%` }} 형태로 수정 필요 */}
          <div className="bg-[#648ddb] rounded-full h-full w-[114px]" />
        </div>

        {/* 대출 */}
        <div className="flex items-center justify-between mt-4 mb-4">
          <p className="text-[14px] text-[#4a4a4a] font-semibold">대출</p>
          <p className="text-[12px] text-black">100%</p>
        </div>
        <div className="bg-[#f5f5f5] rounded-full h-2 flex">
          {/* TODO: 진행률 바를 동적으로 변경 - style={{ width: `${progress}%` }} 형태로 수정 필요 */}
          <div className="bg-[#648ddb] rounded-full h-full w-full" />
        </div>
      </div>
    </div>
  );
}
