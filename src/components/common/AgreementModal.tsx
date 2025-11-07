"use client";
import Button from "@/components/common/Button";

interface AgreementModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

export default function AgreementModal({
  isOpen,
  onClose,
  title,
  content,
}: AgreementModalProps) {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
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

