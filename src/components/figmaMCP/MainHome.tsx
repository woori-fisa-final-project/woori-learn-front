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
    <div className="bg-white rounded-[10px] p-6 flex items-center justify-between w-full overflow-x-hidden">
      <div className="flex flex-col items-center gap-0.5 w-12 shrink-0">
        <div className="bg-primary-700 rounded-full w-5 h-5 flex items-center justify-center p-0.5">
          <img alt="체크" className="w-full h-full object-contain" src={checkIcon} />
        </div>
        <p className="text-[12px] text-gray-500 text-center">계좌이체</p>
      </div>
      <div className="flex-1 h-px bg-primary-700 mx-2 min-w-0" />
      <div className="flex flex-col items-center gap-0.5 w-12 shrink-0">
        <div className="bg-primary-700 rounded-full w-5 h-5 flex items-center justify-center p-0.5">
          <img alt="체크" className="w-full h-full object-contain" src={checkIcon} />
        </div>
        <p className="text-[12px] text-gray-500 text-center">공과금</p>
      </div>
      <div className="flex-1 h-px bg-primary-700 mx-2 min-w-0" />
      <div className="flex flex-col items-center gap-0.5 w-12 shrink-0">
        <div className="bg-primary-700 rounded-full w-5 h-5 flex items-center justify-center p-0.5">
          <img alt="체크" className="w-full h-full object-contain" src={checkIcon} />
        </div>
        <p className="text-[12px] text-gray-500 text-center">예/적금</p>
      </div>
      <div className="flex-1 h-px bg-primary-700 mx-2 min-w-0" />
      <div className="flex flex-col items-center gap-0.5 w-12 shrink-0">
        <div className="bg-primary-700 rounded-full w-5 h-5 flex items-center justify-center p-0.5">
          <img alt="체크" className="w-full h-full object-contain" src={checkIcon} />
        </div>
        <p className="text-[12px] text-gray-500 text-center">대출</p>
      </div>
      <div className="flex-1 h-px bg-primary-700 mx-2 min-w-0" />
      <div className="flex flex-col items-center gap-0.5 w-12 shrink-0">
        <div className="bg-green-500 rounded-full w-5 h-5 flex items-center justify-center p-0.5">
          <img alt="체크" className="w-full h-full object-contain" src={checkIcon} />
        </div>
        <p className="text-[12px] text-green-500 text-center">마무리 퀴즈</p>
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
    <main className="bg-white min-h-screen flex flex-col items-center overflow-x-hidden">
      <div className="w-full max-w-[390px] mx-auto px-[20px] pt-[60px]">
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
              <img alt="프로필" className="w-full h-full object-contain" src={profileIcon} />
            </div>
            <p className="text-[12px] text-gray-400">내 정보</p>
          </button>
        </div>

        {/* Service Cards Grid */}
        <div className="mt-[103px] grid grid-cols-2 gap-3 w-full">
          {/* 계좌 조회/이체 */}
          <div className="bg-primary-500 border border-primary-300 rounded-[10px] p-4 h-[109px] relative overflow-hidden">
            <img
              alt="계좌 조회"
              className="absolute bottom-4 right-4 w-[66px] h-[59px] object-contain max-w-[calc(100%-1rem)]"
              src={accountImage}
            />
            <p className="text-[18px] text-primary-200 font-semibold leading-tight">
              계좌 조회/
              <br />
              이체
            </p>
          </div>

          {/* 공과금 */}
          <div className="bg-primary-800 border border-primary-300 rounded-[8px] p-4 h-[108px] relative overflow-hidden">
            <img
              alt="공과금"
              className="absolute bottom-4 right-4 w-[60px] h-[83px] object-contain max-w-[calc(100%-1rem)]"
              src={utilityImage}
            />
            <p className="text-[18px] text-primary-100 font-semibold leading-tight">공과금</p>
          </div>

          {/* 예/적금 */}
          <div className="bg-gray-50 border border-gray-200 rounded-[10px] p-4 h-[108px] relative overflow-hidden">
            <img
              alt="예적금"
              className="absolute bottom-4 right-4 w-[58px] h-[90px] object-contain max-w-[calc(100%-1rem)]"
              src={savingsImage}
            />
            <p className="text-[18px] text-gray-700 font-semibold">예/적금</p>
          </div>

          {/* 대출 */}
          <div className="bg-primary-800 border border-primary-300 rounded-[8px] p-4 h-[108px] relative overflow-hidden">
            <img
              alt="대출"
              className="absolute bottom-4 right-4 w-[67px] h-[76px] object-contain max-w-[calc(100%-1rem)]"
              src={loanImage}
            />
            <p className="text-[18px] text-primary-200 font-semibold leading-tight">대출</p>
          </div>
        </div>

      {/* Progress Bar */}
      <div className="mt-[155px]">
        <ProgressBarType2Complete />
      </div>

        {/* 전체 달성률 */}
        <div className="mt-[20px] w-full">
          <h2 className="text-[18px] text-gray-600 font-bold">전체 달성률</h2>
        </div>

        {/* 교육별 진행도 */}
        <div className="mt-[58px] w-full">
          <h2 className="text-[18px] text-gray-600 font-bold mb-[21px]">교육별 진행도</h2>
          
          {/* 거래내역 조회 */}
          <div className="flex items-center justify-between mb-4 w-full">
            <p className="text-[14px] text-gray-600 font-semibold">거래내역 조회</p>
            <p className="text-[12px] text-gray-900">50%</p>
          </div>
          <div className="bg-gray-100 rounded-full h-2 flex w-full">
            {/* TODO: 진행률 바를 동적으로 변경 - width: `${progress}%` 형태로 수정 필요 */}
            <div className="bg-primary-400 rounded-full h-full w-1/2" />
          </div>

          {/* 공과금 */}
          <div className="flex items-center justify-between mt-4 mb-4 w-full">
            <p className="text-[14px] text-gray-600 font-semibold">공과금</p>
            <p className="text-[12px] text-gray-900">100%</p>
          </div>
          <div className="bg-gray-100 rounded-full h-2 flex w-full">
            {/* TODO: 진행률 바를 동적으로 변경 - width: `${progress}%` 형태로 수정 필요 */}
            <div className="bg-primary-400 rounded-full h-full w-full" />
          </div>

          {/* 예/적금 */}
          <div className="flex items-center justify-between mt-4 mb-4 w-full">
            <p className="text-[14px] text-gray-600 font-semibold">예/적금</p>
            <p className="text-[12px] text-gray-900">100%</p>
          </div>
          <div className="bg-gray-100 rounded-full h-2 flex w-full">
            {/* TODO: 진행률 바를 동적으로 변경 - width: `${progress}%` 형태로 수정 필요 */}
            <div className="bg-primary-400 rounded-full h-full w-3/5" />
          </div>

          {/* 대출 */}
          <div className="flex items-center justify-between mt-4 mb-4 w-full">
            <p className="text-[14px] text-gray-600 font-semibold">대출</p>
            <p className="text-[12px] text-gray-900">100%</p>
          </div>
          <div className="bg-gray-100 rounded-full h-2 flex w-full">
            {/* TODO: 진행률 바를 동적으로 변경 - width: `${progress}%` 형태로 수정 필요 */}
            <div className="bg-primary-400 rounded-full h-full w-full" />
          </div>
        </div>
      </div>
    </main>
  );
}
