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
  onConfirm: () => void;
};

// 약관 동의 화면을 렌더링해 사용자가 필수 약관을 확인하고 진행하도록 한다.
export default function Scenario16({ onConfirm }: Scenario16Props) {
  // 체크박스 상태와 상세 모달 열림 여부를 각각 관리한다.
  const [isChecked, setIsChecked] = useState(false);
  const [isDetailOpen, setDetailOpen] = useState(false);

  const handleAgreementClick = () => {
    if (isChecked) {
      setIsChecked(false);
      return;
    }
    setDetailOpen(true);
  };

  // 사용자가 직접 상세 보기 버튼을 눌렀을 때 모달을 연다.
  const openDetail = () => {
    setDetailOpen(true);
  };

  // 모달 닫기 버튼이나 배경을 통해 상세 화면을 닫는다.
  const closeDetail = () => {
    setDetailOpen(false);
  };

  // 체크 상태가 없으면 다음 단계로 이동하지 않도록 방지한다.
  const handleConfirm = () => {
    if (!isChecked) {
      return;
    }
    onConfirm();
  };

  // 모달에서 확인을 누르면 자동으로 체크 상태를 유지한 채 다음 단계로 진행한다.
  const handleModalConfirm = () => {
    setDetailOpen(false);
    setIsChecked(true);
  };

  return (
    <div className="flex h-full flex-col">
      {/* 약관 제목과 안내 문구를 보여주는 상단 영역이다. */}
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
        {/* 약관에 동의하기 전까지 비활성화되는 확인 버튼이다. */}
        <Button onClick={handleConfirm} disabled={!isChecked}>
          확인
        </Button>
      </div>

      {/* 약관 전문을 확인할 수 있는 모달을 조건부로 렌더링한다. */}
      {isDetailOpen && (
        <TermsDetailModal onClose={closeDetail} onConfirm={handleModalConfirm} />
      )}
    </div>
  );
}

// 약관 상세 내용을 모달 형태로 표시하는 컴포넌트이다.
type TermsDetailModalProps = {
  onClose: () => void;
  onConfirm: () => void;
};

function TermsDetailModal({ onClose, onConfirm }: TermsDetailModalProps) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-[18px]">
      <div className="flex h-[560px] w-full max-w-[380px] flex-col overflow-hidden rounded-[24px] bg-white">
        {/* 모달 상단에서 제목과 닫기 버튼을 제공한다. */}
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

        {/* 약관 전문을 스크롤 영역으로 표시한다. */}
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
                <li>납부자가 타행 자동이체를 이용, 변경 또는 해지하고자 할 경우에는 타행 자동이체신청서, 변경, 해지신청서를 제출하여야 합니다.</li>
                <li>타행 자동이체를 신청할 때, 신청정보와 제공정보가 일치하지 않는 경우 이체가 제한될 수 있습니다.</li>
                <li>이체일이 휴일인 경우 다음 영업일에 이체되며, 이체일 당일 계좌 잔액이 부족하면 이체되지 않을 수 있습니다.</li>
              </ul>
            </article>
            <article>
              <h4 className="text-[15px] font-semibold text-gray-800">제3조 (계좌이체 서비스)</h4>
              <p className="mt-[8px] whitespace-pre-line">
                타행 자동이체는 계좌이체서비스를 대상으로 하며, 계좌이체서비스 이용 약관을 준용합니다. 자세한 사항은 은행 고객센터 또는 홈페이지를 참고하세요.
              </p>
            </article>
          </section>
        </div>

        {/* 모달 하단에서 약관 확인을 완료할 수 있는 버튼을 제공한다. */}
        <div className="border-t border-gray-100 px-[20px] pb-[24px] pt-[16px]">
          <Button onClick={onConfirm}>확인</Button>
        </div>
      </div>
    </div>
  );
}

