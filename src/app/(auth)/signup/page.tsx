/**
 * [SECURITY UPDATE] Gemini feedback 적용
 * - Replaced intrusive alert with inline error messaging
 * - Documented secure UX considerations for signup validation
 */
"use client"; // 이 페이지는 클라이언트 컴포넌트로 동작하여 상태와 브라우저 API를 활용합니다.

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import Image from "next/image";

const backIcon = "/images/backicon.png"; // 뒤로가기 버튼에서 사용할 아이콘 경로입니다.

export default function SignupPage() {
  const router = useRouter(); // 페이지 이동을 위해 Next.js 라우터 인스턴스를 얻습니다.
  const [name, setName] = useState(""); // 사용자 이름 입력값을 저장합니다.
  const [id, setId] = useState(""); // 아이디 입력값을 관리합니다.
  const [password, setPassword] = useState(""); // 첫 번째 비밀번호 입력값을 저장합니다.
  const [confirmPassword, setConfirmPassword] = useState(""); // 비밀번호 재입력값으로 일치 여부를 확인합니다.
  const [error, setError] = useState(""); // 검증 실패 시 보여줄 에러 메시지를 보관합니다.

  const isAllFieldsFilled =
    name.trim() !== "" &&
    id.trim() !== "" &&
    password.trim() !== "" &&
    confirmPassword.trim() !== "" &&
    password === confirmPassword;

  const handleBack = () => {
    router.push("/login"); // 뒤로가기 클릭 시 로그인 페이지로 이동합니다.
  };

  const handleSignup = () => {
    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다. 다시 확인해주세요."); // 두 비밀번호가 다르면 경고 메시지를 표시합니다.
      return;
    }

    setError(""); // 모든 검증을 통과했으므로 에러 메시지를 초기화합니다.
    if (isAllFieldsFilled) {
      // NOTE: 실제 가입 처리는 서버에서 수행되어야 하며, 성공 시 아래 라우팅 수행.
      router.push("/login"); // 모든 입력이 유효하면 로그인 페이지로 이동합니다.
    }
  };

  const handleDuplicateCheck = () => {
    if (id.trim() !== "") {
      // NOTE: Replace with secure server-side availability check.
      console.warn("Duplicate ID check should call a secure API endpoint.");
    }
  };

  const isIdFilled = id.trim() !== ""; // 아이디가 입력되었는지 여부를 저장해 버튼 활성화를 제어합니다.

  return (
    <main className="flex min-h-screen items-start justify-center overflow-x-hidden bg-white">
      <div className="w-full max-w-[min(100%,_430px)] px-[20px] pt-[60px] sm:max-w-[480px] md:max-w-[560px] lg:max-w-[768px]">
        {/* 상단 헤더: 뒤로가기 버튼과 페이지 제목을 보여줍니다. */}
        <div className="flex w-full items-center gap-2">
          <button
            onClick={handleBack}
            className="h-[7px] w-[14px] flex items-center justify-center -rotate-90"
            aria-label="뒤로가기"
          >
            <Image alt="뒤로가기" className="h-[7px] w-[14px] object-contain" src={backIcon} width={14} height={7} />
          </button>
          <h1 className="text-[20px] font-medium leading-[1.38] tracking-[-0.6px] text-gray-700">
            회원가<span className="tracking-[-0.8px]">입</span>
          </h1>
        </div>

        {/* 이름 입력 필드: name 상태를 갱신하여 서버 전송에 대비합니다. */}
        <Input
          label="이름"
          type="text"
          placeholder="이름을 입력해주세요"
          value={name}
          onChange={(event) => setName(event.target.value)}
          height="sm"
          className="mt-[50px]"
        />

        {/* 아이디 입력과 중복 확인 버튼 영역입니다. */}
        <div className="mt-[48px] flex w-full flex-col gap-[8px]">
          <label className="text-[16px] font-medium leading-[25px] text-gray-600">아이디</label>
          <div className="flex w-full items-center gap-2">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="아이디를 입력해주세요"
                value={id}
                onChange={(event) => setId(event.target.value)}
                wrapperClassName="w-full"
              />
            </div>
            {/* 중복 확인 버튼: 아이디 입력 시에만 활성화합니다. */}
            <Button
              onClick={handleDuplicateCheck}
              disabled={!isIdFilled}
              size="sm"
              fullWidth={false}
              className="h-[58px] w-[70px] shrink-0"
            >
              중복 확인
            </Button>
          </div>
        </div>

        {/* 비밀번호 입력 필드: showEyeIcon으로 가시성을 조절합니다. */}
        <Input
          label="비밀번호"
          type="password"
          placeholder="비밀번호를 입력해주세요"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          showEyeIcon
          className="mt-[20px]"
        />

        {/* 비밀번호 확인 필드: confirmPassword 상태를 갱신합니다. */}
        <Input
          label="비밀번호 재입력"
          type="password"
          placeholder="비밀번호를 다시 입력해주세요"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          showEyeIcon
          className="mt-[20px]"
        />

        {/* 비밀번호 불일치 등 검증 실패 시 에러 메시지를 노출합니다. */}
        {error && (
          <p className="mt-[12px] text-[14px] font-medium text-red-500" role="alert">
            {error}
          </p>
        )}

        {/* 모든 입력이 유효할 때만 활성화되는 가입 버튼입니다. */}
        <div className="mt-[20px]">
          <Button onClick={handleSignup} disabled={!isAllFieldsFilled}>
            회원가입
          </Button>
        </div>

        {/* 기존 계정 보유자를 위한 로그인 링크 안내입니다. */}
        <div className="mt-[20px] text-center">
          <p className="text-[16px] leading-[25px] tracking-[0.08px]">
            <span className="text-gray-400">이미 계정이 있으신가요? </span>
            <Link
              href="/login"
              className="font-semibold text-[#648ddb] underline decoration-solid underline-offset-2 hover:text-[#2677cc]"
            >
              로그인하기
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

