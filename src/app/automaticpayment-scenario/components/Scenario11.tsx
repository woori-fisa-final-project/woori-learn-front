"use client";

// 자동이체 메인 화면에서 사용할 React 훅과 라우터, 공통 컴포넌트를 불러온다.
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useScenarioHeader } from "@/lib/context/ScenarioHeaderContext";
import Button from "@/components/common/Button";
import BottomSheet from "@/components/common/BottomSheet";
import Modal from "@/components/common/Modal";
import InfoRow from "@/components/common/InfoRow";
import Image from "next/image";

// 자동이체 등록 정보 카드에 표시할 데이터를 정의한다.
export type AutoTransferInfo = {
  status: string;
  title: string;
  bankName: string;
  bankAccount: string;
  amount: string;
  schedule: string;
  transferDay?: string | null;
  frequency?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  ownerName?: string | null;
  recipientName?: string | null;
  registerDate?: string | null;
  sourceAccountBank?: string | null;
  sourceAccountNumber?: string | null;
};

// 부모 컴포넌트가 전달하는 기본 정보와 선택적인 자동이체 정보를 정의한다.
type Scenario11Props = {
  accountSuffix: string;
  hasAutoTransfer: boolean;
  autoTransferInfo?: AutoTransferInfo;
};

// 자동이체 메인 페이지를 구성하는 최상위 컴포넌트로, 계좌 정보와 등록 상태를 표시한다.
export default function Scenario11({
  accountSuffix,
  hasAutoTransfer,
  autoTransferInfo,
}: Scenario11Props) {
  // 페이지 이동과 세부 플로우 전환을 처리하기 위해 라우터 인스턴스를 가져온다.
  const router = useRouter();
  // 헤더에 표시할 제목과 뒤로가기 로직을 설정하기 위해 컨텍스트 값을 사용한다.
  const { setOnBack, setTitle } = useScenarioHeader();
  // 바텀시트가 열려 있는지 여부를 관리하여 사용자 입력에 따라 UI를 토글한다.
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [isFxInfoModalOpen, setFxInfoModalOpen] = useState(false);

  // 컴포넌트가 마운트될 때 화면 제목과 뒤로가기 동작을 지정하고, 언마운트 시 원상복구한다.
  useEffect(() => {
    setTitle("자동이체");
    setOnBack(() => () => {
      router.push("/woorimain");
    });

    // 컴포넌트가 사라질 때는 제목과 뒤로가기 설정을 초기화한다.
    return () => {
      setTitle("");
      setOnBack(null);
    };
  }, [router, setOnBack, setTitle]);

  // 등록하기 버튼을 눌렀을 때 바텀시트를 열어 자동이체 유형을 고르게 한다.
  const handleRegister = () => {
    setSheetOpen(true);
  };

  // 실제 등록 여부에 따라 화면에 표시할 등록 건수를 계산한다.
  const registeredCount = hasAutoTransfer ? 1 : 0;

  // 바텀시트 닫기 이벤트를 처리하여 열림 상태를 해제한다.
  const handleCloseSheet = () => {
    setSheetOpen(false);
  };

  // 자동이체 유형을 선택했을 때 분기 처리하여 다음 행동을 결정한다.
  const handleSelectOption = (type: "krw" | "fx") => {
    // 원화를 선택하면 자동이체 등록 플로우로 이동한다.
    if (type === "krw") {
      router.push("/automaticpayment-scenario/register");
    } else {
      setFxInfoModalOpen(true);
    }
    setSheetOpen(false);
  };

  const handleCloseFxInfoModal = () => {
    setFxInfoModalOpen(false);
  };

  const handleConfirmFxInfoModal = () => {
    setFxInfoModalOpen(false);
  };

  const handleOpenDetail = () => {
    if (!autoTransferInfo) return;
    const params = new URLSearchParams({
      origin: "main",
      status: autoTransferInfo.status,
      title: autoTransferInfo.title,
      bankName: autoTransferInfo.bankName,
      bankAccount: autoTransferInfo.bankAccount,
      amount: autoTransferInfo.amount,
      schedule: autoTransferInfo.schedule,
    });
    if (autoTransferInfo.transferDay) params.set("transferDay", autoTransferInfo.transferDay);
    if (autoTransferInfo.frequency) params.set("frequency", autoTransferInfo.frequency);
    if (autoTransferInfo.startDate) params.set("startDate", autoTransferInfo.startDate);
    if (autoTransferInfo.endDate) params.set("endDate", autoTransferInfo.endDate);
    if (autoTransferInfo.ownerName) params.set("ownerName", autoTransferInfo.ownerName);
    if (autoTransferInfo.recipientName) params.set("recipientName", autoTransferInfo.recipientName);
    if (autoTransferInfo.registerDate) params.set("registerDate", autoTransferInfo.registerDate);
    if (autoTransferInfo.sourceAccountBank) {
      params.set("sourceAccountBank", autoTransferInfo.sourceAccountBank);
    }
    if (autoTransferInfo.sourceAccountNumber) {
      params.set("sourceAccountNumber", autoTransferInfo.sourceAccountNumber);
    }
    router.push(`/automaticpayment-scenario/detail?${params.toString()}`);
  };

  // 자동이체 메인 화면의 전체 레이아웃을 렌더링한다.
  return (
    <div className="mx-auto h-full flex-col flex min-h-[85dvh] w-full max-w-[390px] bg-white">
      <main className="flex h-full flex-col px-[20px] pb-[24px]">
        {/* 상단 영역에서 계좌명과 등록된 자동이체 정보를 안내한다. */}
        <section className="mt-[26px] space-y-[16px]">
          <div className="flex items-start justify-between">
            <button
              type="button"
              className="flex items-center gap-[6px] text-left"
              aria-label="출금 계좌 선택"
            >
              <span className="text-[22px] font-semibold text-primary-600">
                WON 통장({accountSuffix})
              </span>
              <span className="text-[16px] text-primary-600">▼</span>
            </button>
          </div>

          {/* 등록된 자동이체 건수와 안내 아이콘을 한 줄로 배치한다. */}
          <div className="flex items-center gap-[8px] text-[18px] font-semibold text-gray-900">
            <span>등록된 자동이체</span>
            <span className="text-primary-600">{registeredCount}건</span>
            <button
              type="button"
              aria-label="자동이체 안내"
              className="text-[16px] text-gray-400"
            >
              ⓘ
            </button>
          </div>

          {/* 출금 결과 조회 화면으로 이동할 수 있는 링크성 버튼이다. */}
          <button
            type="button"
            className="flex w-max items-center gap-[4px] text-[13px] font-medium text-gray-400"
          >
            <span>출금결과조회</span>
            <span className="text-[16px]">›</span>
          </button>
        </section>

        <div className="flex h-full flex-col justify-between py-[36px]">
          {/* 등록된 자동이체가 없으면 빈 상태, 있으면 카드 형태로 정보를 보여준다. */}
          <div className="flex h-full flex-col items-center text-center gap-[16px]">
            {!hasAutoTransfer ? (
              <EmptyState />
            ) : (
              <AutoTransferCard info={autoTransferInfo} onSelect={handleOpenDetail} />
            )}
          </div>
          {/* 화면 하단의 고정 버튼으로 새로운 자동이체 등록 플로우를 시작한다. */}
          <Button size="md" onClick={handleRegister} fullWidth className="mt-auto">
            자동이체 등록하기
          </Button>
        </div>
      </main>

      {/* 자동이체 유형을 선택할 수 있는 바텀시트를 정의한다. */}
      <BottomSheet
        isOpen={isSheetOpen}
        onClose={handleCloseSheet}
        title="자동이체 유형선택"
      >
        <nav className="flex flex-col">
          <button
            type="button"
            onClick={() => handleSelectOption("krw")}
            className="py-[16px] text-left text-[16px] text-gray-700 transition"
          >
            원화 자동이체 등록
          </button>
          <button
            type="button"
            onClick={() => handleSelectOption("fx")}
            className=" py-[16px] text-left text-[16px] text-gray-700 transition"
          >
            외화 자동이체 등록
          </button>
        </nav>
      </BottomSheet>
      <Modal
        isOpen={isFxInfoModalOpen}
        onClose={handleCloseFxInfoModal}
        title="서비스 준비 중"
        description="외화 자동이체 등록 기능은 준비 중입니다."
        confirmText="확인"
        cancelText="닫기"
        onConfirm={handleConfirmFxInfoModal}
        zIndex="z-[100]"
      />
    </div>
  );
}

