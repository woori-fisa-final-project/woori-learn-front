const backIcon = "http://localhost:3845/assets/ebe55dd7c37ad06644920492f53f60e7455bb1db.svg";
const eyeIcon = "http://localhost:3845/assets/87f1ed3880d5d5e58de41205e99a0f3d1a27f6ba.svg";
const eyeIcon2 = "http://localhost:3845/assets/ea4159da44b7d2c434cbc273739b3334ab81ae69.svg";

export default function SignupStep2() {
  return (
    <div className="bg-white relative w-full min-h-screen px-5 pt-[60px]">
      {/* Header */}
      <div className="flex items-center gap-2">
        <button className="w-7 h-7 flex items-center justify-center rotate-90">
          <img alt="뒤로가기" className="w-3.5 h-3.5" src={backIcon} />
        </button>
        <h1 className="text-[20px] text-[#414141] font-medium">회원가입</h1>
      </div>

      {/* Name Input */}
      <div className="mt-[70px] flex flex-col gap-2">
        <label className="text-[16px] text-[#4a4a4a] font-medium">이름</label>
        <div className="border border-[#cbcad7] rounded-[6px] h-[58px] w-full flex items-center px-5">
          <input
            type="text"
            placeholder="이름을 입력해주세요"
            className="flex-1 text-[16px] text-[#c3c3c3] outline-none"
          />
        </div>
      </div>

      {/* ID Input */}
      <div className="mt-[48px] flex flex-col gap-2">
        <label className="text-[16px] text-[#4a4a4a] font-medium">아이디</label>
        <div className="flex gap-2">
          <div className="border border-[#cbcad7] rounded-[6px] h-[64px] flex-1 flex items-center px-5">
            <input
              type="text"
              placeholder="아이디를 입력해주세요"
              className="flex-1 text-[16px] text-[#c3c3c3] outline-none"
            />
            <div className="w-6 h-6 relative shrink-0">
              <img alt="아이콘" className="w-full h-full" src={eyeIcon2} />
            </div>
          </div>
          <button className="w-[70px] h-[50px] bg-[#648ddb] rounded-[10px] text-[14px] text-white">
            중복 확인
          </button>
        </div>
      </div>

      {/* Password Input */}
      <div className="mt-[20px] flex flex-col gap-2">
        <label className="text-[16px] text-[#4a4a4a] font-medium">비밀번호</label>
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
      <div className="mt-[20px] flex flex-col gap-2">
        <label className="text-[16px] text-[#4a4a4a] font-medium">비밀번호 재입력</label>
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
        <button className="w-full h-[60px] bg-[#648ddb] rounded-[10px] text-[16px] text-white font-semibold">
          회원가입
        </button>
      </div>

      {/* Login Link */}
      <div className="mt-[77px] text-center">
        <p className="text-[16px]">
          <span className="text-[#c3c3c3]">이미 계정이 있으신가요? </span>
          <a href="/login" className="text-[#648ddb] font-semibold underline">
            로그인하기
          </a>
        </p>
      </div>
    </div>
  );
}

