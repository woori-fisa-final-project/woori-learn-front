"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const backIcon = "http://localhost:3845/assets/ebe55dd7c37ad06644920492f53f60e7455bb1db.svg";

export default function SecessionModal() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBack = () => {
    router.push("/mypage/profile");
  };

  const handleSecessionClick = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleConfirm = () => {
    // 회원탈퇴 로직
    setIsModalOpen(false);
    router.push("/login");
  };

  // 모달이 열릴 때 배경 스크롤 막기
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  return (
    <>
      <div className="bg-white relative w-full min-h-screen max-w-[390px] w-full mx-auto px-[20px] pt-[60px] flex flex-col items-center justify-start">
        {/* Header */}
        <div className="flex items-center gap-2 w-full">
          <button
            onClick={handleBack}
            className="w-7 h-7 flex items-center justify-center rotate-90"
          >
            <img alt="뒤로가기" className="w-3.5 h-3.5" src={backIcon} />
          </button>
          <h1 className="text-[20px] text-[#414141] font-medium leading-[1.38] tracking-[-0.6px]">
            회원탈퇴
          </h1>
        </div>

        {/* Content */}
        <div className="mt-[70px] w-full flex flex-col gap-6">
          <p className="text-[16px] text-[#4a4a4a] leading-[25px]">
            회원탈퇴를 진행하시겠습니까?
            <br />
            탈퇴 후에는 모든 데이터가 삭제되며 복구할 수 없습니다.
          </p>
        </div>

        {/* Secession Button */}
        <div className="mt-[121px] w-full">
          <button
            onClick={handleSecessionClick}
            className="w-full h-[60px] bg-[#f5f5f5] rounded-[10px] text-[16px] text-[#4a4a4a] font-semibold leading-[1.38] tracking-[-0.48px]"
          >
            회원탈퇴
          </button>
        </div>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 pt-[200px]">
          {/* Modal */}
          <div className="bg-white rounded-[20px] w-[350px] mx-auto p-6 animate-slideDown">
            <h2 className="text-[20px] text-[#414141] font-semibold text-center mb-6">
              정말로 탈퇴하시겠습니까?
            </h2>
            <p className="text-[16px] text-[#4a4a4a] text-center mb-8">
              탈퇴 후에는 모든 데이터가 삭제되며 복구할 수 없습니다.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className="flex-1 h-[50px] bg-[#f5f5f5] rounded-[10px] text-[16px] text-[#4a4a4a] font-semibold"
              >
                취소
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 h-[50px] bg-[#648DDB] rounded-[10px] text-[16px] text-white font-semibold"
              >
                회원탈퇴
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideDown {
          from {
            transform: translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </>
  );
}


