"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import PageHeader from "@/components/common/PageHeader";
import PageContainer from "@/components/common/PageContainer";

const backIcon = "/images/backicon.png";

export default function WooriMain() {
  const router = useRouter();
  const [userName, setUserName] = useState("김민영");

  useEffect(() => {
    const savedName = localStorage.getItem("userName");
    if (savedName) {
      setUserName(savedName);
    }
  }, []);

  const handleBack = () => {
    router.push("/home");
  };

  return (
    <PageContainer>
      <PageHeader title="" onBack={handleBack} />

      {/* 상단 사용자 정보 */}
      <div className="mt-4 w-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <p className="text-[18px] text-gray-600 font-normal">
            {userName}님
          </p>
          <div className="bg-gray-200 h-1 w-14 rounded-full" />
        </div>
        <div className="flex items-center gap-4">
          {/* 아이콘들 */}
          <div className="w-5 h-5 bg-gray-200 rounded" />
          <div className="w-5 h-5 bg-gray-200 rounded" />
          <div className="w-6 h-6 bg-gray-200 rounded" />
          <div className="w-6 h-6 bg-gray-200 rounded" />
        </div>
      </div>

      {/* 계좌 정보 카드 */}
      <div className="mt-6 w-full bg-white rounded-[15px] p-4 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-400 rounded-full" />
            <div>
              <p className="text-[20px] text-gray-600 font-medium">WON통장</p>
              <p className="text-[18px] text-gray-400">우리1002-166-123456</p>
            </div>
          </div>
          <div className="w-3.5 h-4 bg-gray-300 rounded" />
        </div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="bg-gray-100 px-3 py-1.5 rounded-full">
              <p className="text-[15px] text-gray-600">한도제한</p>
            </div>
          </div>
          <p className="text-[25px] text-gray-700 font-medium">0원</p>
        </div>
        <button className="w-14 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
          <p className="text-[15px] text-gray-600">이체</p>
        </button>
      </div>

      {/* 전체계좌보기 버튼 */}
      <button className="mt-4 w-full h-14 bg-white border border-gray-200 rounded-lg flex items-center justify-center">
        <p className="text-[20px] text-gray-600">전체계좌보기</p>
      </button>

      {/* 홈계좌 설정 */}
      <div className="mt-6 w-full flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-primary-400 rounded-full" />
          <p className="text-[20px] text-gray-600">홈계좌 설정</p>
        </div>
        <div className="flex-1 h-px bg-gray-300" />
        <div className="flex items-center gap-1">
          <p className="text-[7px] text-primary-400 font-medium">가가</p>
          <p className="text-[21px] text-gray-600">일반홈</p>
        </div>
      </div>

      {/* 기능 버튼들 */}
      <div className="mt-6 w-full space-y-4">
        <button className="w-full flex items-center gap-3 p-4 bg-white rounded-lg">
          <div className="w-6 h-6 bg-gray-200 rounded" />
          <p className="text-[19px] text-gray-600">즉시/예약이체</p>
        </button>
        <button className="w-full flex items-center gap-3 p-4 bg-white rounded-lg">
          <div className="w-6 h-6 bg-gray-200 rounded" />
          <p className="text-[19px] text-gray-600">공과금 납부하기</p>
        </button>
      </div>

      {/* 우리 원더라이프 */}
      <div className="mt-8 w-full bg-white rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-11 h-8 bg-primary-200 rounded" />
          <p className="text-[16px] text-primary-500 font-semibold">WON</p>
          <p className="text-[16px] text-amber-500 font-semibold">DER</p>
        </div>
        <div className="w-11 h-8 bg-gray-100 rounded mb-2" />
        <p className="text-[18px] text-gray-600 mb-1">우리 원더라이프</p>
        <p className="text-[11px] text-primary-300">
          인생의 후반전을 위한 맞춤형 서비스 확인해 보세요
        </p>
      </div>

      {/* 우리금융그룹 서비스 */}
      <div className="mt-8 w-full">
        <h2 className="text-[19px] text-gray-600 font-medium mb-4">
          우리금융그룹 서비스
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {[
            { name: "저축은행", icon: "/images/service1.png" },
            { name: "증권", icon: "/images/service2.png" },
            { name: "자동차", icon: "/images/service3.png" },
            { name: "카드", icon: "/images/service4.png" },
            { name: "꿀머니", icon: "/images/service5.png" },
            { name: "알뜰폰", icon: "/images/service6.png" },
          ].map((service, index) => (
            <button
              key={index}
              className="bg-white rounded-[15px] p-4 flex flex-col items-center gap-2 border border-gray-200"
            >
              <div className="w-14 h-14 bg-gray-100 rounded-full" />
              <p className="text-[18px] text-gray-600">{service.name}</p>
            </button>
          ))}
        </div>
      </div>

      {/* 보이스피싱 경고 배너 */}
      <div className="mt-6 w-full bg-red-50 rounded-[13px] p-4 flex items-center gap-4">
        <div className="w-14 h-18 bg-gray-200 rounded" />
        <div>
          <p className="text-[15px] text-gray-700 font-medium mb-1">
            잠깐만요!
          </p>
          <p className="text-[12px] text-gray-500 leading-relaxed">
            보이스피싱이 의심된다면
            <br />
            이렇게 피해 예방하세요!
          </p>
        </div>
      </div>

      {/* 하단 기능 메뉴 */}
      <div className="mt-6 w-full space-y-4">
        <button className="w-full flex items-center gap-3 p-4 bg-white rounded-lg">
          <div className="w-9 h-9 bg-gray-200 rounded" />
          <p className="text-[18px] text-gray-600">인증서 관리</p>
        </button>
        <button className="w-full flex items-center gap-3 p-4 bg-white rounded-lg">
          <div className="w-9 h-9 bg-gray-200 rounded" />
          <p className="text-[18px] text-gray-600">분실신고</p>
        </button>
      </div>

      {/* 하단 네비게이션 바 */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-100 h-[89px] flex items-center justify-around max-w-[390px] mx-auto">
        {[
          { name: "상품", icon: "/images/nav1.png" },
          { name: "자산소비", icon: "/images/nav2.png" },
          { name: "흠", icon: "/images/nav3.png", active: true },
          { name: "주식", icon: "/images/nav4.png" },
          { name: "혜택", icon: "/images/nav5.png" },
        ].map((item, index) => (
          <button
            key={index}
            className="flex flex-col items-center gap-1"
          >
            <div className="w-6 h-6 bg-gray-300 rounded" />
            <p
              className={`text-[10px] ${
                item.active ? "text-primary-400 font-semibold" : "text-gray-500"
              }`}
            >
              {item.name}
            </p>
          </button>
        ))}
      </div>
    </PageContainer>
  );
}

