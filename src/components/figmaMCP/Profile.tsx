"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Modal from "@/components/common/Modal";

const backIcon = "/images/backicon.png";

// Figma 이미지 URL (7일 후 만료 - 필요시 다운로드하여 /public/images/에 저장 권장)
const profileImage = "/images/profileicon2.png";
const pointIcon = "/images/pointicon.png";

export default function Profile() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBack = () => {
    router.push("/home");
  };

  const handleAccountOpen = () => {
    // 계좌 개설 페이지로 이동
    router.push("/account/open");
  };

  const handlePointTransfer = () => {
    // 포인트 전환 페이지로 이동
    router.push("/mypage/point");
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
    <div className="bg-white relative w-full min-h-screen max-w-[390px] w-full mx-auto px-[20px] pt-[60px] flex flex-col items-start">
      {/* Header */}
      <div className="flex items-center gap-2 w-full">
        <button
          onClick={handleBack}
          className="w-[14px] h-[7px] flex items-center justify-center -rotate-90"
        >
          <img alt="뒤로가기" className="w-[14px] h-[7px]" src={backIcon} />
        </button>
        <h1 className="text-[22px] text-[#414141] font-medium leading-[31px] tracking-[-0.88px]">
          내 정보
        </h1>
      </div>

      {/* Profile Section */}
      <div className="mt-[50px] w-full flex items-center gap-5">
        {/* Profile Image */}
        <div className="w-[56px] h-[56px] relative">
          <img
            alt="프로필"
            className="w-full h-full object-cover rounded-full"
            src={profileImage}
          />
        </div>

        {/* User Name */}
        <p className="text-[16px] text-[#2c2c2c] font-medium leading-[normal] tracking-[-0.64px]">
          김민영
        </p>
      </div>

      {/* Points Section */}
      <div className="mt-[30px] w-full">
        <div className="bg-[#f5f5f5] h-[49px] rounded-[12px] w-full flex items-center justify-between px-[20px]">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 relative">
              <img alt="포인트 아이콘" className="w-full h-full" src={pointIcon} />
            </div>
            <p className="text-[14px] text-[#2d2d2d] font-medium tracking-[-0.56px]">
              포인트
            </p>
          </div>
          <p className="text-[17px] text-[#648ddb]/80 font-semibold leading-[1.38] tracking-[-0.34px]">
            5,000 p
          </p>
        </div>
      </div>

      {/* Account Management Section */}
      <div className="mt-[50px] w-full">
        <p className="text-[19px] text-[#454545] font-medium leading-[1.38] tracking-[-0.76px] mb-[24px]">
          계정 관리
        </p>

        {/* Menu Items */}
        <div className="flex flex-col gap-2">
          {/* 계좌 개설하기 */}
          <button
            onClick={handleAccountOpen}
            className="bg-white h-[50px] rounded-[5px] w-full flex items-center pl-0 hover:bg-[#f9f9f9] transition-colors"
          >
            <p className="text-[16px] text-[#515151] font-normal leading-[1.38] tracking-[-0.64px]">
              계좌 개설하기
            </p>
          </button>

          {/* 포인트 전환하기 */}
          <button
            onClick={handlePointTransfer}
            className="bg-white h-[50px] rounded-[5px] w-full flex items-center pl-0 hover:bg-[#f9f9f9] transition-colors"
          >
            <p className="text-[16px] text-[#515151] font-normal leading-[1.38] tracking-[-0.64px]">
              포인트 전환하기
            </p>
          </button>

          {/* 비밀번호 변경 */}
          <button
            onClick={handleChangePassword}
            className="bg-white h-[50px] rounded-[5px] w-full flex items-center pl-0 hover:bg-[#f9f9f9] transition-colors"
          >
            <p className="text-[16px] text-[#515151] font-normal leading-[1.38] tracking-[-0.64px]">
              비밀번호 변경
            </p>
          </button>

          {/* 회원탈퇴 */}
          <button
            onClick={handleSecessionClick}
            className="bg-white h-[50px] rounded-[5px] w-full flex items-center pl-0 hover:bg-[#f9f9f9] transition-colors"
          >
            <p className="text-[16px] text-[#515151] font-normal leading-[1.38] tracking-[-0.64px]">
              회원탈퇴
            </p>
          </button>

          {/* 로그아웃 */}
          <button
            onClick={handleLogout}
            className="bg-white h-[50px] rounded-[5px] w-full flex items-center pl-0 hover:bg-[#f9f9f9] transition-colors"
          >
            <p className="text-[16px] text-[#515151] font-normal leading-[1.38] tracking-[-0.64px]">
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
        &nbsp;&nbsp;&nbsp;&nbsp;모두 소멸됩니다. 계속 진행하시겠습니까?"
        confirmText="회원탈퇴"
        cancelText="취소"
        onConfirm={handleModalConfirm}
      />
    </div>
  );
}
