"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/common/Button";

export default function VerifyPage() {
  const router = useRouter();

  const handleConfirm = () => {
    router.push("/login"); // 확인 → 로그인 페이지로 이동
  };

  const handleResend = () => {
    // ⚠️ 여기에 인증번호 재전송 API 연결하면 됨
    alert("인증번호가 다시 전송되었습니다!");
  };

  return (
    <main className="pt-[40px] flex min-h-screen items-start justify-center bg-white">
      <div className="w-full max-w-[430px] px-5">
        {/* 제목 */}
        <h1 className="text-[22px] font-semibold text-gray-700">이메일 인증</h1>

        {/* 안내 문구 */}
        <p className="mt-6 text-[16px] text-gray-600 leading-relaxed">
          인증링크를 전송했습니다.
          <br />
          받은 메일에서 인증 링크를 확인해주세요.
        </p>

        {/* 확인 버튼 */}
        <div className="mt-10">
          <Button onClick={handleConfirm} fullWidth>
            확인
          </Button>
        </div>

        {/* 다시 보내기 */}
        <button
          onClick={handleResend}
          className="mt-4 text-primary-400 underline underline-offset-2 text-[15px] font-medium"
        >
          인증메일 다시 보내기
        </button>
      </div>
    </main>
  );
}
