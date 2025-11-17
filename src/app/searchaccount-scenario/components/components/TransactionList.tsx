"use client";

import TransactionItem from "./TransactionItem";
import { Transaction } from "@/types";

export default function TransactionList({
  grouped,
  onSelect,
}: {
  grouped: Array<{ label: string; items: Transaction[] }>;
  onSelect: (t: Transaction) => void;
}) {
  return (
    <section className="mt-[28px]">
      {grouped.map((group) => (
        <div key={group.label} className="mb-[20px]">
          <h2 className="text-[16px] font-semibold text-gray-900">
            {group.label}
          </h2>

          <ul className="mt-[16px] space-y-[12px]">
            {group.items.map((tx) => (
              <TransactionItem key={tx.id} item={tx} onSelect={onSelect} />
            ))}
          </ul>
        </div>
      ))}

      {grouped.length === 0 && (
        <div className="bg-white p-[24px] text-center text-[14px] text-gray-500">
          선택한 조건에 해당하는 거래내역이 없습니다.
        </div>
      )}
    </section>
  );
}
