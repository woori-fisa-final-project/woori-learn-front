"use client";

import { useRouter } from "next/navigation";

const backIcon = "/images/backicon.png";
const eyeIcon = "/images/eyeicon.png";
interface SignupStep1Props {
  onBack?: () => void;
}

export default function SignupStep1({ onBack }: SignupStep1Props) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="bg-white relative w-full min-h-screen px-5 pt-[60px]">
      {/* Header */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleBack}
          className="w-7 h-7 flex items-center justify-center rotate-90"
        >
          <img alt="뒤로가기" className="w-3.5 h-3.5" src={backIcon} />
        </button>
        <h1 className="text-[20px] text-[#414141] font-medium leading-[1.38] tracking-[-0.6px]">
          회원가<span className="tracking-[-0.8px]">입</span>
        </h1>
      </div>

      {/* Name Input */}
      <div className="mt-[18px] flex flex-col gap-[8px]">
        <label className="text-[16px] text-[#4a4a4a] font-medium leading-[25px]">이름</label>
        <div className="border border-[#cbcad7] rounded-[6px] h-[58px] w-full flex items-center px-5">
          <input
            type="text"
            placeholder="이름을 입력해주세요"
            className="flex-1 text-[16px] text-[#c3c3c3] outline-none"
          />
        </div>
      </div>

      {/* ID Input */}
      <div className="mt-[48px] flex flex-col gap-[8px]">
        <label className="text-[16px] text-[#4a4a4a] font-medium leading-[25px]">아이디</label>
        <div className="flex gap-2">
          <div className="border border-[#cbcad7] rounded-[6px] h-[64px] flex-1 flex items-center justify-between px-5">
            <input
              type="text"
              placeholder="아이디를 입력해주세요"
              className="flex-1 text-[16px] text-[#c3c3c3] outline-none"
            />
            <div className="w-6 h-6 relative shrink-0">
              <img alt="아이콘" className="w-full h-full" src={eyeIcon} />
            </div>
          </div>
          <button className="w-[70px] h-[50px] bg-[rgba(100,141,219,0.4)] rounded-[10px] text-[14px] text-white font-normal leading-[1.38] tracking-[-0.42px]">
            중복 확인
          </button>
        </div>
      </div>

      {/* Password Input */}
      <div className="mt-[20px] flex flex-col gap-[8px]">
        <label className="text-[16px] text-[#4a4a4a] font-medium leading-[25px]">비밀번호</label>
        <div className="border border-[#cbcad7] rounded-[6px] h-[64px] w-full flex items-center justify-between px-5">
          <input
            type="password"
            placeholder="비밀번호를 입력해주세요"
            className="flex-1 text-[16px] text-[#c3c3c3] outline-none"
          />
          <div className="w-6 h-6 relative shrink-0">
            <img alt="비밀번호 보기" className="w-full h-full" src={eyeIcon} />
          </div>
        </div>
      </div>

      {/* Password Confirm Input */}
      <div className="mt-[20px] flex flex-col gap-[8px]">
        <label className="text-[16px] text-[#4a4a4a] font-medium leading-[25px]">비밀번호 재입력</label>
        <div className="border border-[#cbcad7] rounded-[6px] h-[64px] w-full flex items-center justify-between px-5">
          <input
            type="password"
            placeholder="비밀번호를 다시 입력해주세요"
            className="flex-1 text-[16px] text-[#c3c3c3] outline-none"
          />
          <div className="w-6 h-6 relative shrink-0">
            <img alt="비밀번호 보기" className="w-full h-full" src={eyeIcon} />
          </div>
        </div>
      </div>

      {/* Signup Button */}
      <div className="mt-[121px]">
        <button className="w-full h-[60px] bg-[rgba(100,141,219,0.4)] rounded-[10px] text-[16px] text-white font-semibold leading-[1.38] tracking-[-0.48px]">
          회원가입
        </button>
      </div>

      {/* Login Link */}
      <div className="mt-[20px] text-center">
        <p className="text-[16px] leading-[25px] tracking-[0.08px]">
          <span className="text-[#c3c3c3]">이미 계정이 있으신가요? </span>
          <a 
            href="/login" 
            className="text-[#648ddb] font-semibold underline decoration-solid underline-offset-2"
          >
            로그인하기
          </a>
        </p>
      </div>
    </div>
  );
}
