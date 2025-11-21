"use client"; // 클라이언트 컴포넌트로 선언하여 상태/라우터 등 브라우저 기능을 사용합니다.

import { useEffect, useState } from "react"; // 모달 상태 관리를 위해 useState를 사용합니다.
import { useRouter } from "next/navigation"; // 페이지 전환을 위해 Next.js 라우터를 사용합니다.
import ServiceCardGrid from "@/components/common/ServiceCardGrid"; // 서비스 카드 목록을 그리드 형태로 보여주는 공통 컴포넌트입니다.
import ProgressBar from "@/components/common/ProgressBar"; // 전체 진행도를 단계별로 나타내는 프로그레스 바입니다.
import ProgressCard from "@/components/common/ProgressCard"; // 개별 교육 진행 상황을 카드 형태로 노출합니다.
import Modal from "@/components/common/Modal"; // 준비 중 서비스 안내 모달 컴포넌트입니다.
import Image from "next/image";
import axiosInstance from "@/utils/axiosInstance";

const logoImage = "/images/logo1.png"; // 상단 로고 이미지 경로입니다.
const accountImage = "/images/account-image.png"; // 계좌 조회 서비스 카드에 사용할 이미지입니다.
const utilityImage = "/images/utility-image.png"; // 공과금 카드 이미지입니다.
const savingsImage = "/images/savings-image.png"; // 예/적금 카드 이미지입니다.
const loanImage = "/images/loan-image.png"; // 대출 카드 이미지입니다.
const profileIcon = "/images/profileicon.png"; // 프로필 버튼에서 사용하는 아이콘입니다.

// 응답받은 scenarioId를 UI에 쓸 이름으로 매핑
const SCENARIO_CONFIG = [
  { id: 1, scenarioTitle: "조회·이체" },
  { id: 2, scenarioTitle: "공과금" },
  { id: 3, scenarioTitle: "예/적금" },
  { id: 4, scenarioTitle: "대출" },
]

// API 호출 함수 : 완료 시나리오 조회
const fetchCompletedScenarios = async () => {
  const res = await axiosInstance.get("/users/me/scenarios/completed");
  const json = res.data;
  return json.data as {
    scenarioId: number;
    title: string;
    completedAt: string;
  }[];
};

// APIT 호출 함수 : 진행률 조회
const fetchScenarioProgress = async () => {
  const res = await axiosInstance.get("/users/me/scenarios/progress");
  const json = res.data;
  return json.data as {
    scenarioId: number;
    title: string;
    progressRate: number;
  }[];
};

