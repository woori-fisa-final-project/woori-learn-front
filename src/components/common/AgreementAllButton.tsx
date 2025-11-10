"use client"; // 버튼 클릭 시 상태를 변경하므로 클라이언트 전용으로 선언합니다.

interface AgreementAllButtonProps {
  title: string; // 버튼에 표시할 전체 동의 문구입니다.
  isAllAgreed: boolean; // 모든 약관이 동의된 상태인지 나타내는 플래그입니다.
  onToggle: () => void; // 전체 동의 상태를 토글하기 위한 콜백입니다.
}

export default function AgreementAllButton({
  title,
  isAllAgreed,
  onToggle,
}: AgreementAllButtonProps) {
  const termcheckIcon = "/images/Termcheck.png"; // 동의되지 않은 상태에서 사용할 체크박스 아이콘입니다.
  const termcheck2Icon = "/images/Termcheck2.png"; // 동의된 상태에서 사용할 체크박스 아이콘입니다.

  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center gap-3 p-4 bg-gray-50 rounded-[4px] hover:bg-gray-100 transition-colors h-[56px]"
    >
      <img
        alt="체크"
        src={isAllAgreed ? termcheck2Icon : termcheckIcon}
        className="object-contain"
        style={{ width: "24px", height: "24px" }}
      />
      <p className="text-[15px] text-gray-700 font-normal">{title}</p>
    </button>
  );
}



