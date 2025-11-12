"use client";

import Button from "@/components/common/Button";
import InfoRow from "@/components/common/InfoRow";
import Modal from "@/components/common/Modal";
import { useMemo, useState } from "react";

export type Scenario18Detail = {
  status: string;
  title: string;
  amount: string;
  transferDay: string;
  frequency: string;
  period: string;
  ownerName: string;
  recipientName: string;
  registerDate: string;
  sourceAccount: string;
  inboundAccount: string;
};

type Scenario18Props = {
  detail: Scenario18Detail;
  onBack: () => void;
  onNavigateToCancelComplete: () => void;
};

export default function Scenario18({ detail, onBack, onNavigateToCancelComplete }: Scenario18Props) {
  const [isConfirmOpen, setConfirmOpen] = useState(false);
  const [isReviewSheetOpen, setReviewSheetOpen] = useState(false);
  const [bankName, accountNumber] = useMemo(() => {
    const parts = detail.inboundAccount.split("·").map((part) => part.trim());
    if (parts.length === 2) return parts as [string, string];
    return [detail.inboundAccount, ""] as [string, string];
  }, [detail.inboundAccount]);

  const handleRequestCancel = () => {
    setConfirmOpen(true);
  };

  const handleCloseConfirm = () => {
    setConfirmOpen(false);
  };

  const handleConfirmCancel = () => {
    setConfirmOpen(false);
    setReviewSheetOpen(true);
  };

  const rows = useMemo(() => [
    { label: "상태", value: detail.status },
    { label: "받는 분", value: detail.recipientName, highlight: true },
    { label: "이체금액", value: detail.amount, highlight: true },
    { label: "출금정보", value: detail.sourceAccount },
    { label: "입금정보", value: detail.inboundAccount },
    { label: "이체지정일", value: detail.transferDay },
    { label: "이체주기", value: detail.frequency },
    { label: "이체기간", value: detail.period },
    { label: "내 통장표기", value: detail.ownerName },
    { label: "이체등록일", value: detail.registerDate },
  ], [detail]);

  return (
    <div className="mx-auto flex h-[85dvh] w-full max-w-[390px] flex-col overflow-hidden bg-white px-[20px] py-[24px]">
      <main className="flex flex-1 flex-col gap-[24px]">
        <section className="rounded-[20px] border border-gray-100 bg-[#F5F7FA] px-[20px] py-[20px]">
          <div className="mt-[20px] space-y-[8px]">
            {rows.map((row) => (
              <InfoRow
                key={row.label}
                label={row.label}
                value={row.value}
                highlight={Boolean(row.highlight)}
              />
            ))}
          </div>
        </section>
        <Button onClick={handleRequestCancel} className="mt-[20px]">
          자동이체 해지
        </Button>
      </main>

      

      <Modal
         isOpen={isConfirmOpen}
         onClose={handleCloseConfirm}
         title="확인"
         description="자동이체 해지 전 안내 메시지"
         confirmText=""
         cancelText=""
         onConfirm={() => undefined}
         zIndex="z-[100]"
       >
        <div className="flex flex-col gap-[18px] text-left">
          <div className="space-y-[8px] text-[16px] text-gray-700">
            <p className="font-semibold text-gray-900">
              {bankName}
              {accountNumber ? `/${accountNumber}` : ""}의 자동 이체를 해지하시겠습니까?
            </p>
            <p>
              타행자동이체 시 이체지정일 당일에 인증되므로 전 영업일까지 해지해 주세요.
            </p>
            <p>
              자동이체 해지 당일 등록 건 취소 가능 여부는 고객센터로 문의하시기 바랍니다.
            </p>
          </div>
 
          <div className="grid grid-cols-2 gap-[10px]">
            <Button variant="secondary" size="sm" onClick={handleCloseConfirm}>
              취소
            </Button>
            <Button
              size="sm"
              onClick={() => {
                handleConfirmCancel();
              }}
            >
              네
            </Button>
          </div>
        </div>
      </Modal>

      {isReviewSheetOpen && (
        <div className="fixed inset-0 z-[90] flex items-end justify-center bg-black/40">
          <div className="w-full max-w-[390px] rounded-t-[24px] bg-white px-[20px] pb-[32px] pt-[24px]">
            <div className="flex items-center justify-between">
              <h3 className="text-[18px] font-semibold text-gray-900">
                자동이체 해지 정보를 확인해주세요
              </h3>
              <button
                type="button"
                onClick={() => {
                  setReviewSheetOpen(false);
                }}
                className="text-[18px] text-gray-400"
                aria-label="닫기"
              >
                ✕
              </button>
            </div>

            <div className="mt-[20px] space-y-[10px]">
              <InfoRow label="받는 분" value={detail.recipientName} highlight compact />
              <InfoRow label="이체금액" value={detail.amount} highlight compact />
              <InfoRow label="출금정보" value={detail.sourceAccount} compact />
              <InfoRow label="입금정보" value={detail.inboundAccount} compact />
              <InfoRow label="이체주기" value={detail.frequency} compact />
              <InfoRow label="이체기간" value={detail.period} compact />
            </div>

            <div className="mt-[28px] grid grid-cols-2 gap-[10px]">
              <Button
                variant="secondary"
                size="sm"
                className="font-semibold"
                onClick={() => {
                  setReviewSheetOpen(false);
                }}
              >
                취소
              </Button>
              <Button
                size="sm"
                className="font-semibold"
                onClick={() => {
                  setReviewSheetOpen(false);
                  onNavigateToCancelComplete();
                }}
              >
                확인했습니다
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

