"use client";

export default function FilterBottomSheet({
  open,
  onClose,
  draft,
  setDraft,
  onApply,
  onReset,
}: any) {
  if (!open) return null;

  const PERIOD_OPTIONS = ["이번달", "3개월", "6개월", "1년"];

  const handleSelectPeriod = (label: string) => {
    setDraft((prev: any) => ({
      ...prev,
      period: label,
    }));
  };

  return (
    <>
      {/* Dim */}
      <button className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />

      {/* Bottom Sheet */}
      <div className="fixed bottom-0 inset-x-0 z-50 bg-white rounded-t-[24px] p-[24px] shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-[20px]">
          <h3 className="text-[16px] font-semibold text-gray-900">조회조건 선택</h3>
          <button className="text-[22px] text-gray-500" onClick={onClose}>
            ×
          </button>
        </div>

        {/* 조회기간 */}
        <section>
          <h4 className="text-[14px] font-medium text-gray-700">조회기간</h4>

          <div className="mt-[12px] grid grid-cols-4 gap-[8px]">
            {PERIOD_OPTIONS.map((label) => (
              <button
                key={label}
                onClick={() => handleSelectPeriod(label)}
                className={`rounded-[12px] px-[10px] py-[10px] text-[13px] ${
                  draft.period === label
                    ? "bg-[#2F6FD9] text-white"
                    : "bg-[#F5F6F8] text-gray-600"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </section>

        {/* 거래구분 */}
        <section className="mt-[24px]">
          <h4 className="text-[14px] font-medium text-gray-700">거래구분</h4>
          <div className="mt-[12px] flex gap-[10px]">
            {["전체", "입금", "출금"].map((t) => (
              <button
                key={t}
                onClick={() => setDraft((prev: any) => ({ ...prev, type: t }))}
                className={`rounded-[12px] px-[14px] py-[10px] text-[13px] ${
                  draft.type === t
                    ? "bg-[#2F6FD9] text-white"
                    : "bg-[#F5F6F8] text-gray-600"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </section>

        {/* 정렬 */}
        <section className="mt-[20px]">
          <h4 className="text-[14px] font-medium text-gray-700">정렬</h4>
          <div className="mt-[12px] flex gap-[10px]">
            {["최신순", "과거순"].map((t) => (
              <button
                key={t}
                onClick={() =>
                  setDraft((prev: any) => ({ ...prev, sortOrder: t }))
                }
                className={`rounded-[12px] px-[14px] py-[10px] text-[13px] ${
                  draft.sortOrder === t
                    ? "bg-[#2F6FD9] text-white"
                    : "bg-[#F5F6F8] text-gray-600"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </section>

        {/* Buttons */}
        <div className="mt-[28px] flex gap-[12px]">
          <button
            onClick={onReset}
            className="flex-1 py-[12px] border border-[#D3DCF0] rounded-[12px] text-gray-600"
          >
            초기화
          </button>

          <button
            onClick={onApply}
            className="flex-1 py-[12px] rounded-[12px] bg-[#2F6FD9] text-white font-semibold"
          >
            적용하기
          </button>
        </div>
      </div>
    </>
  );
}
