"use client";

import type { AccountCard } from "@/types";

export default function AccountCard({
  item,
  onTransfer,
}: {
  item: AccountCard;
  onTransfer: (item: AccountCard) => void;
}) {

  // WON 통장만 손가락 애니메이션 존재
  const showFingerAnimation = item.title === "WON통장";

  return (
    <div className="rounded-[16px] bg-white p-[18px] shadow-sm">
      <div className="flex items-center justify-between gap-[10px]">
        <div className="flex items-center gap-[10px]">
          {/* 이미지 경로는 프로젝트 환경에 맞게 확인해주세요 */}
          <img src="/images/bank1.png" className="h-[28px] w-[28px]" alt="bank logo" />
          <div>
            <p className="text-[16px] font-semibold text-gray-900">{item.title}</p>
            <p className="mt-[4px] text-[13px] text-gray-500">
              {item.bank} {item.accountNumber}
            </p>
            {item.accountName && (
              <p className="text-[11px] text-gray-400">{item.accountName}</p>
            )}
          </div>
        </div>

        <button className="flex h-[24px] w-[24px] items-center justify-center text-[18px] text-gray-400">
          ···
        </button>
      </div>

      <div className="mt-[16px] flex items-center justify-between">
        <span className="rounded-[12px] bg-[#E4EEFF] px-[12px] py-[6px] text-[11px] text-[#2F6FD9]">
          {item.badge}
        </span>
        <span className="text-[18px] font-semibold text-gray-900">
          {item.balance}
        </span>
      </div>

      {/* 이체 버튼 영역에 손가락 효과 추가 */}
      <div className="relative mt-[14px] w-full">
        
        {/* 조건 손가락 애니메이션 */}
        {showFingerAnimation && (
          <div className="absolute -top-[35px] left-1/2 -translate-x-1/2 animate-bounce z-10 pointer-events-none">
            <span className="text-[24px]">👇</span>
          </div>
        )}

        <button
          onClick={() => onTransfer(item)}
          className="w-full rounded-[12px] border border-[#D8E5FB] py-[10px] text-[14px] font-semibold text-[#2F6FD9]"
        >
          이체
        </button>
      </div>
    </div>
  );
}