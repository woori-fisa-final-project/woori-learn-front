"use client";

interface AgreementAllButtonProps {
  title: string;
  isAllAgreed: boolean;
  onToggle: () => void;
}

export default function AgreementAllButton({
  title,
  isAllAgreed,
  onToggle,
}: AgreementAllButtonProps) {
  const termcheckIcon = "/images/Termcheck.png";
  const termcheck2Icon = "/images/Termcheck2.png";

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

