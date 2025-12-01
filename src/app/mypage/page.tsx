"use client"; // 클라이언트 컴포넌트로 선언하여 상태 및 브라우저 API를 사용할 수 있도록 합니다.

import { useRouter } from "next/navigation"; // 페이지 이동을 처리하기 위해 Next.js 라우터 훅을 불러옵니다.
import { useState, useEffect, useRef } from "react"; // 모달 열림 상태 등 컴포넌트 상태 관리를 위해 useState를 사용합니다.
import Modal from "@/components/common/Modal"; // 탈퇴 확인 모달을 표시하는 공통 컴포넌트입니다.
import PageHeader from "@/components/common/PageHeader"; // 페이지 상단의 헤더 UI를 담당합니다.
import PageContainer from "@/components/common/PageContainer"; // 페이지 전반 레이아웃을 감싸는 컨테이너입니다.
import { useUserData } from "@/lib/hooks/useUserData"; // 사용자 이름, 포인트 등 마이페이지에 필요한 데이터를 제공하는 커스텀 훅입니다.
import Image from "next/image";
import { useIsClient } from "@/lib/hooks/useIsClient";
import axiosInstance from "@/utils/axiosInstance";
import { useAuthStore } from "@/utils/tokenStorage";
import Button from "@/components/common/Button";

const profileImage = "/images/profileicon2.png"; // 프로필 영역에 표시할 이미지 경로입니다.
const pointIcon = "/images/pointicon.png"; // 포인트 카드에 사용할 아이콘 이미지입니다.

