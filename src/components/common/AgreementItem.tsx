"use client";

interface AgreementItemProps {
  id: string;
  title: string;
  required?: boolean;
  isAgreed: boolean;
  onToggle: (id: string) => void;
  onView?: (id: string) => void;
  showViewButton?: boolean;
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
  const termchecksIcon = "/images/Termchecks.png";

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

