"use client"; // 리스트 항목 클릭 시 토글 동작을 처리하므로 클라이언트 전용으로 선언합니다.

interface AgreementItemProps {
  id: string; // 항목을 구분하기 위한 고유 식별자입니다.
  title: string; // 약관 제목 또는 설명 텍스트입니다.
  required?: boolean; // 필수 여부를 나타내는 값(현재 UI에서는 표시용으로 사용되지 않지만 의미 정보를 제공합니다).
  isAgreed: boolean; // 현재 항목이 동의 상태인지 나타내는 값입니다.
  onToggle: (id: string) => void; // 항목을 클릭했을 때 동의 상태를 변경하기 위한 콜백입니다.
  onView?: (id: string) => void; // 상세 내용을 확인하고자 할 때 호출되는 콜백입니다.
  showViewButton?: boolean; // 상세 보기 버튼을 노출할지 여부입니다.
}

export default function AgreementItem({
  id,
  title,
  required = false,
  isAgreed,
  onToggle,
  onView,
  showViewButton = true,
}: AgreementItemProps) {
  const termchecksIcon = "/images/Termchecks.png"; // 체크 상태를 시각적으로 표현하는 아이콘 경로입니다.

  return (
    <div className="flex items-center justify-between p-0 bg-transparent">
      <button
        onClick={() => onToggle(id)}
        className="flex items-center gap-3 flex-1"
      >
        <img
          alt="체크"
          src={termchecksIcon}
          className={`w-4 h-4 object-contain ${
            isAgreed ? "opacity-100" : "opacity-50"
          }`}
        />
        <div className="flex-1 text-left">
          <p className="text-[14px] text-gray-700 font-normal leading-[1.3]">
            {title}
          </p>
        </div>
      </button>
      {showViewButton && onView && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onView(id);
          }}
          className="text-[12px] text-gray-500 underline ml-2 shrink-0"
        >
          보기
        </button>
      )}
    </div>
  );
}

