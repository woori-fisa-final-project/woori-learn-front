"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import PageHeader from "@/components/common/PageHeader";
import PageContainer from "@/components/common/PageContainer";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleBack = () => {
    router.push("/mypage");
  };

  const handleSubmit = () => {
    if (newPassword !== confirmPassword) {
      alert("새 비밀번호가 일치하지 않습니다.");
      return;
    }
    if (currentPassword && newPassword && confirmPassword) {
      router.push("/mypage");
    }
  };

  const isButtonEnabled = currentPassword && newPassword && confirmPassword;

  return (
    <PageContainer>
      <PageHeader title="비밀번호 변경" onBack={handleBack} />

      <div className="mt-3 flex flex-col gap-1">
        <p className="pt-4 text-[18px] font-semibold leading-[1.5] text-gray-700">
          새롭게 비밀번호 변경하기
        </p>
        <p className="text-[14px] font-normal leading-[1.5] text-gray-500">
          보안을 위해 기존 비밀번호와 다르게 변경해주세요.
        </p>
      </div>

      <div className="mt-12 w-full space-y-6">
        <Input
          label="기존 비밀번호"
          type="password"
          placeholder="기존 비밀번호를 입력해주세요"
          value={currentPassword}
          onChange={(event) => setCurrentPassword(event.target.value)}
          showEyeIcon
        />

        <Input
          label="새 비밀번호"
          type="password"
          placeholder="새 비밀번호를 입력해주세요"
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
          showEyeIcon
        />

        <Input
          label="새 비밀번호 확인"
          type="password"
          placeholder="새 비밀번호를 다시 입력해주세요"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          showEyeIcon
        />
      </div>

      <div className="mt-10 w-full">
        <Button onClick={handleSubmit} disabled={!isButtonEnabled}>
          비밀번호 변경하기
        </Button>
      </div>
    </PageContainer>
  );
}
