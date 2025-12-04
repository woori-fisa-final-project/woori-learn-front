"use client";

// 약관 동의 단계에서 체크 상태를 제어하기 위해 React 상태 훅을 사용한다.
import { useState } from "react";
import Button from "@/components/common/Button";
import Image from "next/image";

// 약관 동의 체크박스에 사용할 아이콘 경로를 정의한다.
const TERMS_CHECK_ICON = "/images/Termcheck.png";
const TERMS_CHECKED_ICON = "/images/Termcheck2.png";

// 상위 단계에서 확인 콜백을 전달받기 위한 props 타입이다.
type Scenario16Props = {
  onConfirm: () => void | Promise<void>;
  advancePractice: (opts?: { onlyIds?: number[]; answer?: number }) => Promise<boolean>;
};

// 약관 동의 화면을 렌더링해 사용자가 필수 약관을 확인하고 진행하도록 한다.
export default function Scenario16({ onConfirm, advancePractice }: Scenario16Props) {
  // 체크박스 상태와 상세 모달 열림 여부를 각각 관리한다.
  const [isChecked, setIsChecked] = useState(false);
  const [isDetailOpen, setDetailOpen] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);

  const handleAgreementClick = async () => {
    if (isChecked) {
      setIsChecked(false);
      return;
    }
    setDetailOpen(true);
    if (tutorialStep === 0) setTutorialStep(1);
    await advancePractice({ onlyIds: [1095] });
  };

  const openDetail = async () => {
    setDetailOpen(true);
    if (tutorialStep === 0) setTutorialStep(1);
    await advancePractice({ onlyIds: [1095] });
  };

  const closeDetail = async () => {
    setDetailOpen(false);

    await advancePractice({ onlyIds: [1096] });
  };

  const handleConfirm = async () => {
    if (!isChecked) return;

    await advancePractice({ onlyIds: [1098] });

    await onConfirm?.();
  };

  const handleModalConfirm = async () => {
    await advancePractice({ onlyIds: [1097] });
    setDetailOpen(false);
    setIsChecked(true);

    if (tutorialStep === 1) {
      setTutorialStep(2);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <section className="mt-[32px] space-y-[24px]">
        <div>
          <h1 className="text-[24px] font-semibold leading-[1.3] text-gray-900 tracking-[-0.5px]">
            자동이체 등록을 위해
            <br />
            약관에 동의해 주세요
          </h1>
        </div>

        <div>
          <div className="flex w-full items-center justify-between rounded-[16px] border border-gray-200 bg-white px-[20px] py-[16px]">
            <button
              type="button"
              onClick={handleAgreementClick}
              aria-pressed={isChecked}
              className="flex flex-1 items-center gap-[12px] text-left"
            >
              <Image
                src={isChecked ? TERMS_CHECKED_ICON : TERMS_CHECK_ICON}
                alt="약관 동의 체크"
                width={20}
                height={20}
              />
              <span className="text-[15px] font-medium text-gray-800">
                [필수] 타행 자동이체 약관
              </span>
            </button>
            <button
              type="button"
              onClick={openDetail}
              className="text-[14px] text-primary-500 underline"
            >
              보기
            </button>
          </div>
          <p className="mt-[12px] text-[13px] text-gray-500">
            약관 내용을 확인하고 체크해 주세요.
          </p>
        </div>
      </section>

      <div className="mt-auto flex flex-col gap-[12px] pb-[32px]">
        <Button onClick={() => void handleConfirm()} disabled={!isChecked}>
          확인
        </Button>
      </div>

      {isDetailOpen && (
        <TermsDetailModal
          onClose={closeDetail}
          onConfirm={handleModalConfirm}
          showFinger={tutorialStep === 1}
        />
      )}
    </div>
  );
}

type TermsDetailModalProps = {
  onClose: () => void;
  onConfirm: () => void;
  showFinger: boolean;
};

function TermsDetailModal({ onClose, onConfirm, showFinger }: TermsDetailModalProps) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-[18px]">
      <div className="flex h-[560px] w-full max-w-[380px] flex-col overflow-hidden rounded-[24px] bg-white">
        <header className="relative flex items-center justify-center border-b border-gray-100 px-[20px] py-[18px]">
          <h2 className="text-[18px] font-semibold text-gray-900">약관/동의서 상세</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="absolute right-[20px] text-[20px] text-gray-400"
          >
            ✕
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-[20px] py-[24px] text-[14px] leading-[1.6] text-gray-700">
          <h3 className="text-[16px] font-semibold text-gray-900">타행 자동이체 약관</h3>
          <section className="mt-[16px] space-y-[16px]">
            <article>
              <h4 className="text-[15px] font-semibold text-gray-800">제1조 (약관의 적용)</h4>
              <p className="mt-[8px] whitespace-pre-line">
                이 약관은 타행 자동이체에 따라 각종 자금을 정기적으로 이체하고자 하는 개인이 “납부자”가
                된다고 납부자 계좌로부터 이체를 승인한 경우 은행이 이에 따라 이체와 연계된 약정을 적용합니다.
              </p>
            </article>
            <article>
              <h4 className="text-[15px] font-semibold text-gray-800">제2조 (신청, 변경 및 해지)</h4>
              <ul className="mt-[8px] list-disc space-y-[8px] pl-[18px]">
                <li>
                  납부자가 타행 자동이체를 이용, 변경 또는 해지하고자 할 경우에는 타행 자동이체신청서, 변경,
                  해지신청서를 제출하여야 합니다.
                </li>
                <li>
                  타행 자동이체를 신청할 때, 신청정보와 제공정보가 일치하지 않는 경우 이체가 제한될 수 있습니다.
                </li>
                <li>
                  이체일이 휴일인 경우 다음 영업일에 이체되며, 이체일 당일 계좌 잔액이 부족하면 이체되지 않을 수
                  있습니다.
                </li>
              </ul>
            </article>
            <article>
              <h4 className="text-[15px] font-semibold text-gray-800">제3조 (계좌이체 서비스)</h4>
              <p className="mt-[8px] whitespace-pre-line">
                타행 자동이체는 계좌이체서비스를 대상으로 하며, 계좌이체서비스 이용 약관을 준용합니다. 자세한
                사항은 은행 고객센터 또는 홈페이지를 참고하세요.
              </p>
            </article>
          </section>
        </div>

        <div className="border-t border-gray-100 px-[20px] pb-[24px] pt-[16px]">
          <Button onClick={onConfirm}>확인</Button>
        </div>
      </div>
    </div>
  );
}