"use client"; // 약관 상세 내용을 스크롤하고 버튼을 누르기 위해 클라이언트 전용으로 선언합니다.
import Button from "@/components/common/Button"; // 닫기 동작을 제공하는 하단 확인 버튼입니다.
import PageHeader from "@/components/common/PageHeader"; // 상단 제목과 뒤로가기 버튼을 렌더링합니다.

interface AgreementDetailProps {
  title: string; // 상세 페이지 상단에 표시될 약관 제목입니다.
  content: string; // 본문 영역에 렌더링할 약관 전문 텍스트입니다.
  onClose: () => void; // 사용자가 뒤로가기를 선택했을 때 호출되는 콜백입니다.
}

export default function AgreementDetail({
  title,
  content,
  onClose,
}: AgreementDetailProps) {
  // 약관 전문을 별도 화면에서 보여주고 확인 버튼으로 닫을 수 있도록 구성합니다.
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
