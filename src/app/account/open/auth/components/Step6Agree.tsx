"use client";
// 본인확인6 - Figma 프레임 기준 (390×844px 최적화)
import { useState } from "react";
import Button from "@/components/common/Button";
import StepHeader from "@/components/common/StepHeader";
import PageContainer from "@/components/common/PageContainer";
import AgreementModal from "@/components/common/AgreementModal";
import AgreementAllButton from "@/components/common/AgreementAllButton";
import AgreementItem from "@/components/common/AgreementItem";
import { useStepValidation } from "@/lib/hooks/useStepValidation";

interface AccountAgreement {
  id: string;
  title: string;
  required: boolean;
  content: string;
}

const accountAgreements: AccountAgreement[] = [
  {
    id: "deposit-basic",
    title: "[예금]예금거래기본약관",
    required: true,
    content: "예금거래기본약관 내용...",
  },
  {
    id: "deposit-flexible",
    title: "[예금]입출금이자유로운예금약관",
    required: true,
    content: "입출금이자유로운예금약관 내용...",
  },
  {
    id: "account-safety",
    title: "[예금][필수]비대면 계좌개설 안심차단 등록 여부 조회용 개인(신용)정보 동의서",
    required: true,
    content: "비대면 계좌개설 안심차단 등록 여부 조회용 개인(신용)정보 동의서 내용...",
  },
  {
    id: "product-terms",
    title: "상품약관_WON통장",
    required: true,
    content: "상품약관_WON통장 내용...",
  },
  {
    id: "product-desc",
    title: "상품설명서_WON통장",
    required: true,
    content: "상품설명서_WON통장 내용...",
  },
  {
    id: "depositor-protection",
    title: "예금자보호법 설명확인",
    required: true,
    content: "예금자보호법 설명확인 내용...",
  },
  {
    id: "common-confirm",
    title: "금융거래 공통 확인사항",
    required: true,
    content: "금융거래 공통 확인사항 내용...",
  },
  {
    id: "illegal-trade",
    title: "불법.탈법 차명거래 금지 설명 확인서",
    required: true,
    content: "불법.탈법 차명거래 금지 설명 확인서 내용...",
  },
  {
    id: "customer-info",
    title: "고객정보 취급방침",
    required: true,
    content: "고객정보 취급방침 내용...",
  },
  {
    id: "personal-info",
    title: "개인(신용)정보 수집-이용 동의서 [수신 등]",
    required: true,
    content: "개인(신용)정보 수집-이용 동의서 내용...",
  },
  {
    id: "product-guide",
    title: "[필수] 상품 주요내용 안내",
    required: true,
    content: "상품 주요내용 안내 내용...",
  },
  {
    id: "full-agreement",
    title: "[필수] 본인은 약관 및 상품설명서를 제공받고 예금상품의 주요내용을 충분히 이해했습니다.",
    required: true,
    content: "약관 및 상품설명서 이해 확인 내용...",
  },
];

interface Step6AgreeProps {
  onNext: () => void;
  onBack: () => void;
}

export default function Step6Agree({ onNext, onBack }: Step6AgreeProps) {
  const [agreedTerms, setAgreedTerms] = useState<Set<string>>(new Set());
  const [selectedAgreement, setSelectedAgreement] =
    useState<AccountAgreement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productInfoMethod, setProductInfoMethod] = useState<Set<string>>(
    new Set()
  );

  // 이전 단계 통과 여부 검증
  useStepValidation(6);

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
    if (agreedTerms.size === accountAgreements.length) {
      setAgreedTerms(new Set());
    } else {
      setAgreedTerms(new Set(accountAgreements.map((a) => a.id)));
    }
  };

  const handleToggleProductInfo = (method: "email" | "sms") => {
    const newSet = new Set(productInfoMethod);
    if (newSet.has(method)) {
      newSet.delete(method);
    } else {
      newSet.add(method);
    }
    setProductInfoMethod(newSet);
  };

  const handleViewAgreement = (id: string) => {
    const agreement = accountAgreements.find((a) => a.id === id);
    if (agreement) {
      setSelectedAgreement(agreement);
      setIsModalOpen(true);
    }
  };

  const handleNext = () => {
    const requiredIds = accountAgreements
      .filter((a) => a.required)
      .map((a) => a.id);
    const allRequiredAgreed = requiredIds.every((id) => agreedTerms.has(id));

    // 상품 안내 수신 방식은 선택사항이므로 필수 조건에서 제외
    if (allRequiredAgreed) {
      onNext();
    }
  };

  const isButtonEnabled = (() => {
    const requiredIds = accountAgreements
      .filter((a) => a.required)
      .map((a) => a.id);
    const allRequiredAgreed = requiredIds.every((id) => agreedTerms.has(id));

    // 상품 안내 수신 방식은 선택사항이므로 필수 조건에서 제외
    return allRequiredAgreed;
  })();

  const allAgreed = agreedTerms.size === accountAgreements.length;

  return (
    <PageContainer>
      <div className="flex flex-col min-h-[calc(100dvh-60px)] w-full justify-between">
        {/* 헤더 및 콘텐츠 영역 */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="flex-shrink-0">
            <StepHeader
              title="입출금계좌 개설"
              description={
                <>
                  계좌 개설을 위해
                  <br />
                  약관을 확인해 주세요
                </>
              }
              onBack={onBack}
            />
          </div>

          {/* 스크롤 가능한 콘텐츠 영역 */}
          <div className="flex-1 overflow-y-auto min-h-0">
            {/* 전체 동의 */}
            <div className="mt-[28px] w-full">
              <AgreementAllButton
                title="[필수] 전체 동의하기"
                isAllAgreed={allAgreed}
                onToggle={handleAgreeAll}
              />
            </div>

            {/* 약관 목록 (양쪽 20px 패딩, 간격 조정) */}
            <div className="mt-[16px] w-full space-y-[16px] px-5">
              {accountAgreements.map((agreement) => (
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

            {/* 상품 안내 수신 방식 선택 */}
            <div className="mt-[20px] w-full px-5 pb-4">
              <div className="flex items-center gap-2 mb-[16px]">
                <img
                  alt="체크"
                  src="/images/Termchecks.png"
                  className="w-4 h-4 object-contain opacity-50"
                />
                <p className="text-[16px] text-gray-700 font-normal">
                  상품자료 받는 방법(중복선택 가능)
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleToggleProductInfo("email")}
                  className={`flex-1 h-[40px] rounded-[3px] text-[13px] font-light transition-all ${
                    productInfoMethod.has("email")
                      ? "bg-primary-50 border border-primary-400 text-primary-600"
                      : "bg-gray-100 border border-gray-200 text-gray-600"
                  }`}
                >
                  이메일
                </button>
                <button
                  onClick={() => handleToggleProductInfo("sms")}
                  className={`flex-1 h-[40px] rounded-[3px] text-[13px] font-light transition-all ${
                    productInfoMethod.has("sms")
                      ? "bg-primary-50 border border-primary-400 text-primary-600"
                      : "bg-gray-100 border border-gray-200 text-gray-600"
                  }`}
                >
                  문자
                </button>
              </div>
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
            다음
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
