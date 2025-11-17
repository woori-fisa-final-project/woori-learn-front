"use client";

import { Transaction } from "@/types";

export default function TransactionItem({
  item,
  onSelect,
}: {
  item: Transaction;
  onSelect: (t: Transaction) => void;
}) {
  return (
    <li
      className="cursor-pointer rounded-[16px] bg-white p-[18px] shadow-sm transition hover:bg-[#F6F8FC]"
      onClick={() => onSelect(item)}
    >
      <div className="flex justify-between text-[13px] text-gray-500">
        <span>{item.date.replace(/-/g, ".")} {item.time}</span>
      </div>

      <div className="mt-[10px] flex justify-between">
        <div>
          <p className="text-[15px] text-gray-900">{item.counterpartyName}</p>
          <p className="text-[12px] text-gray-500 mt-1">{item.description}</p>
        </div>

        <p
          className={`text-[18px] font-semibold ${item.amount >= 0 ? "text-[#2F6FD9]" : "text-gray-900"}`}
        >
          {item.amount >= 0
            ? `+${item.amount.toLocaleString()}원`
            : `${item.amount.toLocaleString()}원`}
        </p>
      </div>

      {item.runningBalance !== undefined && (
        <p className="mt-[8px] text-right text-[13px] text-gray-500">
          잔액 {item.runningBalance.toLocaleString()}원
        </p>
      )}
    </li>
  );
}
