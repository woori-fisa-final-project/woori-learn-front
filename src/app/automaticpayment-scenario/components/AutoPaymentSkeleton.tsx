export default function AutoPaymentSkeleton() {
  return (
    <div className="mx-auto h-full flex-col flex min-h-[85dvh] w-full max-w-[390px] bg-white animate-pulse">
      <main className="flex h-full flex-col px-[20px] pb-[24px]">
        {/* 상단 헤더 영역 스켈레톤 */}
        <section className="mt-[26px] space-y-[16px]">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-[6px]">
              {/* WON 통장(0000) */}
              <div className="h-[28px] w-[160px] bg-gray-200 rounded"></div>
            </div>
          </div>

          <div className="flex items-center gap-[8px]">
            {/* 등록된 자동이체 X건 */}
            <div className="h-[24px] w-[180px] bg-gray-200 rounded"></div>
            <div className="h-[20px] w-[20px] bg-gray-200 rounded-full"></div>
          </div>

          {/* 출금결과조회 */}
          <div className="h-[18px] w-[90px] bg-gray-200 rounded"></div>
        </section>

        {/* 메인 컨텐츠 영역 */}
        <div className="flex flex-1 flex-col py-[36px]">
          <div className="flex-1 overflow-y-auto">
            {/* 자동이체 카드 스켈레톤 (3개) */}
            <div className="w-full space-y-[16px] pt-[30px]">
              {[1, 2, 3].map((index) => (
                <AutoTransferCardSkeleton key={index} />
              ))}
            </div>
          </div>

          {/* 하단 고정 버튼 영역 스켈레톤 */}
          <div className="mt-[24px] flex-shrink-0">
            <div className="h-[52px] w-full bg-gray-200 rounded-[12px]"></div>
          </div>
        </div>
      </main>
    </div>
  );
}

function AutoTransferCardSkeleton() {
  return (
    <div className="w-full rounded-[20px] border border-[#E1E6F0] bg-white px-[22px] py-[24px] shadow-[0_4px_16px_rgba(34,58,124,0.08)]">
      <div className="flex items-start justify-between">
        {/* 상태 뱃지 */}
        <div className="h-[28px] w-[60px] bg-gray-200 rounded-full"></div>
        <div className="h-[24px] w-[24px] bg-gray-200 rounded"></div>
      </div>

      <div className="mt-[16px] space-y-[16px]">
        {/* 자동이체 타이틀 */}
        <div>
          <div className="h-[16px] w-[80px] bg-gray-200 rounded mb-[6px]"></div>
          <div className="h-[20px] w-[140px] bg-gray-200 rounded"></div>
        </div>

        {/* 입금정보 */}
        <div className="flex justify-between">
          <div className="h-[16px] w-[60px] bg-gray-200 rounded"></div>
          <div className="h-[16px] w-[180px] bg-gray-200 rounded"></div>
        </div>

        {/* 이체금액 */}
        <div className="flex justify-between">
          <div className="h-[16px] w-[60px] bg-gray-200 rounded"></div>
          <div className="h-[16px] w-[100px] bg-gray-200 rounded"></div>
        </div>

        {/* 이체일자/주기 */}
        <div className="flex justify-between">
          <div className="h-[16px] w-[90px] bg-gray-200 rounded"></div>
          <div className="h-[16px] w-[120px] bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
}
