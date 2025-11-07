"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Modal from "@/components/common/Modal";
import PageHeader from "@/components/common/PageHeader";
import PageContainer from "@/components/common/PageContainer";
import { useUserData } from "@/lib/hooks/useUserData";

const profileImage = "/images/profileicon2.png";
const pointIcon = "/images/pointicon.png";

export default function Profile() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { userName, availablePoints } = useUserData();

  const handleBack = () => {
    router.push("/home");
  };

  const handleAccountOpen = () => {
    // 계좌 개설 페이지로 이동 시 단계 초기화
    if (typeof window !== "undefined") {
      localStorage.removeItem("accountAuthStep");
    }
    router.push("/account/open/auth");
  };

  const handlePointTransfer = () => {
    // 포인트 관리 페이지로 이동
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
    // 회원탈퇴 로직
    setIsModalOpen(false);
    router.push("/login");
  };

  const handleLogout = () => {
    // 로그아웃 로직
    router.push("/login");
  };

  return (
    <PageContainer>
      <PageHeader title="내 정보" onBack={handleBack} titleSize="lg" />

      {/* Profile Section */}
      <div className="mt-12 w-full flex items-center gap-5">
        {/* Profile Image */}
        <div className="w-[56px] h-[56px] relative shrink-0">
          <img
            alt="프로필"
            className="w-full h-full object-cover rounded-full"
            src={profileImage}
          />
        </div>

        {/* User Name */}
        <p className="text-[16px] text-gray-800 font-medium leading-[normal] tracking-[-0.64px]">
          {userName}
        </p>
      </div>

      {/* Points Section */}
      <div className="mt-8 w-full">
        <button
          onClick={() => router.push("/points")}
          className="bg-gray-100 h-[49px] rounded-[12px] w-full flex items-center justify-between px-5 hover:bg-gray-200 hover:opacity-90 transition-all cursor-pointer"
          aria-label="포인트 관리 페이지로 이동"
        >
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 relative shrink-0">
              <img
                alt="포인트 아이콘"
                className="w-full h-full object-contain"
                src={pointIcon}
              />
            </div>
            <p className="text-[14px] text-gray-800 font-medium tracking-[-0.56px]">
              포인트
            </p>
          </div>
          <p className="text-[17px] font-semibold leading-[1.38] tracking-[-0.34px] text-primary-400">
            {availablePoints.toLocaleString()} p
          </p>
        </button>
      </div>

      {/* Account Management Section */}
      <div className="mt-12 w-full">
        <p className="text-[19px] text-gray-700 font-medium leading-[1.38] tracking-[-0.76px] mb-6">
          계정 관리
        </p>

        {/* Menu Items */}
        <div className="flex flex-col gap-2 w-full">
          {/* 계좌 개설하기 */}
          <button
            onClick={handleAccountOpen}
            className="bg-white h-[50px] rounded-[5px] w-full flex items-center pl-0 hover:bg-gray-50 transition-colors"
          >
            <p className="text-[16px] text-gray-600 font-normal leading-[1.38] tracking-[-0.64px]">
              계좌 개설하기
            </p>
          </button>

          {/* 포인트 전환하기 */}
          <button
            onClick={handlePointTransfer}
            className="bg-white h-[50px] rounded-[5px] w-full flex items-center pl-0 hover:bg-gray-50 transition-colors"
          >
            <p className="text-[16px] text-gray-600 font-normal leading-[1.38] tracking-[-0.64px]">
              포인트 관리
            </p>
          </button>

          {/* 이름 변경하기 */}
          <button
            onClick={handleChangeName}
            className="bg-white h-[50px] rounded-[5px] w-full flex items-center pl-0 hover:bg-gray-50 transition-colors"
          >
            <p className="text-[16px] text-gray-600 font-normal leading-[1.38] tracking-[-0.64px]">
              이름 변경하기
            </p>
          </button>

          {/* 비밀번호 변경 */}
          <button
            onClick={handleChangePassword}
            className="bg-white h-[50px] rounded-[5px] w-full flex items-center pl-0 hover:bg-gray-50 transition-colors"
          >
            <p className="text-[16px] text-gray-600 font-normal leading-[1.38] tracking-[-0.64px]">
              비밀번호 변경
            </p>
          </button>

          {/* 회원탈퇴 */}
          <button
            onClick={handleSecessionClick}
            className="bg-white h-[50px] rounded-[5px] w-full flex items-center pl-0 hover:bg-gray-50 transition-colors"
          >
            <p className="text-[16px] text-gray-600 font-normal leading-[1.38] tracking-[-0.64px]">
              회원탈퇴
            </p>
          </button>

          {/* 로그아웃 */}
          <button
            onClick={handleLogout}
            className="bg-white h-[50px] rounded-[5px] w-full flex items-center pl-0 hover:bg-gray-50 transition-colors"
          >
            <p className="text-[16px] text-gray-600 font-normal leading-[1.38] tracking-[-0.64px]">
              로그아웃
            </p>
          </button>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleModalCancel}
        title="탈퇴하기"
        description="잠깐! 회원 탈퇴 시, 현재 보유 중인 포인트는 
        모두 소멸됩니다. 계속 진행하시겠습니까?"
        confirmText="회원탈퇴"
        cancelText="취소"
        onConfirm={handleModalConfirm}
      />
    </PageContainer>
  );
}
