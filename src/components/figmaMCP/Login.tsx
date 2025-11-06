"use client";
import { useState } from "react";
import Link from "next/link";
import Button from "@/components/common/Button";
import PasswordToggleIcon from "@/components/common/PasswordToggleIcon";

const checkIcon = "/images/checkicon.svg";
const logoImage = "/images/logo1.png";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <main className="bg-white min-h-screen flex flex-col items-center overflow-x-hidden">
      <div className="w-full max-w-[390px] mx-auto px-[20px] pt-[60px]">
      {/* Logo */}
        <div className="relative w-[150px] h-[86px] mt-[58px] mx-auto">
        <img
          alt="로고"
          className="w-full h-full object-contain"
          src={logoImage}
        />
      </div>

      {/* Input Fields */}
      <div className="flex flex-col gap-6 mt-[70px]">
        {/* ID Input */}
        <div className="flex flex-col gap-1.5">
            <div className="bg-white border-b border-gray-300 flex items-center px-4 py-[18px]">
            <input
              type="text"
              placeholder="ID"
                className="flex-1 text-[16px] text-gray-600 font-medium placeholder:text-gray-400 outline-none"
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="flex flex-col gap-1.5">
            <div className="bg-white border-b border-gray-300 flex items-center justify-end px-4 py-[18px]">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
                className="flex-1 text-[16px] text-gray-600 font-medium placeholder:text-gray-400 outline-none"
            />
            <PasswordToggleIcon
              showPassword={showPassword}
              onToggle={handleTogglePassword}
            />
          </div>
        </div>

        {/* Remember ID */}
        <div className="flex items-center gap-2 mt-[32px]">
            <div className="w-4 h-4 bg-primary-400 border border-primary-400 rounded-sm flex items-center justify-center">
              <img alt="체크" className="w-2.5 h-2.5 object-contain" src={checkIcon} />
          </div>
            <span className="text-[14px] text-gray-600">아이디 기억하기</span>
        </div>
      </div>

      {/* Login Button */}
      <div className="mt-[80px]">
          <Button variant="primary">
          로그인
          </Button>
      </div>

      {/* Signup Link */}
        <div className="mt-[20px] text-center">
          <p className="text-[16px] text-gray-400">
          계정이 없으신가요?{" "}
            <Link
            href="/signup" 
              className="text-[#648ddb] hover:text-[#2677cc] font-semibold underline decoration-solid underline-offset-2"
          >
            회원가입하기
            </Link>
        </p>
      </div>
    </div>
    </main>
  );
}
