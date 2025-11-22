"use client";

import Button from "@/components/common/Button";

export default function AlertModalContent({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-[20px] px-[10px] py-[16px] text-center">
      <h2 className="text-[18px] font-semibold text-gray-900">안내</h2>
      <p className="whitespace-pre-line text-[14px] text-gray-600">{message}</p>

      <Button onClick={onClose} size="sm">
        확인
      </Button>
    </div>
  );
}
