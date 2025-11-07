"use client";
import { useRouter } from "next/navigation";
import Button from "@/components/common/Button";
import PageContainer from "@/components/common/PageContainer";
import { useAccountData } from "@/lib/hooks/useAccountData";
import { useStepValidation } from "@/lib/hooks/useStepValidation";

export default function Step8Complete() {
  const router = useRouter();
  const { clearAccountData } = useAccountData();

  // 이전 단계 통과 여부 검증
  useStepValidation(8);

  const handleGoHome = () => {
    clearAccountData();
    if (typeof window !== "undefined") {
      localStorage.removeItem("accountAuthStep");
    }
    router.push("/home");
  };

  return (
    <PageContainer>
      <div className="flex flex-col min-h-[calc(100dvh-60px)] w-full justify-between">
        {/* 헤더 및 콘텐츠 영역 */}
        <div className="flex-1 flex flex-col items-center justify-center min-h-0">
          {/* 완료 아이콘 및 메시지 */}
          <div className="w-full flex flex-col items-center">
            <div className="w-[60px] h-[60px] bg-green-100 rounded-full flex items-center justify-center mb-6">
              <svg
                className="w-[30px] h-[30px] text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="text-[21px] text-gray-700 font-medium text-center leading-[28.86px]">
              계좌 개설이 완료되었어요.
            </p>
          </div>
        </div>

        {/* 버튼 */}
        <div 
          className="w-full shrink-0"
          style={{
            paddingBottom: "max(20px, env(safe-area-inset-bottom, 20px))",
          }}
        >
          <Button onClick={handleGoHome} variant="primary">
            홈으로 이동
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}
