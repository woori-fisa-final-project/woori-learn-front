import React from 'react';

interface ExchangeModalProps {
  open: boolean;
  onClose: () => void;
  onApprove: () => void;
}

const ExchangeModal: React.FC<ExchangeModalProps> = ({ open, onClose, onApprove }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-xs flex flex-col items-center">
        <h2 className="text-lg font-bold mb-4">포인트 전환 승인</h2>
        <p className="mb-6 text-center">정말로 이 신청을 승인하시겠습니까?</p>
        <div className="flex gap-4 w-full">
          <button className="flex-1 py-2 rounded bg-gray-200 hover:bg-gray-300" onClick={onClose}>취소</button>
          <button className="flex-1 py-2 rounded bg-blue-600 text-white hover:bg-blue-700" onClick={onApprove}>승인</button>
        </div>
      </div>
    </div>
  );
};

export default ExchangeModal;
