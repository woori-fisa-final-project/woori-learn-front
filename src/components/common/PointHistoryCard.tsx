"use client"; // 포인트 내역 카드를 렌더링하는 컴포넌트로, 클라이언트 렌더링을 전제로 합니다.

interface PointHistoryCardProps {
  date: string; // 거래가 발생한 날짜입니다.
  status: string; // 거래 상태를 나타내는 텍스트입니다.
  amount: string; // 표시할 포인트 금액 문자열입니다.
  type: "earn" | "exchange_request" | "exchange_complete" | "exchange_failed"; // 거래 성격을 구분하는 타입입니다.
  className?: string; // 외부에서 전달되는 추가 스타일 클래스입니다.
}

export default function PointHistoryCard({
  date,
  status,
  amount,
  type,
  className = "",
}: PointHistoryCardProps) {
  const isEarn = type === "earn"; // 적립 내역인지 여부를 판단하여 색상을 다르게 적용합니다.

  return (
    <div
      className={`w-full p-4 bg-white border border-gray-200 rounded-[10px] flex items-center justify-between ${className}`}
    >
      <div className="flex flex-col gap-1">
        <p className="text-[14px] text-gray-600">{date}</p>
        <p className="text-[12px] text-gray-400">{status}</p>
      </div>
      <p className={`text-[16px] font-semibold ${
        isEarn ? "text-primary-400" : "text-gray-500"
      }`}>
        {amount} p {/* 금액에 'p' 단위를 붙여 포인트임을 명시합니다. */}
      </p>
    </div>
  );
}


