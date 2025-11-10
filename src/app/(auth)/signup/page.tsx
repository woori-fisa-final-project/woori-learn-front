"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";

const backIcon = "/images/backicon.png";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const isAllFieldsFilled = name.trim() !== "" && id.trim() !== "" && password.trim() !== "" && confirmPassword.trim() !== "" && password === confirmPassword;
  const handleBack = () => {
    router.push("/login");
  };

  const handleSignup = () => {
    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (isAllFieldsFilled) {
      router.push("/login");
    }
  };

  const handleDuplicateCheck = () => {
    if (id.trim() !== "") {
      console.log("중복 확인:", id);
    }
  };

  const isIdFilled = id.trim() !== "";

  return (
    <main className="flex min-h-screen items-start justify-center overflow-x-hidden bg-white">
      <div className="w-full max-w-[min(100%,_430px)] px-[20px] pt-[60px] sm:max-w-[480px] md:max-w-[560px] lg:max-w-[768px]">
        <div className="flex w-full items-center gap-2">
          <button onClick={handleBack} className="w-[14px] h-[7px] flex items-center justify-center -rotate-90" aria-label="뒤로가기">
            <img alt="뒤로가기" className="h-[7px] w-[14px] object-contain" src={backIcon} />
          </button>
          <h1 className="text-[20px] font-medium leading-[1.38] tracking-[-0.6px] text-gray-700">
            회원가<span className="tracking-[-0.8px]">입</span>
          </h1>
        </div>

        <Input
          label="이름"
          type="text"
          placeholder="이름을 입력해주세요"
          value={name}
          onChange={(event) => setName(event.target.value)}
          height="sm"
          className="mt-[50px]"
        />

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

        <Input
          label="비밀번호"
          type="password"
          placeholder="비밀번호를 입력해주세요"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          showEyeIcon
          className="mt-[20px]"
        />

        <Input
          label="비밀번호 재입력"
          type="password"
          placeholder="비밀번호를 다시 입력해주세요"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          showEyeIcon
          className="mt-[20px]"
        />

        <div className="mt-[20px]">
          <Button onClick={handleSignup} disabled={!isAllFieldsFilled}>
            회원가입
          </Button>
        </div>

        <div className="mt-[20px] text-center">
          <p className="text-[16px] leading-[25px] tracking-[0.08px]">
            <span className="text-gray-400">이미 계정이 있으신가요? </span>
            <Link href="/login" className="font-semibold text-[#648ddb] underline decoration-solid underline-offset-2 hover:text-[#2677cc]">
              로그인하기
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

