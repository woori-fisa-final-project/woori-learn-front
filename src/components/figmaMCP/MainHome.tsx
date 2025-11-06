"use client";
import { useRouter } from "next/navigation";
import ServiceCardGrid from "@/components/common/ServiceCardGrid";
import ProgressBar from "@/components/common/ProgressBar";
import ProgressCard from "@/components/common/ProgressCard";

const logoImage = "/images/logo1.png";
const accountImage = "/images/account-image.png";
const utilityImage = "/images/utility-image.png";
const savingsImage = "/images/savings-image.png";
const loanImage = "/images/loan-image.png";
const profileIcon = "/images/profileicon.png";

export default function MainHome() {
  const router = useRouter();

  const handleProfileClick = () => {
    router.push("/mypage");
  };

  const handleAccountClick = () => {
    router.push("/woorimain");
  };

  const serviceCards = [
    {
      title: "계좌 조회/\n이체",
      bgColor: "bg-primary-500",
      borderColor: "border-primary-300",
      textColor: "text-primary-200",
      imageSrc: accountImage,
      imageAlt: "계좌 조회",
      height: "h-[109px]",
      rounded: "rounded-[10px]",
      imageWidth: "66px",
      imageHeight: "59px",
      onClick: handleAccountClick,
    },
    {
      title: "공과금",
      bgColor: "bg-primary-800",
      borderColor: "border-primary-300",
      textColor: "text-primary-100",
      imageSrc: utilityImage,
      imageAlt: "공과금",
      height: "h-[108px]",
      rounded: "rounded-[8px]",
      imageWidth: "66px",
      imageHeight: "59px",
    },
    {
      title: "예/적금",
      bgColor: "bg-gray-50",
      borderColor: "border-gray-200",
      textColor: "text-gray-700",
      imageSrc: savingsImage,
      imageAlt: "예적금",
      height: "h-[108px]",
      rounded: "rounded-[10px]",
      imageWidth: "66px",
      imageHeight: "59px",
    },
    {
      title: "대출",
      bgColor: "bg-primary-800",
      borderColor: "border-primary-300",
      textColor: "text-primary-200",
      imageSrc: loanImage,
      imageAlt: "대출",
      height: "h-[108px]",
      rounded: "rounded-[8px]",
      imageWidth: "66px",
      imageHeight: "59px",
    },
  ];

  const progressSteps = [
    { label: "계좌이체", bgColor: "primary-700" as const, textColor: "gray-500" as const },
    { label: "공과금", bgColor: "primary-700" as const, textColor: "gray-500" as const },
    { label: "예/적금", bgColor: "primary-700" as const, textColor: "gray-500" as const },
    { label: "대출", bgColor: "primary-700" as const, textColor: "gray-500" as const },
    { label: "마무리퀴즈", bgColor: "green-500" as const, textColor: "green-500" as const },
  ];

  const progressCards = [
    { title: "거래내역 조회", progress: 50 },
    { title: "공과금", progress: 100 },
    { title: "예/적금", progress: 100 },
    { title: "대출", progress: 100 },
  ];

  return (
    <main className="flex justify-center items-start min-h-screen bg-white overflow-x-hidden">
      <div className="w-full max-w-[390px] sm:max-w-[480px] md:max-w-[560px] lg:max-w-[768px] px-5 pt-[60px] pb-0">
        {/* Logo and Profile Section */}
        <div className="flex items-center justify-between w-full">
          {/* Logo */}
          <div className="relative w-[100px] h-[58px]">
            <img
              alt="로고"
              className="w-full h-full object-contain"
              src={logoImage}
            />
          </div>

          {/* Profile Section */}
          <button
            onClick={handleProfileClick}
            className="flex flex-col items-center gap-1 cursor-pointer"
          >
            <div className="w-7 h-7 relative">
              <img
                alt="프로필"
                className="w-full h-full object-contain"
                src={profileIcon}
              />
            </div>
            <p className="text-[12px] text-gray-400">내 정보</p>
          </button>
        </div>

        {/* Service Cards Grid */}
        <ServiceCardGrid cards={serviceCards} className="mt-10" />

        {/* 전체 달성률 */}
        <div className="mt-8 w-full">
          <h2 className="text-[18px] text-gray-600 font-bold">전체 달성률</h2>
        </div>

        {/* Progress Bar */}
        <div className="mt-3">
          <ProgressBar steps={progressSteps} />
        </div>

        {/* 교육별 진행도 */}
        <div className="mt-0 w-full">
          <h2 className="text-[18px] text-gray-600 font-bold mb-4">
            교육별 진행도
          </h2>

          <div className="flex flex-col gap-[12px]">
            {progressCards.map((card, index) => (
              <ProgressCard
                key={`progress-${card.title}-${index}`}
                title={card.title}
                progress={card.progress}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
