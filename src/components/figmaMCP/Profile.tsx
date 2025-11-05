"use client";
import { useRouter } from "next/navigation";

const backIcon = "http://localhost:3845/assets/ebe55dd7c37ad06644920492f53f60e7455bb1db.svg";

export default function Profile() {
  const router = useRouter();

  const handleBack = () => {
    router.push("/home");
  };

  const handleChangePassword = () => {
    router.push("/mypage/password");
  };

  const handleSecession = () => {
    router.push("/mypage/withdraw");
  };

  return (
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
          내 정보
        </h1>
      </div>

      {/* User Info Section */}
      <div className="mt-[70px] w-full flex flex-col gap-6">
        {/* Name */}
        <div className="flex flex-col gap-2">
          <label className="text-[16px] text-[#4a4a4a] font-medium leading-[25px]">이름</label>
          <div className="border border-[#cbcad7] rounded-[6px] h-[58px] w-full flex items-center px-5">
            <p className="text-[16px] text-[#4a4a4a]">홍길동</p>
          </div>
        </div>

        {/* Points */}
        <div className="flex flex-col gap-2">
          <label className="text-[16px] text-[#4a4a4a] font-medium leading-[25px]">포인트</label>
          <div className="border border-[#cbcad7] rounded-[6px] h-[58px] w-full flex items-center px-5">
            <p className="text-[16px] text-[#4a4a4a]">1,000 P</p>
          </div>
        </div>
      </div>

      {/* Menu Section */}
      <div className="mt-[48px] w-full flex flex-col gap-4">
        {/* Change Password */}
        <button
          onClick={handleChangePassword}
          className="w-full h-[60px] bg-[#648ddb] rounded-[10px] text-[16px] text-white font-semibold leading-[1.38] tracking-[-0.48px]"
        >
          비밀번호 변경
        </button>

        {/* Secession */}
        <button
          onClick={handleSecession}
          className="w-full h-[60px] bg-[#f5f5f5] rounded-[10px] text-[16px] text-[#4a4a4a] font-semibold leading-[1.38] tracking-[-0.48px]"
        >
          회원탈퇴
        </button>
      </div>
    </div>
  );
}