function EmptyState() {
  // 자동이체가 하나도 없을 때 보여줄 일러스트와 안내 문구를 렌더링한다.
  return (
    <div className=" mt-[150px] flex flex-col items-center justify-center text-center">
      <Image
        src="/images/file.png"
        alt="빈 상태"
        width={56}
        height={70}
      />
      <p className="mt-[18px] text-[15px] text-gray-500">
        등록된 자동이체가 없어요
      </p>
    </div>
  );
}

function AutoTransferCard({
  info,
  onSelect,
}: {
  info?: AutoTransferInfo;
  onSelect: () => void;
}) {
  if (!info) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={onSelect}
      className="mt-[40px] w-full text-left transition hover:scale-[1.01]"
    >
      <div className="rounded-[20px] border border-[#E1E6F0] bg-white px-[22px] py-[24px] shadow-[0_4px_16px_rgba(34,58,124,0.08)]">
        <div className="flex items-start justify-between">
          <span className="rounded-full border border-[#1BAA90] px-[12px] py-[4px] text-[12px] font-semibold text-[#1BAA90]">
            {info.status}
          </span>
          <span className="text-[18px] text-gray-400">›</span>
        </div>
        <div className="mt-[16px] space-y-[16px] text-[14px] text-gray-500">
          <div>
            <p className="text-[13px] text-gray-400">자동이체</p>
            <p className="mt-[6px] text-[17px] font-semibold text-gray-900">{info.title}</p>
          </div>
          <InfoRow label="입금정보" value={`${info.bankName} ${info.bankAccount}`} />
          <InfoRow label="이체금액" value={info.amount} />
          <InfoRow label="이체일자/주기" value={info.schedule} />
        </div>
      </div>
    </button>
  );
}

