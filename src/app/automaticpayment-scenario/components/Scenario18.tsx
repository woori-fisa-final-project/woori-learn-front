"use client";

import Button from "@/components/common/Button";
import BottomSheet from "@/components/common/BottomSheet";
import InfoRow from "@/components/common/InfoRow";
import Modal from "@/components/common/Modal";
import { useCallback, useEffect, useMemo, useState } from "react";

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

type EngineStep = {
  id: number;
  type: string;
  content?: any;
  quizId?: number | null;
};

type Scenario18Props = {
  detail: Scenario18Detail;
  onBack: () => void;
  onNavigateToCancelComplete: () => void; // 실제 API 취소 + 화면 전환은 컨테이너에서
  engineStep?: EngineStep | null;
  onPracticeNext?: (nowStepId: number, answer?: number) => void | Promise<void>;
};

export default function Scenario18({
  detail,
  onNavigateToCancelComplete,
  engineStep = null,
  onPracticeNext,
}: Scenario18Props) {
  const [isConfirmOpen, setConfirmOpen] = useState(false);
  const [isReviewSheetOpen, setReviewSheetOpen] = useState(false);

  const [bankName, accountNumber] = useMemo(() => {
    const parts = detail.inboundAccount.split("·").map((p) => p.trim());
    if (parts.length === 2) return parts as [string, string];
    return [detail.inboundAccount, ""];
  }, [detail.inboundAccount]);

  const advancePractice = useCallback(
    async (opts?: { onlyIds?: number[]; answer?: number }) => {
      if (!engineStep) return false;
      if (engineStep.type !== "PRACTICE") return false;
      if (!onPracticeNext) return false;
      if (opts?.onlyIds && !opts.onlyIds.includes(engineStep.id)) return false;

      await onPracticeNext(engineStep.id, opts?.answer);
      return true;
    },
    [engineStep, onPracticeNext]
  );

  // ✅ 엔진 스텝에 맞춰 UI(모달/바텀시트) 자동 오픈
  useEffect(() => {
    if (!engineStep) return;

    // 1113: 모달에서 "네" 클릭 실습 단계 → 모달이 떠 있어야 함
    if (engineStep.type === "PRACTICE" && engineStep.id === 1113) {
      setConfirmOpen(true);
    }

    // 1115: 바텀시트에서 "확인했습니다" 클릭 실습 → 바텀시트가 떠 있어야 함
    if (engineStep.type === "PRACTICE" && engineStep.id === 1115) {
      setReviewSheetOpen(true);
    }
  }, [engineStep]);

  // 1110: "자동이체 해지" 버튼 클릭 실습
  const handleRequestCancel = async () => {
    if (engineStep?.type === "PRACTICE" && engineStep.id === 1110) {
      await onPracticeNext?.(engineStep.id);
      // 다음(1111/1112)은 오버레이지만 모달이 떠 있는 상태가 자연스러우므로 열어둠
      setConfirmOpen(true);
      return;
    }
    setConfirmOpen(true);
  };

  const handleCloseConfirm = () => setConfirmOpen(false);

  // 1113: 모달에서 "네" 클릭 실습
  const handleConfirmCancel = async () => {
    if (engineStep?.type === "PRACTICE" && engineStep.id === 1113) {
      await onPracticeNext?.(engineStep.id);
      setConfirmOpen(false);
      return;
    }

    setConfirmOpen(false);
    setReviewSheetOpen(true);
  };

  // ✅ 1115: 바텀시트에서 "확인했습니다" 클릭 실습 (여기서 반드시 소비!)
  const handleFinalConfirm = async () => {
    await advancePractice({ onlyIds: [1115] });
    setReviewSheetOpen(false);
    onNavigateToCancelComplete();
  };

  const rows = useMemo(
    () => [
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
    ],
    [detail]
  );

  return (
    <div className="mx-auto flex h-[85dvh] w-full max-w-[390px] flex-col overflow-hidden bg-white px-[20px] py-[24px]">
      <main className="flex flex-1 flex-col gap-[24px]">
        <section className="rounded-[20px] border border-gray-100 bg-[#F5F7FA] px-[20px] py-[20px]">
          <div className="mt-[20px] space-y-[8px]">
            {rows.map((row) => (
              <InfoRow key={row.label} label={row.label} value={row.value} highlight={Boolean(row.highlight)} />
            ))}
          </div>
        </section>

        <Button onClick={() => void handleRequestCancel()} className="mt-[20px]">
          자동이체 해지
        </Button>
      </main>

      <Modal isOpen={isConfirmOpen} onClose={handleCloseConfirm} zIndex="z-[100]">
        <div className="flex flex-col gap-[18px] text-left">
          <div className="space-y-[8px] text-[16px] text-gray-700">
            <p className="font-semibold text-gray-900">
              {bankName}
              {accountNumber ? `/${accountNumber}` : ""}의 자동 이체를 해지하시겠습니까?
            </p>
            <p>
              <br />
              타행자동이체 시 이체지정일 당일에 인증되므로 전 영업일까지 해지해 주세요.
            </p>
            <p>
              <br />
              자동이체 해지 당일 등록 건 취소 가능 여부는 고객센터로 문의하시기 바랍니다.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-[10px]">
            <Button variant="secondary" size="sm" onClick={handleCloseConfirm}>
              취소
            </Button>
            <Button size="sm" onClick={() => void handleConfirmCancel()}>
              네
            </Button>
          </div>
        </div>
      </Modal>

      <BottomSheet
        isOpen={isReviewSheetOpen}
        onClose={() => setReviewSheetOpen(false)}
        title="자동이체 해지 정보를 확인해주세요"
      >
        <div className="mt-[20px] space-y-[10px]">
          <InfoRow label="받는 분" value={detail.recipientName} highlight compact />
          <InfoRow label="이체금액" value={detail.amount} highlight compact />
          <InfoRow label="출금정보" value={detail.sourceAccount} compact />
          <InfoRow label="입금정보" value={detail.inboundAccount} compact />
          <InfoRow label="이체주기" value={detail.frequency} compact />
          <InfoRow label="이체기간" value={detail.period} compact />
        </div>

        <div className="mt-[28px] grid grid-cols-2 gap-[10px]">
          <Button variant="secondary" size="sm" className="font-semibold" onClick={() => setReviewSheetOpen(false)}>
            취소
          </Button>
          <Button size="sm" className="font-semibold" onClick={() => void handleFinalConfirm()}>
            확인했습니다
          </Button>
        </div>
      </BottomSheet>
    </div>
  );
}
