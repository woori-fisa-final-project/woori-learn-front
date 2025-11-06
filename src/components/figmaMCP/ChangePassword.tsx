"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";

const backIcon = "/images/backicon.png";

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
          className="w-[14px] h-[7px] flex items-center justify-center -rotate-90"
        >
          <img alt="뒤로가기" className="w-[14px] h-[7px]" src={backIcon} />
        </button>
        <h1 className="text-[20px] text-[#414141] font-medium leading-[1.38] tracking-[-0.6px]">
          비밀번호 변경
        </h1>
      </div>

      {/* Password Input Fields */}
      <div className="mt-[70px] w-full flex flex-col gap-6">
        {/* Current Password */}
        <Input
          label="기존 비밀번호"
          type="password"
          placeholder="기존 비밀번호를 입력해주세요"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          showEyeIcon={true}
        />

        {/* New Password */}
        <Input
          label="새 비밀번호"
          type="password"
          placeholder="새 비밀번호를 입력해주세요"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          showEyeIcon={true}
        />

        {/* Confirm Password */}
        <Input
          label="새 비밀번호 확인"
          type="password"
          placeholder="새 비밀번호를 다시 입력해주세요"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          showEyeIcon={true}
        />
      </div>

      {/* Submit Button */}
      <div className="mt-[20px] w-full">
        <Button
          onClick={handleSubmit}
          disabled={!isButtonEnabled}
        >
          비밀번호 변경하기
        </Button>
      </div>
    </div>
  );
}


