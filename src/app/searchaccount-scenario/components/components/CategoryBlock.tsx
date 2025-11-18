"use client";

import type { AccountCard } from "../hooks/useAccountList";
import AccountCardComponent  from "./AccountCard";

interface Props {
  title: string;
  accounts: AccountCard[];
  onTransfer: (acc: AccountCard) => void;
}

export default function CategoryBlock({ title, accounts, onTransfer }: Props) {
  const categoryTotal = accounts.reduce((sum: any, acc: any) => sum + acc.rawBalance, 0);

  return (
    <div>
      <div className="flex items-center justify-between text-[13px] text-gray-500">
        <span>{title}</span>
        <span>{categoryTotal.toLocaleString("ko-KR")}원</span>
      </div>

      <div className="mt-[16px] space-y-[16px]">
        {accounts.map((item: any) => (
          <AccountCardComponent  key={item.id} item={item} onTransfer={onTransfer} />
        ))}
      </div>
    </div>
  );
}
