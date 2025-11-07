"use client";
import Button from "@/components/common/Button";
import PageHeader from "@/components/common/PageHeader";

interface AgreementDetailProps {
  title: string;
  content: string;
  onClose: () => void;
}

export default function AgreementDetail({
  title,
  content,
  onClose,
}: AgreementDetailProps) {
  return (
    <div className="flex justify-center items-start min-h-screen bg-white overflow-x-hidden">
      <div className="w-full max-w-[390px] min-h-screen flex flex-col">
        {/* Header */}
        <div className="px-5 pt-[31px] pb-[30px]">
          <PageHeader title={title} onBack={onClose} />
        </div>

        {/* Agreement Content */}
        <div className="flex-1 overflow-y-auto px-5 pb-5">
          <div className="bg-white rounded-[10px] p-4">
            <pre className="text-[14px] text-gray-700 whitespace-pre-wrap font-normal leading-relaxed">
              {content}
            </pre>
          </div>
        </div>

        {/* Footer Button */}
        <div className="px-5 pb-5 pt-4 border-t border-gray-200">
          <Button onClick={onClose}>확인</Button>
        </div>
      </div>
    </div>
  );
}
