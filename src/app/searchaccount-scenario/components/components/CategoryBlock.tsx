"use client";

import AccountCard from "./AccountCard";

export default function CategoryBlock({
  title,
  accounts,
  onTransfer,
}: any) {
  const categoryTotal = accounts.reduce((sum: any, acc: any) => sum + acc.rawBalance, 0);

  return (
    <div>
      <div className="flex items-center justify-between text-[13px] text-gray-500">
        <span>{title}</span>
        <span>{categoryTotal.toLocaleString("ko-KR")}원</span>
      </div>

      <div className="mt-[16px] space-y-[16px]">
        {accounts.map((item: any) => (
          <AccountCard key={item.id} item={item} onTransfer={onTransfer} />
        ))}
      </div>
    </div>
  );
}
