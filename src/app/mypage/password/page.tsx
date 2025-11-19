/**
 * [SECURITY UPDATE] Gemini feedback 적용
 * - Replaced intrusive alert with inline error messaging
 * - Maintained UX consistency with signup form validation
 */
"use client";

import { useRouter } from "next/navigation"; // 페이지 이동을 처리하기 위해 라우터 훅을 가져옵니다.
import { useState } from "react"; // 입력 상태를 관리하기 위한 React 상태 훅입니다.
import Input from "@/components/common/Input"; // 공통 입력 컴포넌트를 불러옵니다.
import Button from "@/components/common/Button"; // 제출 버튼에 사용할 공통 버튼입니다.
import PageHeader from "@/components/common/PageHeader"; // 페이지 상단 헤더 영역을 구성하는 컴포넌트입니다.
import PageContainer from "@/components/common/PageContainer"; // 페이지 전체 레이아웃을 감싸는 컨테이너입니다.
import { changePassword } from "./changePassword";

export default function ChangePasswordPage() {
  const router = useRouter(); // 다른 페이지로 이동하기 위해 라우터 인스턴스를 사용합니다.
  const [currentPassword, setCurrentPassword] = useState(""); // 기존 비밀번호 입력값을 저장합니다.
  const [newPassword, setNewPassword] = useState(""); // 새 비밀번호 입력값을 관리합니다.
  const [confirmPassword, setConfirmPassword] = useState(""); // 새 비밀번호 확인 입력값을 저장합니다.
  const [error, setError] = useState(""); // 비밀번호 불일치 등 검증 실패 시 표시할 메시지입니다.
  const [isLoading, setIsLoading] = useState(false);

  const handleBack = () => {
    router.push("/mypage"); // 상단 뒤로가기 선택 시 마이페이지로 이동합니다.
  };

  function checkPassword(password: string) {
    let error = ""
    if (password.length < 8) error = "8자 이상 입력이 필요합니다.";
    else if (!/[A-Za-z]/.test(password)) error = "영문이 1자 이상 포함되어야 합니다.";
    else if (!/\d/.test(password)) error = "숫자가 1자 이상 포함되어야 합니다.";
    else if (!/[!@#$%^&*()~_+\-[\]{};':"\\|,.<>/?]/.test(password)) error = "특수문자가 1자 이상 포함되어야 합니다.";
    return error;
  }

  const handleSubmit = async() => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      if (newPassword !== confirmPassword) {
        setError("새 비밀번호가 일치하지 않습니다. 다시 확인해주세요.");
        return;
      }

      if (currentPassword === newPassword) {
        setError("기존 비밀번호와 동일한 비밀번호로는 변경할 수 없습니다.");
        return;
      }

      if (/\s/.test(newPassword)) {
        setError("비밀번호에 공백을 포함할 수 없습니다.");
        return;
      }

      const passwordError = checkPassword(newPassword);
      if (passwordError) {
        setError(passwordError);
        return;
      }

      setError("");
      await changePassword(currentPassword, newPassword);
      router.push("/mypage");
    } catch (e) {
      setError("비밀번호 변경에 실패하였습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const isButtonEnabled = currentPassword && newPassword && confirmPassword; // 세 필드가 모두 채워진 경우에만 버튼을 활성화합니다.

  return (
    <PageContainer>
      <PageHeader title="비밀번호 변경" onBack={handleBack} /> {/* 상단 헤더와 뒤로가기 버튼 */}

      <div className="mt-3 flex flex-col gap-1">
        <p className="pt-4 text-[18px] font-semibold leading-normal text-gray-700">
          새롭게 비밀번호 변경하기
        </p>
        <p className="text-[14px] font-normal leading-normal text-gray-500">
          보안을 위해 기존 비밀번호와 다르게 변경해주세요.
        </p>
        <p className="text-[14px] font-normal leading-normal text-gray-500">
          8~20자 이내, 숫자와 영문 및 특수문자를 포함해 주세요.
        </p>
      </div>

      <div className="mt-12 w-full space-y-6">
        {/* 기존 비밀번호 입력 필드 */}
        <Input
          label="기존 비밀번호"
          type="password"
          placeholder="기존 비밀번호를 입력해주세요"
          value={currentPassword}
          onChange={(event) => setCurrentPassword(event.target.value)}
          showEyeIcon
        />

        {/* 새 비밀번호 입력 필드 */}
        <Input
          label="새 비밀번호"
          type="password"
          placeholder="새 비밀번호를 입력해주세요"
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
          showEyeIcon
        />

        {/* 새 비밀번호 확인 입력 필드 */}
        <Input
          label="새 비밀번호 확인"
          type="password"
          placeholder="새 비밀번호를 다시 입력해주세요"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          showEyeIcon
        />
      </div>

      {/* 에러가 존재할 때만 경고 문구를 노출합니다. */}
      {error && (
        <p className="mt-2 text-sm font-medium text-red-500" role="alert">
          {error}
        </p>
      )}

      <div className="mt-10 w-full">
        <Button onClick={handleSubmit} disabled={!isButtonEnabled || isLoading}>
          비밀번호 변경하기
        </Button>
      </div>
    </PageContainer>
  );
}
