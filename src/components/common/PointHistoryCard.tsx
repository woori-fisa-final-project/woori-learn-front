"use client";

interface PointHistoryCardProps {
  date: string;
  status: string;
  amount: string;
  type: "earn" | "exchange_request" | "exchange_complete" | "exchange_failed";
  className?: string;
}

export default function PointHistoryCard({
  date,
  status,
  amount,
  type,
  className = "",
}: PointHistoryCardProps) {
  const amountColor =
    type === "earn" ? "text-primary-400" : "text-gray-600";

  return (
    <div
      className={`w-full p-4 bg-white border border-gray-200 rounded-[10px] flex items-center justify-between ${className}`}
    >
      <div className="flex flex-col gap-1">
        <p className="text-[14px] text-gray-600">{date}</p>
        <p className="text-[12px] text-gray-400">{status}</p>
      </div>
      <p className={`text-[16px] font-semibold ${amountColor}`}>
        {amount} p
      </p>
    </div>
  );
}


