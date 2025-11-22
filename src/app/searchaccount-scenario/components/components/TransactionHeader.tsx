"use client";

import { AccountInfo } from "../hooks/useAccountInfo";

export default function TransactionHeader({ account }: { account: AccountInfo }) {
  return (
    <section className="mt-[20px]">
      <div className="flex items-center gap-[12px]">
        <img
          src="/images/bank1.png"
          alt="우리은행 로고"
          className="h-[40px] w-[40px]"
        />
        <div>
          <p className="text-[14px] text-gray-500">WON통장</p>
          <p className="mt-[4px] text-[18px] font-semibold text-gray-900">
            우리 {account.accountNumber}
          </p>
          <p className="text-[11px] text-gray-400">{account.accountName}</p>
        </div>
      </div>

      <div className="mt-[20px] flex flex-col items-end">
        <p className="text-[20px] font-bold text-gray-900">
          {account.balance.toLocaleString()}원
        </p>
        <p className="mt-[8px] text-[13px] text-gray-500">
          출금가능금액 {account.balance.toLocaleString()}원
        </p>
      </div>
    </section>
  );
}