export default function ProfilePage() {
  const router = useRouter(); // 페이지 이동을 위해 라우터 인스턴스를 가져옵니다.
  const [isModalOpen, setIsModalOpen] = useState(false); // 회원탈퇴 모달의 열림 상태를 관리합니다.
  const { userName, availablePoints, account } = useUserData(); // 사용자 이름과 보유 포인트를 가져옵니다.
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [accountModalStatus, setAccountModalStatus] = useState<
    "processing" | "success"
  >("processing");
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isClient = useIsClient();

  const handleBack = () => {
    router.push("/home"); // 뒤로가기 시 홈 화면으로 이동합니다.
  };

  const handleAccountOpen = () => {
    // 1) 먼저 "진행 중" 모달 열기
    setAccountModalStatus("processing");
    setIsAccountModalOpen(true);

    // 2) 은행 이동 대신 타이머로 가짜 처리
    timerRef.current = setTimeout(() => {
      setAccountModalStatus("success");
    }, 2000); // 2초 후 성공 화면으로 전환
  };

  // 🔥 컴포넌트 언마운트 시 타이머 정리 (메모리 누수 방지)
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handlePointTransfer = () => {
    router.push("/point/list"); // 포인트 관련 내역/환전 페이지로 이동합니다.
  };

  const handleChangeName = () => {
    router.push("/mypage/changename"); // 이름 변경 화면으로 이동합니다.
  };

  const handleChangePassword = () => {
    router.push("/mypage/password"); // 비밀번호 변경 화면으로 이동합니다.
  };

  const handleSecessionClick = () => {
    setIsModalOpen(true); // 탈퇴 버튼 클릭 시 확인 모달을 엽니다.
  };

  const handleModalCancel = () => {
    setIsModalOpen(false); // 모달에서 취소를 선택하면 닫습니다.
  };

  const handleModalConfirm = () => {
    setIsModalOpen(false); // 탈퇴 확정 시 모달을 닫고
    router.push("/login"); // 로그인 화면으로 이동합니다.
  };

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
    } catch (error) {
      console.error("Logout failed:", error);
      // 로그아웃 API 실패 시에도 클라이언트에서는 로그아웃 처리를 계속 진행합니다.
    } finally {
      useAuthStore.getState().clearTokens();
      router.push("/login"); // 로그아웃 버튼 클릭 시 로그인 화면으로 이동합니다.
    }
  };

  return (
    <PageContainer>
      <PageHeader title="내 정보" onBack={handleBack} titleSize="lg" />{" "}
      {/* 상단 헤더: 뒤로가기 및 제목 */}
      <div className="mt-12 flex w-full items-center gap-5">
        <div className="relative h-14 w-14 shrink-0">
          <Image
            alt="프로필"
            className="h-full w-full rounded-full object-cover"
            src={profileImage}
            width={56}
            height={56}
          />
        </div>
        <p className="text-[16px] font-medium leading-[normal] tracking-[-0.64px] text-gray-800">
          {userName}
        </p>
      </div>
      {/* 포인트 + 계좌 통합 카드 */}
      <div className="mt-8 w-full rounded-xl bg-gray-100 p-5">
        {/* 포인트 영역 */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="relative h-4 w-4 shrink-0">
              <Image
                alt="포인트 아이콘"
                className="h-full w-full object-contain"
                src={pointIcon}
                width={16}
                height={16}
              />
            </div>
            <p className="text-[14px] font-medium text-gray-800">포인트</p>
          </div>

          {/* 🔵 파란색 숫자만 클릭하면 이동 */}
          <button
            onClick={() => router.push("/point")}
            className="text-[17px] font-semibold leading-[1.38] tracking-[-0.34px] text-primary-400 hover:underline"
          >
            <span suppressHydrationWarning>
              {isClient ? `${availablePoints.toLocaleString()} p` : ""}
            </span>
          </button>
        </div>

        {/* 구분선 */}
        {/* <div className="h-[1px] bg-gray-300 my-3" /> */}

        {/* 계좌 영역 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative h-4 w-4 shrink-0">
              <Image
                alt="계좌 아이콘"
                className="h-full w-full object-contain"
                src="/images/accounticon.png"
                width={16}
                height={16}
              />
            </div>

            <p className="text-[14px] text-gray-700 font-medium">계좌</p>
          </div>
          {account ? (
            <p className="text-[16px] text-gray-800 font-semibold">{account}</p>
          ) : (
            <button
              onClick={handleAccountOpen}
              className="text-[14px] font-medium text-gray-800 hover:underline"
            >
              계좌 개설하기
            </button>
          )}
        </div>
      </div>
      <div className="mt-12 w-full">
        <p className="mb-6 text-[19px] font-semibold leading-[1.38] tracking-[-0.76px] text-gray-700">
          계정 관리
        </p>

        <div className="flex w-full flex-col gap-2">
          <button
            onClick={handlePointTransfer}
            className="flex h-[50px] w-full items-center rounded-[5px] bg-white pl-0 transition-colors hover:bg-gray-50"
          >
            <p className="text-[16px] font-medium leading-[1.38] tracking-[-0.64px] text-gray-600">
              포인트 관리
            </p>
          </button>

          <button
            onClick={handleChangeName}
            className="flex h-[50px] w-full items-center rounded-[5px] bg-white pl-0 transition-colors hover:bg-gray-50"
          >
            <p className="text-[16px] font-medium leading-[1.38] tracking-[-0.64px] text-gray-600">
              이름 변경하기
            </p>
          </button>

          <button
            onClick={handleChangePassword}
            className="flex h-[50px] w-full items-center rounded-[5px] bg-white pl-0 transition-colors hover:bg-gray-50"
          >
            <p className="text-[16px] font-medium leading-[1.38] tracking-[-0.64px] text-gray-600">
              비밀번호 변경
            </p>
          </button>

          <button
            onClick={handleSecessionClick}
            className="flex h-[50px] w-full items-center rounded-[5px] bg-white pl-0 transition-colors hover:bg-gray-50"
          >
            <p className="text-[16px] font-medium leading-[1.38] tracking-[-0.64px] text-gray-600">
              회원탈퇴
            </p>
          </button>

          <button
            onClick={handleLogout}
            className="flex h-[50px] w-full items-center rounded-[5px] bg-white pl-0 transition-colors hover:bg-gray-50"
          >
            <p className="text-[16px] font-medium leading-[1.38] tracking-[-0.64px] text-gray-600">
              로그아웃
            </p>
          </button>
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={handleModalCancel}
        title="탈퇴하기"
        description={
          "잠깐! 회원 탈퇴 시, 현재 보유 중인 포인트는 \n        모두 소멸됩니다. 계속 진행하시겠습니까?"
        }
        confirmText="회원탈퇴"
        cancelText="취소"
        onConfirm={handleModalConfirm}
      />
      {/* 계좌 개설 모달 */}
      <Modal
        isOpen={isAccountModalOpen}
        onClose={() => {
          // 진행 중일 때는 모달 닫히면 안되도록 방지
          if (accountModalStatus === "processing") return;
          setIsAccountModalOpen(false);
        }}
        showCancelButton={false} // children이 있으므로 사용되지 않음
      >
        {accountModalStatus === "processing" ? (
          /* ==============================
        🔵 "계좌 개설 진행 중" 모달
       ============================== */
          <div className="flex flex-col items-center p-6">
            <Image
              src="/images/account-loading.gif"
              alt="계좌 개설 진행중"
              width={80}
              height={80}
              className="mb-6"
            />
            <h2 className="text-[20px] font-semibold text-gray-700 mb-2">
              계좌 개설 진행 중
            </h2>
            <p className="text-[15px] text-gray-600 text-center mb-4">
              계좌를 개설하고 있습니다...
              <br />
              잠시만 기다려주세요.
            </p>
          </div>
        ) : (
          /* ==============================
        🟢 "계좌 개설 완료" 모달
       ============================== */
          <div className="flex flex-col items-center p-6">
            <Image
              src="/images/account-sucess.gif"
              alt="계좌 개설 완료"
              width={90}
              height={90}
              className="mb-6"
            />
            <h2 className="text-[20px] font-semibold text-gray-700 mb-2">
              계좌 개설 완료
            </h2>
            <p className="text-[15px] text-gray-600 text-center mb-6">
              계좌가 성공적으로 개설되었습니다!
            </p>
            <Button
              variant="primary"
              size="sm"
              className="w-full font-semibold"
              onClick={() => {
                setIsAccountModalOpen(false);
                window.location.reload();
              }}
            >
              확인
            </Button>
          </div>
        )}
      </Modal>
    </PageContainer>
  );
}