export default function HomePage() {
  const router = useRouter(); // 페이지 이동 처리를 위해 라우터 인스턴스를 가져옵니다.
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림 상태를 관리합니다.

  // 진행도 카드에 표시할 데이터(초기 값은 0)
  const [progressCards, setProgressCards] = useState(
    SCENARIO_CONFIG.map((cfg) => ({
      scenarioId: cfg.id,
      title: cfg.scenarioTitle,
      progress: 0,
    }))
  );

  // 완료된 시나리오 id 집합
  const [completedScenarioIds, setCompletedScenarioIds] = useState<
    Set<number>
  >(new Set());

  const [isLoadingStatus, setIsLoadingStatus] = useState(true);
  const [statusError, setStatusError] = useState<string | null>(null);

  const handleProfileClick = () => {
    router.push("/mypage"); // 프로필 버튼 클릭 시 마이페이지로 이동합니다.
  };

  const handleAccountClick = () => {
    router.push("/woorimain"); // 계좌 조회/이체 서비스 카드를 눌렀을 때 우리 메인 화면으로 이동합니다.
  };

  const handleModalOpen = () => {
    setIsModalOpen(true); // 모달을 엽니다.
  };

  const handleModalClose = () => {
    setIsModalOpen(false); // 모달을 닫습니다.
  };

  const serviceCards = [ // 홈 화면 상단 서비스 카드를 정의하고 ServiceCardGrid에 전달합니다.
    {
      title: "조회·이체",
      bgColor: "bg-[#2677CC]",
      borderColor: "border-[#6393D9]",
      textColor: "text-[#BBD2ED]",
      imageSrc: accountImage,
      imageAlt: "계좌 조회",
      height: "h-[109px]",
      rounded: "rounded-[10px]",
      imageWidth: "56px",
      imageHeight: "49px",
      onClick: handleAccountClick, // 클릭 시 계좌 관련 시나리오 진입으로 이동합니다.
    },
    {
      title: "공과금",
      bgColor: "bg-[#35B9BF]",
      borderColor: "border-[#35B9BF]",
      textColor: "text-[#C6EAEC]",
      imageSrc: utilityImage,
      imageAlt: "공과금",
      height: "h-[108px]",
      rounded: "rounded-[8px]",
      imageWidth: "66px",
      imageHeight: "59px",
      onClick: handleModalOpen, // 공과금 카드 클릭 시 모달을 엽니다.
    },
    {
      title: "예금·적금",
      bgColor: "bg-[#FADE96]",
      borderColor: "border-[#FBE5AC]",
      textColor: "text-[#605F55]",
      imageSrc: savingsImage,
      imageAlt: "예적금",
      height: "h-[108px]",
      rounded: "rounded-[10px]",
      imageWidth: "66px",
      imageHeight: "59px",
      onClick: handleModalOpen, // 예금·적금 카드 클릭 시 모달을 엽니다.
    },
    {
      title: "대출",
      bgColor: "bg-[#1164C9]",
      borderColor: "border-[#6393D9]",
      textColor: "text-[#BDD1EE]",
      imageSrc: loanImage,
      imageAlt: "대출",
      height: "h-[108px]",
      rounded: "rounded-[8px]",
      imageWidth: "61px",
      imageHeight: "54px",
      onClick: handleModalOpen, // 대출 카드 클릭 시 모달을 엽니다.
    },
  ];

  // 시나리오 진행 상태/완료 여부 백엔드에서 불러오기
  useEffect(() => {
    const loadScenarioStatus = async () => {
      try {
        setIsLoadingStatus(true);

        // 진행률/완료 목록을 동시에 요청
        const [progressList, completedList] = await Promise.all([
          fetchScenarioProgress(),
          fetchCompletedScenarios(),
        ]);

        // 진행률: scenarioId -> progressRate Map으로 변환
        const progressMap = new Map<number, number>();
        progressList.forEach((item) => {
          progressMap.set(item.scenarioId, item.progressRate);
        });

        // 완료: scenarioId를 Set에 담기
        const completedIdSet = new Set<number>();
        completedList.forEach((item) => {
          completedIdSet.add(item.scenarioId);
        });

        // SCENARIO_CONFIG 기준으로 진행 카드 데이터 재구성
        const updateCards = SCENARIO_CONFIG.map((cfg) => {
          // 해당 시나리오 id에 대한 진행률 존재 여부 확인
          const fromApi = progressMap.get(cfg.id);
          
          // 진행률이 있으면 그대로 사용, 없는데 완료 목록에 있으면 100, 둘 다 아니면 0
          const rate = 
            fromApi !== undefined
              ? fromApi
              : completedIdSet.has(cfg.id)
              ? 100
              : 0;
          
          return {
            scenarioId: cfg.id,
            title: cfg.scenarioTitle,
            progress: rate,
          };
        });

        // 상태 업데이트
        setProgressCards(updateCards);
        setCompletedScenarioIds(completedIdSet);
        setStatusError(null);
      } catch (e: any) {
        console.error(e);
        setStatusError(e?.message ?? "진행 상태 조회 중 오류가 발생했습니다.");
      } finally {
        setIsLoadingStatus(false);
      }
    };

    loadScenarioStatus();
  }, []);

  // 완료 여부 계산
  const scenarioCompletion = SCENARIO_CONFIG.map((cfg) => {
    const card = progressCards.find((c) => c.scenarioId === cfg.id);
    const progress = card?.progress ?? 0;
    // 진행률이 100이상이면 완료
    const completedByRate = progress >= 100;
    // 완료 시나리오 목록(Set)에 포함되어 있으면 완료
    const completedByApi = completedScenarioIds.has(cfg.id);
    return completedByRate || completedByApi;
  });

  // 모든 시나리오 완료 여부(마무리 퀴즈 활성화 판단용 - 추후 사용 가능)
  const allScenariosCompleted = 
    scenarioCompletion.length > 0 && scenarioCompletion.every(Boolean);
  
  const progressSteps = SCENARIO_CONFIG.map((cfg, index) => {
    const completed = scenarioCompletion[index];

    return {
      label: cfg.scenarioTitle,
      bgColor: completed ? "bg-[#2F6FE0]" : "bg-[#C3C3C3]",
      textColor: "text-gray-500",
      iconSrc: completed ? "/images/maincheck2.png" : "/images/maincheck.png",
      iconAlt: completed ? `${cfg.scenarioTitle} 완료` : `${cfg.scenarioTitle} 진행 중`,
      iconClassName: completed ? "bg-[#0043CE]" : "bg-[#C3C3C3]",
    };
  });

  progressSteps.push({
    label: "마무리 퀴즈",
    bgColor: allScenariosCompleted ? "bg-[#198038]" : "bg-[#C3C3C3]",
    textColor: allScenariosCompleted ? "text-[#0B8A46]" : "text-gray-400",
    iconSrc: allScenariosCompleted ? "/images/maincheck3.png" : "/images/maincheck.png",
    iconAlt: allScenariosCompleted ? "마무리 퀴즈 완료" : "마무리 퀴즈 진행 예정",
    iconClassName: allScenariosCompleted ? "bg-[#198038]" : "bg-[#C3C3C3]",
  });

  return (
    <main className="flex min-h-screen items-start justify-center overflow-x-hidden bg-white">
      <div className="w-full max-w-[390px] px-5 pt-[30px] pb-0 sm:max-w-[480px] md:max-w-[560px] lg:max-w-[768px]">
        {/* 상단 로고와 프로필 영역 */}
        <div className="flex w-full items-center justify-between">
          <div className="relative h-[58px] w-[100px]">
            <Image alt="로고" className="h-full w-full object-contain" src={logoImage} width={100} height={58} />
          </div>

          <button onClick={handleProfileClick} className="flex cursor-pointer flex-col items-center gap-1">
            <div className="relative h-7 w-7">
              <Image alt="프로필" className="h-full w-full object-contain" src={profileIcon} width={28} height={28} />
            </div>
            <p className="text-[12px] text-gray-400">내 정보</p>
          </button>
        </div>

        {/* 서비스 카드 그리드 */}
        <ServiceCardGrid cards={serviceCards} className="mt-10" />

        {/* 전체 달성률 제목 */}
        <div className="mt-8 w-full">
          <h2 className="text-[18px] font-bold text-gray-600">전체 달성률</h2>
          {statusError && (
            <p className="mt-1 text-[12px] text-red-500">{statusError}</p>
          )}
        </div>

        {/* 진행률 바 */}
        <div>
          <ProgressBar
            steps={progressSteps}
            lineColorClassName="bg-[#376FDB]"
            showEndCaps={false}
            
          />
        </div>

        {/* 교육별 진행도 카드 리스트 */}
        <div className="mt-0 w-full pb-[35px]">
          <h2 className="mb-4 text-[18px] font-bold text-gray-600">교육별 진행도</h2>
          <div className="flex flex-col gap-[12px]">
            {progressCards.map((card) => (
              <ProgressCard key={card.title} title={card.title} progress={card.progress} />
            ))}
          </div>
        </div>
      </div>

      {/* 모달 컴포넌트 */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        description="준비 중인 서비스입니다. 다음에 만나요!"
        confirmText="확인"
        onConfirm={handleModalClose}
        showCancelButton={false}
      />
    </main>
  );
}
