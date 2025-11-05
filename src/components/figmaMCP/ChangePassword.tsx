"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

const backIcon = "http://localhost:3845/assets/ebe55dd7c37ad06644920492f53f60e7455bb1db.svg";
const eyeIcon = "http://localhost:3845/assets/6b39f66697753285f15b18f61b24258db27a7419.svg";

export default function ChangePassword() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleBack = () => {
    router.push("/mypage/profile");
  };

  const handleSubmit = () => {
    if (currentPassword && newPassword && confirmPassword) {
      // 비밀번호 변경 로직
      router.push("/mypage/profile");
    }
  };

  const isButtonEnabled = currentPassword && newPassword && confirmPassword;

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
          비밀번호 변경
        </h1>
      </div>

      {/* Password Input Fields */}
      <div className="mt-[70px] w-full flex flex-col gap-6">
        {/* Current Password */}
        <div className="flex flex-col gap-[8px]">
          <label className="text-[16px] text-[#4a4a4a] font-medium leading-[25px]">
            기존 비밀번호
          </label>
          <div className="border border-[#cbcad7] rounded-[6px] h-[64px] w-full flex items-center justify-between px-5">
            <input
              type="password"
              placeholder="기존 비밀번호를 입력해주세요"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="flex-1 text-[16px] text-[#4a4a4a] placeholder:text-[#c3c3c3] outline-none"
            />
            <div className="w-6 h-6 relative shrink-0">
              <img alt="비밀번호 보기" className="w-full h-full" src={eyeIcon} />
            </div>
          </div>
        </div>

        {/* New Password */}
        <div className="flex flex-col gap-[8px]">
          <label className="text-[16px] text-[#4a4a4a] font-medium leading-[25px]">
            새 비밀번호
          </label>
          <div className="border border-[#cbcad7] rounded-[6px] h-[64px] w-full flex items-center justify-between px-5">
            <input
              type="password"
              placeholder="새 비밀번호를 입력해주세요"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="flex-1 text-[16px] text-[#4a4a4a] placeholder:text-[#c3c3c3] outline-none"
            />
            <div className="w-6 h-6 relative shrink-0">
              <img alt="비밀번호 보기" className="w-full h-full" src={eyeIcon} />
            </div>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col gap-[8px]">
          <label className="text-[16px] text-[#4a4a4a] font-medium leading-[25px]">
            새 비밀번호 확인
          </label>
          <div className="border border-[#cbcad7] rounded-[6px] h-[64px] w-full flex items-center justify-between px-5">
            <input
              type="password"
              placeholder="새 비밀번호를 다시 입력해주세요"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="flex-1 text-[16px] text-[#4a4a4a] placeholder:text-[#c3c3c3] outline-none"
            />
            <div className="w-6 h-6 relative shrink-0">
              <img alt="비밀번호 보기" className="w-full h-full" src={eyeIcon} />
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-[121px] w-full">
        <button
          onClick={handleSubmit}
          disabled={!isButtonEnabled}
          className={`w-full h-[60px] rounded-[10px] text-[16px] text-white font-semibold leading-[1.38] tracking-[-0.48px] ${
            isButtonEnabled
              ? "bg-[#648DDB] cursor-pointer"
              : "bg-[#648DDB]/50 cursor-not-allowed"
          }`}
        >
          비밀번호 변경하기
        </button>
      </div>
    </div>
  );
}


