"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";

const backIcon = "/images/backicon.png";
interface SignupStep1Props {
  onBack?: () => void;
}

export default function SignupStep1({ onBack }: SignupStep1Props) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const isAllFieldsFilled = name.trim() !== "" && id.trim() !== "" && password.trim() !== "" && confirmPassword.trim() !== "";

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.push("/login");
    }
  };

  const handleSignup = () => {
    if (isAllFieldsFilled) {
      // 회원가입 로직 수행 후 로그인 페이지로 이동
      router.push("/login");
    }
  };

  const handleDuplicateCheck = () => {
    if (id.trim() !== "") {
      // 중복 확인 로직
      console.log("중복 확인:", id);
    }
  };

  const isIdFilled = id.trim() !== "";

  return (
    <div className="bg-white relative w-full min-h-screen px-5 pt-[60px]">
      {/* Header */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleBack}
          className="w-[14px] h-[7px] flex items-center justify-center -rotate-90"
        >
          <img alt="뒤로가기" className="w-[14px] h-[7px]" src={backIcon} />
        </button>
        <h1 className="text-[20px] text-[#414141] font-medium leading-[1.38] tracking-[-0.6px]">
          회원가<span className="tracking-[-0.8px]">입</span>
        </h1>
      </div>

      {/* Name Input */}
      <Input
        label="이름"
        type="text"
        placeholder="이름을 입력해주세요"
        value={name}
        onChange={(e) => setName(e.target.value)}
        height="sm"
        className="mt-[50px]"
      />

      {/* ID Input */}
      <div className="mt-[48px] flex flex-col gap-[8px]">
        <label className="text-[16px] text-[#4a4a4a] font-medium leading-[25px]">
          아이디
        </label>
        <div className="flex gap-2 items-center">
          <Input
            type="text"
            placeholder="아이디를 입력해주세요"
            value={id}
            onChange={(e) => setId(e.target.value)}
            className="flex-1"
            wrapperClassName="w-full"
          />
          <Button
            onClick={handleDuplicateCheck}
            disabled={!isIdFilled}
            size="sm"
            fullWidth={false}
            className="w-[70px]"
          >
            중복 확인
          </Button>
        </div>
      </div>

      {/* Password Input */}
      <Input
        label="비밀번호"
        type="password"
        placeholder="비밀번호를 입력해주세요"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        showEyeIcon={true}
        className="mt-[20px]"
      />

      {/* Password Confirm Input */}
      <Input
        label="비밀번호 재입력"
        type="password"
        placeholder="비밀번호를 다시 입력해주세요"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        showEyeIcon={true}
        className="mt-[20px]"
      />

      {/* Signup Button */}
      <div className="mt-[20px]">
        <Button
          onClick={handleSignup}
          disabled={!isAllFieldsFilled}
        >
          회원가입
        </Button>
      </div>

      {/* Login Link */}
      <div className="mt-[20px] text-center">
        <p className="text-[16px] leading-[25px] tracking-[0.08px]">
          <span className="text-[#c3c3c3]">이미 계정이 있으신가요? </span>
          <Link
            href="/login"
            className="text-[#648ddb] font-semibold underline decoration-solid underline-offset-2"
          >
            로그인하기
          </Link>
        </p>
      </div>
    </div>
  );
}
