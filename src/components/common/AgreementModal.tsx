"use client"; // 모달 열림 상태를 클라이언트에서 제어하므로 클라이언트 전용으로 선언합니다.
import Button from "@/components/common/Button"; // 모달 하단에 표시될 공통 버튼입니다.

interface AgreementModalProps {
  isOpen: boolean; // 모달 표시 여부를 제어하는 플래그입니다.
  onClose: () => void; // 모달을 닫기 위한 콜백 함수입니다.
  title: string; // 모달 상단에 표시될 제목입니다.
  content: string; // 본문 스크롤 영역에 표시할 약관 내용입니다.
}

export default function AgreementModal({
  isOpen,
  onClose,
  title,
  content,
}: AgreementModalProps) {
  if (!isOpen) return null; // 닫혀 있는 상태에서는 아무 것도 렌더링하지 않습니다.

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) { // 오버레이 영역을 직접 클릭했을 때만 모달을 닫습니다.
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity duration-300"
      onClick={handleOverlayClick}
    >
      <div
        className="bg-white rounded-[20px] w-full max-w-[min(100%,_390px)] mx-4 p-6 max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-[20px] text-gray-700 font-semibold mb-4">
          {title}
        </h2>

        {/* 약관 내용 */}
        <div className="flex-1 overflow-y-auto mb-4">
          <div className="bg-gray-50 rounded-[10px] p-4">
            <pre className="text-[14px] text-gray-700 whitespace-pre-wrap font-normal leading-relaxed">
              {content}
            </pre>
          </div>
        </div>

        {/* 닫기 버튼 */}
        <Button onClick={onClose}>확인</Button>
      </div>
    </div>
  );
}



