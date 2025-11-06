import Link from "next/link";
import Button from "@/components/common/Button";

const eyeIcon = "/images/eyeicon.png";
const checkIcon = "/images/checkicon.svg";
const logoImage = "/images/logo1.png";

export default function Login() {
  return (
    <div className="bg-white relative w-full min-h-screen pt-[60px]">
      {/* Logo */}
      <div className="relative w-[150px] h-[86px] mt-[118px]">
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
          <div className="bg-white border-b border-[#e5e5e5] flex items-center px-4 py-[18px]">
            <input
              type="text"
              placeholder="ID"
              className="flex-1 text-[16px] text-[#4a4a4a] font-medium placeholder:text-[#c3c3c3] outline-none"
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="flex flex-col gap-1.5">
          <div className="bg-white border-b border-[#e5e5e5] flex items-center justify-end px-4 py-[18px]">
            <input
              type="password"
              placeholder="Password"
              className="flex-1 text-[16px] text-[#4a4a4a] font-medium placeholder:text-[#c3c3c3] outline-none"
            />
            <div className="w-5 h-5 relative shrink-0 ml-2">
              <img
                alt="비밀번호 보기"
                className="w-full h-full"
                src={eyeIcon}
              />
            </div>
          </div>
        </div>

        {/* Remember ID */}
        <div className="flex items-center gap-2 mt-[32px]">
          <div className="w-4 h-4 bg-[#648ddb] border border-[#648ddb] rounded-sm flex items-center justify-center">
            <img alt="체크" className="w-2.5 h-2.5" src={checkIcon} />
          </div>
          <span className="text-[14px] text-[#4a4a4a]">아이디 기억하기</span>
        </div>
      </div>

      {/* Login Button */}
      <div className="mt-[80px]">
        <Button>
          로그인
        </Button>
      </div>

      {/* Signup Link */}
      <div className="mt-[20px] text-center">
        <p className="text-[16px] text-[#c3c3c3]">
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
  );
}
