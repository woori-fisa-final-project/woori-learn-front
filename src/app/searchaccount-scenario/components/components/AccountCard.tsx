"use client";

import type { AccountCard } from "@/types";

export default function AccountCard(
  { item, onTransfer }: { item: AccountCard, onTransfer: (item: AccountCard) => void }) {
  return (
    <div className="rounded-[16px] bg-white p-[18px] shadow-sm">
      <div className="flex items-center justify-between gap-[10px]">
        <div className="flex items-center gap-[10px]">
          <img src="/images/bank1.png" className="h-[28px] w-[28px]" />
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

      <button
        onClick={() => onTransfer(item)}
        className="mt-[14px] w-full rounded-[12px] border border-[#D8E5FB] py-[10px] text-[14px] font-semibold text-[#2F6FD9]"
      >
        이체
      </button>
    </div>
  );
}
