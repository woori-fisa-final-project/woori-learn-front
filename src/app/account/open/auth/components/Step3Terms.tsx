"use client";
// 본인확인3 - Figma 프레임 기준 (390×844px 최적화)
import { useState } from "react";
import Button from "@/components/common/Button";
import StepHeader from "@/components/common/StepHeader";
import PageContainer from "@/components/common/PageContainer";
import AgreementModal from "@/components/common/AgreementModal";
import AgreementAllButton from "@/components/common/AgreementAllButton";
import AgreementItem from "@/components/common/AgreementItem";
import { useStepValidation } from "@/lib/hooks/useStepValidation";

interface Agreement {
  id: string;
  title: string;
  required: boolean;
  content: string;
}

const agreements: Agreement[] = [
  {
    id: "phone-verify",
    title: "휴대폰 본인확인 약관",
    required: true,
    content:
      "휴대폰 본인확인 서비스 이용약관\n\n제1조 (목적)\n본 약관은 휴대폰 본인확인 서비스의 이용에 관한 사항을 규정함을 목적으로 합니다.\n\n제2조 (정의)\n본 약관에서 사용하는 용어의 정의는 다음과 같습니다.\n1. 휴대폰 본인확인 서비스: 휴대폰을 이용하여 본인을 확인하는 서비스를 말합니다.\n2. 이용자: 본 서비스를 이용하는 자를 말합니다.\n\n제3조 (서비스의 제공)\n회사는 이용자에게 휴대폰 본인확인 서비스를 제공합니다.",
  },
  {
    id: "service-terms",
    title: "서비스 이용약관 동의",
    required: true,
    content:
      "서비스 이용약관\n\n제1조 (목적)\n본 약관은 서비스의 이용에 관한 사항을 규정함을 목적으로 합니다.",
  },
  {
    id: "privacy",
    title: "개인정보 수집/이용 동의",
    required: true,
    content:
      "개인정보 수집/이용 동의\n\n1. 개인정보의 처리 목적\n회사는 다음의 목적을 위하여 개인정보를 처리합니다.\n- 본인확인 서비스 제공\n- 서비스 이용에 따른 본인 식별 및 인증",
  },
  {
    id: "unique-info",
    title: "고유식별정보처리",
    required: true,
    content:
      "고유식별정보 처리\n\n고유식별정보의 수집 및 이용에 동의합니다.",
  },
  {
    id: "confirm-service",
    title: "본인확인서비스",
    required: true,
    content: "본인확인서비스 이용에 동의합니다.",
  },
];

interface Step3TermsProps {
  onNext: () => void;
  onBack: () => void;
}

export default function Step3Terms({ onNext, onBack }: Step3TermsProps) {
  const [agreedTerms, setAgreedTerms] = useState<Set<string>>(new Set());
  const [selectedAgreement, setSelectedAgreement] = useState<Agreement | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 이전 단계 통과 여부 검증
  useStepValidation(3);

  const handleToggleAgreement = (id: string) => {
    const newSet = new Set(agreedTerms);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setAgreedTerms(newSet);
  };

  const handleAgreeAll = () => {
    if (agreedTerms.size === agreements.length) {
      setAgreedTerms(new Set());
    } else {
      setAgreedTerms(new Set(agreements.map((a) => a.id)));
    }
  };

  const handleViewAgreement = (id: string) => {
    const agreement = agreements.find((a) => a.id === id);
    if (agreement) {
      setSelectedAgreement(agreement);
      setIsModalOpen(true);
    }
  };

  const handleNext = () => {
    const requiredIds = agreements.filter((a) => a.required).map((a) => a.id);
    const allRequiredAgreed = requiredIds.every((id) => agreedTerms.has(id));

    if (allRequiredAgreed) {
      onNext();
    }
  };

  const isButtonEnabled =
    agreements.filter((a) => a.required).every((a) => agreedTerms.has(a.id));
  const allAgreed = agreedTerms.size === agreements.length;

  return (
    <PageContainer>
      <div className="flex flex-col min-h-[calc(100dvh-60px)] w-full justify-between">
        {/* 헤더 및 콘텐츠 영역 */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="flex-shrink-0">
            <StepHeader
              title="본인확인"
              description={
                <>
                  휴대폰 본인확인을 위해
                  <br />
                  필수사항에 동의해 주세요
                </>
              }
              onBack={onBack}
            />
          </div>

          {/* 스크롤 가능한 콘텐츠 영역 */}
          <div className="flex-1 overflow-y-auto min-h-0">
            {/* 전체 동의 버튼 */}
            <div className="mt-[28px] w-full">
              <AgreementAllButton
                title={agreements[0].title}
                isAllAgreed={allAgreed}
                onToggle={handleAgreeAll}
              />
            </div>

            {/* 약관 목록 (양쪽 20px 패딩, 간격 조정) - 첫 번째 약관도 포함 */}
            <div className="mt-[16px] w-full space-y-[16px] px-5 pb-4">
              {agreements.map((agreement) => (
                <AgreementItem
                  key={agreement.id}
                  id={agreement.id}
                  title={agreement.title}
                  required={agreement.required}
                  isAgreed={agreedTerms.has(agreement.id)}
                  onToggle={handleToggleAgreement}
                  onView={handleViewAgreement}
                />
              ))}
            </div>
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
            동의하고 진행하기
          </Button>
        </div>

        {/* 약관 상세 모달 */}
        {selectedAgreement && (
          <AgreementModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title={selectedAgreement.title}
            content={selectedAgreement.content}
          />
        )}
      </div>
    </PageContainer>
  );
}
