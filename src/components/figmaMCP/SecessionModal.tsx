"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "@/components/common/Button";

const backIcon = "/images/backicon.svg";

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

  return (
    <>
      <main className="bg-white min-h-screen flex flex-col items-center overflow-x-hidden">
        <div className="w-full max-w-[390px] mx-auto px-[20px] pt-[60px] flex flex-col items-center justify-start">
          {/* Header */}
          <div className="flex items-center gap-2 w-full">
            <button
              onClick={handleBack}
              className="w-[14px] h-[7px] flex items-center justify-center -rotate-90"
            >
              <img alt="뒤로가기" className="w-[14px] h-[7px] object-contain" src={backIcon} />
            </button>
            <h1 className="text-[20px] text-gray-700 font-medium leading-[1.38] tracking-[-0.6px]">
              회원탈퇴
            </h1>
          </div>

          {/* Content */}
          <div className="mt-[70px] w-full flex flex-col gap-6">
            <p className="text-[16px] text-gray-600 leading-[25px]">
              회원탈퇴를 진행하시겠습니까?
              <br />
              탈퇴 후에는 모든 데이터가 삭제되며 복구할 수 없습니다.
            </p>
          </div>

          {/* Secession Button */}
          <div className="mt-[121px] w-full">
            <Button
              onClick={handleSecessionClick}
              variant="secondary"
            >
              회원탈퇴
            </Button>
          </div>
        </div>
      </main>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 pt-[200px] overflow-x-hidden"
          style={{ zIndex: 9999 }}
        >
          {/* Modal */}
          <div 
            style={{ 
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              width: '350px',
              maxWidth: 'calc(100vw - 40px)',
              margin: '0 auto',
              padding: '24px',
              position: 'relative',
              zIndex: 10000,
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h2 style={{ 
              fontSize: '20px', 
              color: '#414141', 
              fontWeight: 600, 
              textAlign: 'center', 
              marginBottom: '24px',
              margin: '0 0 24px 0',
            }}>
              정말로 탈퇴하시겠습니까?
            </h2>
            <p style={{ 
              fontSize: '16px', 
              color: '#4a4a4a', 
              textAlign: 'center', 
              marginBottom: '32px',
              margin: '0 0 32px 0',
            }}>
              탈퇴 후에는 모든 데이터가 삭제되며 복구할 수 없습니다.
            </p>
            <div style={{ 
              display: 'flex', 
              gap: '12px', 
              width: '100%',
            }}>
              <button
                onClick={handleCancel}
                type="button"
                style={{
                  flex: 1,
                  height: '50px',
                  minHeight: '50px',
                  backgroundColor: '#f5f5f5',
                  color: '#4a4a4a',
                  borderRadius: '10px',
                  fontSize: '16px',
                  fontWeight: 600,
                  border: 'none',
                  outline: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                취소
              </button>
              <button
                onClick={handleConfirm}
                type="button"
                style={{
                  flex: 1,
                  height: '50px',
                  minHeight: '50px',
                  backgroundColor: '#648ddb',
                  color: '#ffffff',
                  borderRadius: '10px',
                  fontSize: '16px',
                  fontWeight: 600,
                  border: 'none',
                  outline: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                회원탈퇴
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


