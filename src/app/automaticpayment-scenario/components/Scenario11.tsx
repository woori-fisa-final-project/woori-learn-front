"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useScenarioHeader } from "@/lib/context/ScenarioHeaderContext";
import Button from "@/components/common/Button";
import BottomSheet from "@/components/common/BottomSheet";
import Modal from "@/components/common/Modal";
import InfoRow from "@/components/common/InfoRow";
import Image from "next/image";
import type { ScenarioStep } from "@/types/scenario";

export type AutoTransferInfo = {
  id: number;
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

type Scenario11Props = {
  accountSuffix: string;
  hasAutoTransfer: boolean;
  autoTransferList?: AutoTransferInfo[];
  onNavigateToRegister?: () => void;
  onNavigateToDetail?: (id: number) => void;
  engineStep?: ScenarioStep | null;
  onPracticeNext?: (nowStepId: number, answer?: number) => void | Promise<void>;
};

export default function Scenario11({
  accountSuffix,
  hasAutoTransfer,
  autoTransferList = [],
  onNavigateToRegister = () => console.warn("[Scenario11] onNavigateToRegister not provided"),
  onNavigateToDetail = (id) => console.warn("[Scenario11] onNavigateToDetail not provided: ", id),
  engineStep = null,
  onPracticeNext,
}: Scenario11Props) {
  const router = useRouter();
  const { setOnBack, setTitle } = useScenarioHeader();

  const [isSheetOpen, setSheetOpen] = useState(false);
  const [isFxInfoModalOpen, setFxInfoModalOpen] = useState(false);

  // ✅ 1066(모달)~1068(실습) 구간에서는 바텀시트가 “떠 있어야” 함
  useEffect(() => {
    if (!engineStep) return;
    if ([1066, 1067, 1068].includes(engineStep.id)) {
      setSheetOpen(true);
    }
  }, [engineStep]);

  useEffect(() => {
    setTitle("자동이체");
    setOnBack(() => () => {
      router.push("/woorimain");
    });

    return () => {
      setTitle("");
      setOnBack(null);
    };
  }, [router, setOnBack, setTitle]);

  // 1065: "자동이체 등록하기" 클릭 실습
  const handleRegister = async () => {
    if (engineStep?.type === "PRACTICE" && engineStep.id === 1065) {
      await onPracticeNext?.(engineStep.id);
      return;
    }
    setSheetOpen(true);
  };

  const handleCloseSheet = () => setSheetOpen(false);

  // 1068: 바텀시트에서 "원화 자동이체 등록" 클릭 실습
  const handleSelectOption = async (type: "krw" | "fx") => {
    if (type === "krw") {
      if (engineStep?.type === "PRACTICE" && engineStep.id === 1068) {
        await onPracticeNext?.(engineStep.id);
      }
      setSheetOpen(false);
      onNavigateToRegister?.();
      return;
    }

    setSheetOpen(false);
    setFxInfoModalOpen(true);
  };

  // 1107: 등록된 자동이체 내역 클릭 실습
  const handleOpenDetail = async (id: number) => {
    if (engineStep?.type === "PRACTICE" && engineStep.id === 1107) {
      await onPracticeNext?.(engineStep.id);
    }
    onNavigateToDetail?.(id);
  };

  const registeredCount = autoTransferList.length;

  return (
    <div className="mx-auto h-full flex-col flex min-h-[84dvh] w-full max-w-[390px] bg-white">
      <main className="flex h-full flex-col px-[20px] pb-[24px]">
        <section className="mt-[26px] space-y-[16px]">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-[6px] text-left">
              <span className="text-[22px] font-semibold text-primary-600">
                WON 통장({accountSuffix})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-[8px] text-[18px] font-semibold text-gray-900">
            <span>등록된 자동이체</span>
            <span className="text-primary-600">{registeredCount}건</span>
            <button type="button" aria-label="자동이체 안내" className="text-[16px] text-gray-400">
              ⓘ
            </button>
          </div>

          <button
            type="button"
            className="flex w-max items-center gap-[4px] text-[13px] font-medium text-gray-400"
          >
            <span>출금결과조회</span>
            <span className="text-[16px]">›</span>
          </button>
        </section>

        <div className="flex flex-1 flex-col py-[36px]">
          <div className="flex-1 overflow-y-auto">
            {!hasAutoTransfer ? (
              <EmptyState />
            ) : (
              <div className="w-full space-y-[16px]">
                {autoTransferList.map((info) => (
                  <AutoTransferCard key={info.id} info={info} onSelect={() => handleOpenDetail(info.id)} />
                ))}
              </div>
            )}
          </div>

          <div className="mt-[24px] flex-shrink-0">
            <Button size="md" onClick={handleRegister} fullWidth>
              자동이체 등록하기
            </Button>
          </div>
        </div>
      </main>

      <BottomSheet isOpen={isSheetOpen} onClose={handleCloseSheet} title="자동이체 유형선택">
        <nav className="flex flex-col">
          <button
            type="button"
            onClick={() => void handleSelectOption("krw")}
            className="py-[16px] text-left text-[16px] text-gray-700 transition"
          >
            원화 자동이체 등록
          </button>
          <button
            type="button"
            onClick={() => void handleSelectOption("fx")}
            className="py-[16px] text-left text-[16px] text-gray-700 transition"
          >
            외화 자동이체 등록
          </button>
        </nav>
      </BottomSheet>

      <Modal
        isOpen={isFxInfoModalOpen}
        onClose={() => setFxInfoModalOpen(false)}
        title="서비스 준비 중"
        description="외화 자동이체 등록 기능은 준비 중입니다."
        confirmText="확인"
        cancelText="닫기"
        onConfirm={() => setFxInfoModalOpen(false)}
        zIndex="z-[100]"
      />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="mt-[150px] flex flex-col items-center justify-center text-center">
      <Image src="/images/file.png" alt="빈 상태" width={56} height={70} />
      <p className="mt-[18px] text-[15px] text-gray-500">등록된 자동이체가 없어요</p>
    </div>
  );
}

function AutoTransferCard({ info, onSelect }: { info: AutoTransferInfo; onSelect: () => void }) {
  return (
    <button type="button" onClick={onSelect} className="w-full text-left transition hover:scale-[1.01]">
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
