"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Modal from "@/components/common/Modal";
import PageHeader from "@/components/common/PageHeader";
import PageContainer from "@/components/common/PageContainer";
import { useUserData } from "@/lib/hooks/useUserData";

const profileImage = "/images/profileicon2.png";
const pointIcon = "/images/pointicon.png";

export default function ProfilePage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { userName, availablePoints } = useUserData();

  const handleBack = () => {
    router.push("/home");
  };

  const handleAccountOpen = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accountAuthStep");
    }
    router.push("/account/open/auth");
  };

  const handlePointTransfer = () => {
    router.push("/points/list");
  };

  const handleChangeName = () => {
    router.push("/mypage/changename");
  };

  const handleChangePassword = () => {
    router.push("/mypage/password");
  };

  const handleSecessionClick = () => {
    setIsModalOpen(true);
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  const handleModalConfirm = () => {
    setIsModalOpen(false);
    router.push("/login");
  };

  const handleLogout = () => {
    router.push("/login");
  };

  return (
    <PageContainer>
      <PageHeader title="내 정보" onBack={handleBack} titleSize="lg" />

      <div className="mt-12 flex w-full items-center gap-5">
        <div className="relative h-[56px] w-[56px] shrink-0">
          <img alt="프로필" className="h-full w-full rounded-full object-cover" src={profileImage} />
        </div>
        <p className="text-[16px] font-medium leading-[normal] tracking-[-0.64px] text-gray-800">{userName}</p>
      </div>

      <div className="mt-8 w-full">
        <button
          onClick={() => router.push("/points")}
          className="flex h-[49px] w-full items-center justify-between rounded-[12px] bg-gray-100 px-5 transition-all hover:bg-gray-200 hover:opacity-90"
          aria-label="포인트 관리 페이지로 이동"
        >
          <div className="flex items-center gap-2">
            <div className="relative h-4 w-4 shrink-0">
              <img alt="포인트 아이콘" className="h-full w-full object-contain" src={pointIcon} />
            </div>
            <p className="text-[14px] font-medium tracking-[-0.56px] text-gray-800">포인트</p>
          </div>
          <p className="text-[17px] font-semibold leading-[1.38] tracking-[-0.34px] text-primary-400">
            {availablePoints.toLocaleString()} p
          </p>
        </button>
      </div>

      <div className="mt-12 w-full">
        <p className="mb-6 text-[19px] font-medium leading-[1.38] tracking-[-0.76px] text-gray-700">계정 관리</p>

        <div className="flex w-full flex-col gap-2">
          <button
            onClick={handleAccountOpen}
            className="flex h-[50px] w-full items-center rounded-[5px] bg-white pl-0 transition-colors hover:bg-gray-50"
          >
            <p className="text-[16px] font-normal leading-[1.38] tracking-[-0.64px] text-gray-600">계좌 개설하기</p>
          </button>

          <button
            onClick={handlePointTransfer}
            className="flex h-[50px] w-full items-center rounded-[5px] bg-white pl-0 transition-colors hover:bg-gray-50"
          >
            <p className="text-[16px] font-normal leading-[1.38] tracking-[-0.64px] text-gray-600">포인트 관리</p>
          </button>

          <button
            onClick={handleChangeName}
            className="flex h-[50px] w-full items-center rounded-[5px] bg-white pl-0 transition-colors hover:bg-gray-50"
          >
            <p className="text-[16px] font-normal leading-[1.38] tracking-[-0.64px] text-gray-600">이름 변경하기</p>
          </button>

          <button
            onClick={handleChangePassword}
            className="flex h-[50px] w-full items-center rounded-[5px] bg-white pl-0 transition-colors hover:bg-gray-50"
          >
            <p className="text-[16px] font-normal leading-[1.38] tracking-[-0.64px] text-gray-600">비밀번호 변경</p>
          </button>

          <button
            onClick={handleSecessionClick}
            className="flex h-[50px] w-full items-center rounded-[5px] bg-white pl-0 transition-colors hover:bg-gray-50"
          >
            <p className="text-[16px] font-normal leading-[1.38] tracking-[-0.64px] text-gray-600">회원탈퇴</p>
          </button>

          <button
            onClick={handleLogout}
            className="flex h-[50px] w-full items-center rounded-[5px] bg-white pl-0 transition-colors hover:bg-gray-50"
          >
            <p className="text-[16px] font-normal leading-[1.38] tracking-[-0.64px] text-gray-600">로그아웃</p>
          </button>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleModalCancel}
        title="탈퇴하기"
        description={"잠깐! 회원 탈퇴 시, 현재 보유 중인 포인트는 \n        모두 소멸됩니다. 계속 진행하시겠습니까?"}
        confirmText="회원탈퇴"
        cancelText="취소"
        onConfirm={handleModalConfirm}
      />
    </PageContainer>
  );
}
