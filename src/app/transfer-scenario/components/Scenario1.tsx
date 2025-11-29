"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTransferFlow } from "@/lib/hooks/useTransferFlow";

type Scenario1Props = {
  onOpenBankSheet: () => void;
  onContactTransfer: () => void;
};

export default function Scenario1({ onOpenBankSheet, onContactTransfer }: Scenario1Props) {
  const router = useRouter();
  
  // ✅ URL 확인할 필요 없이 그냥 가져오면 됩니다.
  // layout.tsx 덕분에 값이 살아있습니다.
  const { sourceAccountNumber } = useTransferFlow(); 

  const [isFingerVisible, setIsFingerVisible] = useState(true);

  useEffect(() => {
    // 값이 잘 들어왔나 확인만 해보기
    if (sourceAccountNumber) {
      console.log("✅ Context에서 계좌번호 확인:", sourceAccountNumber);
    } else {
      console.warn("❌ 계좌번호가 비어있습니다 (새로고침 했거나 저장이 안 됨)");
    }
  }, [sourceAccountNumber]);

  const handleOpenSheet = () => {
    setIsFingerVisible(false);
    onOpenBankSheet();
  };

  return (
    <div className="flex h-full flex-col">
      <section className="mt-[18px] space-y-[12px]">
        <h1 className="text-[24px] font-bold text-gray-900">어디로 이체하시겠어요?</h1>
      </section>

      <section className="mt-[24px] space-y-[12px]">
        <div className="relative">
          {isFingerVisible && (
            <div className="absolute top-[10px] left-1/2 -translate-x-1/2 animate-bounce z-10 pointer-events-none">
              <span className="text-[30px]">👇</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleOpenSheet}
            className="flex w-full flex-col bg-white pt-[40px]"
          >
            <div className="flex items-center justify-between">
              <span className="text-[18px] font-semibold text-gray-300">계좌번호입력</span>
              <Image src="/images/camera.png" alt="카메라" className="h-[18px] w-[22px]" width={22} height={18} />
            </div>
            <div className="mt-[12px] h-[1px] w-full bg-gray-200" />
          </button>
        </div>

        <div className="flex rounded-[14px] bg-gray-100 p-[4px] text-[13px] text-gray-500">
          {["추천", "자주", "내계좌"].map((label) => (
            <button
              key={label}
              type="button"
              className={`flex-1 rounded-[10px] py-[8px] ${
                label === "추천" ? "bg-white font-semibold text-gray-800 shadow-sm" : ""
              }`}
              onClick={() => {}}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-[28px] flex items-center justify-between">
        <span className="text-[22px] font-semibold text-gray-500">최근입금계좌</span>
        <button type="button" className="text-[18px] text-gray-400" onClick={() => {}}>
          편집
        </button>
      </section>

      <section className="mt-[20px] flex flex-1 flex-col items-center justify-center">
        <Image src="/images/file.png" alt="파일 아이콘" className="h-[66px] w-[54px]" width={54} height={66} />
        <p className="mt-[16px] text-[16px] font-semibold text-gray-400">최근 이체 내역이 없어요</p>
      </section>

      <div className="mt-[20px] flex items-center justify-center">
        <button
          type="button"
          onClick={onContactTransfer}
          className="flex h-[52px] w-full items-center justify-center gap-[8px] rounded-[14px] border border-gray-200 text-[15px] font-medium text-gray-700 transition hover:bg-gray-50"
        >
          <span className="text-[18px] text-gray-400">+</span>
          연락처로 이체하기
        </button>
      </div>
    </div>
  );
}