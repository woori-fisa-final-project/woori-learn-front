"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "@/components/common/Button";
import PasswordToggleIcon from "@/components/common/PasswordToggleIcon";

const logoImage = "/images/logo1.png";

export default function LoginPage() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <main className="flex min-h-screen items-start justify-center overflow-x-hidden bg-white">
      <div className="w-full max-w-[min(100%,_430px)] px-[20px] pt-[60px] sm:max-w-[480px] md:max-w-[560px] lg:max-w-[768px]">
        <div className="relative mx-auto mt-[58px] h-[86px] w-[150px]">
          <img alt="로고" className="h-full w-full object-contain" src={logoImage} />
        </div>

        <div className="mt-[70px] flex flex-col gap-6">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center border-b border-gray-300 bg-white px-4 py-[18px]">
              <input
                type="text"
                placeholder="ID"
                value={id}
                onChange={(event) => setId(event.target.value)}
                className="flex-1 text-[16px] font-medium text-gray-600 placeholder:text-gray-400 outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-end border-b border-gray-300 bg-white px-4 py-[18px]">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="flex-1 text-[16px] font-medium text-gray-600 placeholder:text-gray-400 outline-none"
              />
              <PasswordToggleIcon showPassword={showPassword} onToggle={handleTogglePassword} />
            </div>
          </div>

          <div className="mt-[32px] flex items-center gap-2">
            <input type="checkbox" id="remember-id" className="h-4 w-4 rounded-sm border-primary-400 text-primary-400 focus:ring-primary-400" />
            <label htmlFor="remember-id" className="text-[14px] text-gray-600">
              아이디 기억하기
            </label>
          </div>
        </div>

        <div className="mt-[80px]">
          <Button variant="primary">로그인</Button>
        </div>

        <div className="mt-[20px] text-center">
          <p className="text-[16px] text-gray-400">
            계정이 없으신가요?{" "}
            <Link href="/signup" className="font-semibold text-[#648ddb] underline decoration-solid underline-offset-2 hover:text-[#2677cc]">
              회원가입하기
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
