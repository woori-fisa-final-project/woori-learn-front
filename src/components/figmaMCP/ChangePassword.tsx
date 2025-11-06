"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import PageHeader from "@/components/common/PageHeader";
import PageContainer from "@/components/common/PageContainer";

export default function ChangePassword() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleBack = () => {
    router.push("/mypage");
  };

  const handleSubmit = () => {
    if (currentPassword && newPassword && confirmPassword) {
      // 비밀번호 변경 로직
      router.push("/mypage");
    }
  };

  const isButtonEnabled = currentPassword && newPassword && confirmPassword;

  return (
    <PageContainer>
      <PageHeader title="비밀번호 변경" onBack={handleBack} />

      {/* Subtitle */}
      <div className="mt-3 flex flex-col gap-1">
        <p className="text-[18px] text-gray-700 font-semibold pt-4 leading-[1.5]">
          새롭게 비밀번호 변경하기
        </p>
        <p className="text-[14px] text-gray-500 font-normal leading-[1.5]">
          보안을 위해 기존 비밀번호와 다르게 변경해주세요.
        </p>
      </div>

      {/* Password Input Fields */}
      <div className="mt-12 w-full space-y-6">
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
      <div className="mt-10 w-full">
        <Button onClick={handleSubmit} disabled={!isButtonEnabled}>
          비밀번호 변경하기
        </Button>
      </div>
    </PageContainer>
  );
}


