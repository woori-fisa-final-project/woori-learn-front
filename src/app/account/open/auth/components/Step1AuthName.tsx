"use client"; // 클라이언트 컴포넌트로 상태와 브라우저 API를 사용할 수 있도록 명시합니다.
// 본인확인1 - Figma 프레임 기준
import { useRouter } from "next/navigation"; // 단계 이동 또는 뒤로가기를 위해 라우터 훅을 사용합니다.
import { useState, useEffect } from "react"; // 입력 상태 관리와 초기값 세팅을 위해 React 훅을 불러옵니다.
import Input from "@/components/common/Input"; // 공통 입력 필드를 사용해 일관된 UI를 구성합니다.
import Button from "@/components/common/Button"; // 하단 다음 버튼으로 활용할 공통 버튼 컴포넌트입니다.
import StepHeader from "@/components/common/StepHeader"; // 단계 제목과 설명을 노출하는 헤더 컴포넌트입니다.
import PageContainer from "@/components/common/PageContainer"; // 페이지 레이아웃을 감싸는 컨테이너 컴포넌트입니다.
import { useAccountData } from "@/lib/hooks/useAccountData"; // 계좌 개설 플로우 상태를 공유하는 커스텀 훅입니다.

interface Step1AuthNameProps {
  onNext: () => void; // 현재 단계 완료 후 다음 단계로 이동시키는 콜백입니다.
}

export default function Step1AuthName({ onNext }: Step1AuthNameProps) {
  const router = useRouter(); // 뒤로 이동 등 라우팅 처리를 위해 라우터 인스턴스를 가져옵니다.
  const [realName, setRealName] = useState(""); // 사용자 이름 입력값을 상태로 관리합니다.
  const { updateAccountData, accountData } = useAccountData(); // 계좌 개설 도중 입력한 데이터를 공유하기 위해 훅에서 값을 받습니다.

  useEffect(() => {
    if (accountData.realName) {
      setRealName(accountData.realName); // 컨텍스트에 저장된 이름이 있으면 입력 필드에 미리 채워줍니다.
    }
  }, [accountData.realName]);

  const handleBack = () => {
    router.push("/mypage"); // 뒤로가기 선택 시 마이페이지로 이동해 플로우를 종료합니다.
  };

  const handleNext = () => {
    if (realName.trim()) {
      updateAccountData({ realName: realName.trim() }); // 양 끝 공백을 제거한 이름을 컨텍스트에 저장합니다.
      onNext(); // 저장 완료 후 다음 단계로 전환합니다.
    }
  };

  const isButtonEnabled = realName.trim().length > 0; // 이름 입력이 있어야 버튼을 활성화합니다.

  return (
    // PageContainer로 화면 전체 레이아웃과 공통 여백을 적용합니다.
    <PageContainer>
      <div className="flex flex-col min-h-[calc(100dvh-60px)] w-full justify-between">
        {/* 헤더 및 콘텐츠 영역 */}
        {/* StepHeader와 입력 영역을 감싸는 컨텐츠 영역입니다. */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* StepHeader: 화면 제목과 설명, 뒤로가기 버튼을 보여줍니다. */}
          <StepHeader
            title="본인확인"
            description="고객님의 이름을 알려주세요"
            onBack={handleBack}
          />

          {/* 이름 입력 필드 */}
          <div className="mt-[32px] w-full">
            <Input
              label="이름"
              type="text"
              placeholder="입력"
              value={realName}
              onChange={(e) => setRealName(e.target.value)}
            />
            {/* onChange 핸들러에서 입력 값을 상태로 저장해 다음 단계에서 활용할 수 있게 합니다. */}
          </div>
        </div>

        {/* 다음 버튼 */}
        <div 
          className="w-full shrink-0"
          style={{
            paddingBottom: "max(20px, env(safe-area-inset-bottom, 20px))",
          }}
        >
          <Button onClick={handleNext} disabled={!isButtonEnabled}>
            다음
          </Button>
          {/* 버튼은 이름이 입력되었을 때만 활성화되어 잘못된 진행을 방지합니다. */}
        </div>
      </div>
    </PageContainer>
  );
}
