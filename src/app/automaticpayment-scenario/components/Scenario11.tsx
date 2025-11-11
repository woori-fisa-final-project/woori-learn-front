"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useScenarioHeader } from "@/lib/context/ScenarioHeaderContext";
import Button from "@/components/common/Button";
import BottomSheet from "@/components/common/BottomSheet";
import Image from "next/image";

export type AutoTransferInfo = {
  status: string;
  title: string;
  bankName: string;
  bankAccount: string;
  amount: string;
  schedule: string;
};

type Scenario11Props = {
  accountSuffix: string;
  hasAutoTransfer: boolean;
  autoTransferInfo?: AutoTransferInfo;
};

export default function Scenario11({
  accountSuffix,
  hasAutoTransfer,
  autoTransferInfo,
}: Scenario11Props) {
  const router = useRouter();
  const { setOnBack, setTitle } = useScenarioHeader();
  const [isSheetOpen, setSheetOpen] = useState(false);

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

  const handleRegister = () => {
    setSheetOpen(true);
  };

  const registeredCount = hasAutoTransfer ? 1 : 0;

  const handleCloseSheet = () => {
    setSheetOpen(false);
  };

  const handleSelectOption = (type: "krw" | "fx") => {
    if (type === "krw") {
      router.push("/automaticpayment-scenario/register");
    } else {
      window.alert("외화 자동이체 등록은 준비 중입니다.");
    }
    setSheetOpen(false);
  };

  return (
    <div className="mx-auto flex min-h-[85dvh] w-full max-w-[390px] flex-col bg-white">
      <main className="flex h-full flex-1 flex-col px-[20px] pb-[24px]">
        <section className="mt-[26px] space-y-[14px]">
          <div className="flex items-start justify-between">
            <button
              type="button"
              className="flex items-center gap-[6px] text-left"
              aria-label="출금 계좌 선택"
            >
              <span className="text-[22px] font-semibold text-[#2F6FD9]">
                WON 통장({accountSuffix})
              </span>
              <span className="text-[16px] text-[#2F6FD9]">▼</span>
            </button>
            
          </div>
          <div className="flex items-center gap-[6px] text-[18px] font-semibold text-gray-900">
            <span>등록된 자동이체 {registeredCount}건</span>
            <button
              type="button"
              aria-label="자동이체 안내"
              className="text-[16px] text-gray-400"
            >
              ⓘ
            </button>
          </div>
           <div className="flex items-center gap-[4px] text-[13px] font-medium text-gray-400">
             <span>출금결과조회</span>
             <span className="text-[16px]">›</span>
           </div>
        </section>

        <div className="flex flex-col justify-between py-[36px]">
          <div className="flex flex-col items-center text-center gap-[16px]">
            {!hasAutoTransfer ? (
              <EmptyState />
            ) : (
              <AutoTransferCard info={autoTransferInfo} />
            )}
          </div>
          <Button
            size="md"
            onClick={handleRegister}
            fullWidth
          >
            자동이체 등록하기
          </Button>
        </div>
      </main>

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
    </div>
  );
}

function EmptyState() {
  return (
    <div className=" mt-[60px] flex flex-col items-center justify-center text-center">
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
}: {
  info?: AutoTransferInfo;
}) {
  if (!info) {
    return null;
  }

  return (
    <div className="mt-[28px]">
      <div className="rounded-[18px] border border-[#E4E8F0] bg-white p-[20px] shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[10px]">
            <span className="rounded-[12px] bg-[#E4EEFF] px-[12px] py-[4px] text-[11px] font-semibold text-[#2F6FD9]">
              {info.status}
            </span>
            <p className="text-[17px] font-semibold text-gray-900">
              {info.title}
            </p>
          </div>
          <button
            type="button"
            aria-label="자동이체 옵션"
            className="text-[20px] text-gray-400"
          >
            ···
          </button>
        </div>

        <div className="mt-[18px] space-y-[12px] text-[14px] text-gray-500">
          <div>
            <p className="text-[12px] text-gray-400">입금정보</p>
            <p className="mt-[6px] text-[15px] font-medium text-gray-800">
              {info.bankName} {info.bankAccount}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">이체금액</span>
            <span className="text-[15px] font-semibold text-gray-900">
              {info.amount}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">이체일자/주기</span>
            <span className="text-[15px] font-semibold text-gray-900">
              {info.schedule}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

