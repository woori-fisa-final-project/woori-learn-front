"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/components/common/Button";
import PasswordToggleIcon from "@/components/common/PasswordToggleIcon";
import Image from "next/image";

const logoImage = "/images/logo1.png";

export default function LoginPage() {
  // 입력한 아이디 값을 관리하며 로그인 요청 및 아이디 저장 기능에 사용됩니다.
  const [id, setId] = useState("");
  // 입력한 비밀번호 값을 관리하고 로그인 시 전달할 정보를 보관합니다.
  const [password, setPassword] = useState("");
  // 사용자가 아이디 기억하기 체크박스를 선택했는지를 저장하며 localStorage 연동에 활용됩니다.
  const [rememberId, setRememberId] = useState(false);
  // 비밀번호 표시/숨김 토글 상태를 관리해 입력 필드의 type을 전환합니다.
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // 브라우저 환경에서만 localStorage를 조회하도록 서버 렌더링 시 안전 장치를 둡니다.
    if (typeof window === "undefined") return;
    // 이전 로그인에서 저장된 아이디 값을 localStorage에서 불러옵니다.
    const savedId = localStorage.getItem("rememberedId");
    if (savedId) {
      // 저장된 아이디가 있으면 입력 필드에 채워 넣고 체크박스도 자동으로 선택 상태로 만듭니다.
      setId(savedId);
      setRememberId(true);
    }
  }, []);

  const handleTogglePassword = () => {
    // 현재 비밀번호 표시 여부를 반전시켜 입력 필드의 type을 즉시 전환합니다.
    setShowPassword((prev) => !prev);
  };

  const handleLogin = () => {
    // 브라우저 환경에서만 아이디 저장 로직이 동작하도록 보장합니다.
    if (typeof window !== "undefined") {
      if (rememberId) {
        // 체크박스가 선택된 경우 입력한 아이디를 localStorage에 저장합니다.
        localStorage.setItem("rememberedId", id);
      } else {
        // 체크박스가 선택되지 않았다면 기존에 저장된 아이디 정보를 삭제합니다.
        localStorage.removeItem("rememberedId");
      }
    }
    // TODO: 로그인 로직 추가 예정
  };

  return (
    <main className="flex min-h-screen items-start justify-center overflow-x-hidden bg-white">
      <div className="w-full max-w-[min(100%,_430px)] px-[20px] pt-[60px] sm:max-w-[480px] md:max-w-[560px] lg:max-w-[768px]">
        {/* 상단 로고 영역으로 서비스 브랜드 아이덴티티를 강조합니다. */}
        <div className="relative mx-auto mt-[58px] h-[86px] w-[150px]">
          <Image alt="로고" className="h-full w-full object-contain" src={logoImage} width={150} height={86} />
        </div>

        {/* 로그인 입력 필드 묶음 영역입니다. */}
        <div className="mt-[70px] flex flex-col gap-6">
          {/* 아이디 입력 필드: 텍스트 입력을 받아 상태에 반영합니다. */}
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

          {/* 비밀번호 입력 필드: 토글 아이콘으로 입력값을 숨기거나 표시할 수 있습니다. */}
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

          {/* 아이디 기억하기 체크박스: 사용자의 선택을 rememberId 상태에 반영합니다. */}
          <div className="mt-[32px] flex items-center gap-2">
            <input
              type="checkbox"
              id="remember-id"
              checked={rememberId}
              onChange={(event) => setRememberId(event.target.checked)}
              className="h-4 w-4 rounded-sm border-primary-400 text-primary-400 focus:ring-primary-400"
            />
            <label htmlFor="remember-id" className="text-[14px] text-gray-600">
              아이디 기억하기
            </label>
          </div>
        </div>

        {/* 로그인 버튼 영역: 클릭 시 handleLogin 로직이 실행됩니다. */}
        <div className="mt-[80px]">
          <Button variant="primary" onClick={handleLogin}>
            로그인
          </Button>
        </div>

        {/* 회원가입 유도 메시지와 링크를 노출해 신규 가입 경로를 안내합니다. */}
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
