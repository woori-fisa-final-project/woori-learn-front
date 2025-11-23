import React, { useState } from 'react';
import ExchangeModal from './ExchangeModal';

interface ExchangeItem {
  id: string;
  userId: string;
  amount: number;
  status: '환전 신청' | '환전 완료';
}

const sampleExchange = [
  { id: '1', userId: 'woori123', name: '홍길동', requestDate: '2025-11-18', amount: 10000, status: '환전 신청' },
  { id: '2', userId: 'fisa678', name: '김철수', requestDate: '2025-11-15', amount: 5000, status: '환전 완료', processedDate: '2025-11-16' },
  { id: '3', userId: 'test456', name: '이영희', requestDate: '2025-11-19', amount: 15000, status: '환전 신청' },
];

const ExchangeList: React.FC = () => {
  const [exchangeList, setExchangeList] = useState<any[]>(sampleExchange);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');

  const handleApproveClick = (id: string) => {
    setSelectedId(id);
    setModalOpen(true);
  };

  const handleApprove = () => {
    if (selectedId) {
      setExchangeList((prev) =>
        prev.map((item) =>
          item.id === selectedId
            ? { ...item, status: '환전 완료', processedDate: new Date().toISOString().slice(0, 10) }
            : item
        )
      );
    }
    setModalOpen(false);
    setSelectedId(null);
  };

  const filteredList = exchangeList
    .filter(item => {
      const keyword = search.trim().toLowerCase();
      if (!keyword) return true;
      return (
        (item.userId && item.userId.toLowerCase().includes(keyword)) ||
        (item.name && item.name.toLowerCase().includes(keyword))
      );
    })
    .filter(item => {
      if (!filter) return true;
      return item.status === filter;
    });

  return (
    <div className="w-full">
      <h2 className="text-2xl sm:text-xl md:text-xl font-bold mb-3 sm:mb-4 md:mb-4 text-center">포인트 전환 신청 내역</h2>
      <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-5 md:mb-6 w-full justify-between">
        <input
          type="text"
          placeholder="아이디/이름 검색"
          className="border border-gray-300 rounded px-3 py-2 w-full sm:w-48 md:w-60 text-sm sm:text-base"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="border border-gray-300 rounded px-3 py-2 w-full sm:w-auto text-sm sm:text-base"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        >
          <option value="">전체</option>
          <option value="환전 신청">신청</option>
          <option value="환전 완료">완료</option>
        </select>
      </div>
      <div className="rounded-lg shadow bg-white p-4 sm:p-6 md:p-8 w-full overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-200 bg-white min-w-[800px]">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-200 px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-xs sm:text-sm md:text-base">회원 ID</th>
              <th className="border border-gray-200 px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-xs sm:text-sm md:text-base">이름</th>
              <th className="border border-gray-200 px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-xs sm:text-sm md:text-base hidden md:table-cell">신청일자</th>
              <th className="border border-gray-200 px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-xs sm:text-sm md:text-base">신청금액</th>
              <th className="border border-gray-200 px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-xs sm:text-sm md:text-base">처리상태</th>
              <th className="border border-gray-200 px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-xs sm:text-sm md:text-base hidden lg:table-cell">처리일자</th>
              <th className="border border-gray-200 px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-xs sm:text-sm md:text-base w-20 sm:w-24">관리</th>
            </tr>
          </thead>
          <tbody>
            {filteredList.map((item) => (
              <tr key={item.id} className="hover:bg-primary-50 transition-colors">
                <td className="border border-gray-200 px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-center whitespace-nowrap text-xs sm:text-sm md:text-base">{item.userId}</td>
                <td className="border border-gray-200 px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-center whitespace-nowrap text-xs sm:text-sm md:text-base">{item.name}</td>
                <td className="border border-gray-200 px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-center whitespace-nowrap text-xs sm:text-sm md:text-base hidden md:table-cell">{item.requestDate}</td>
                <td className="border border-gray-200 px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-center whitespace-nowrap text-xs sm:text-sm md:text-base">{item.amount?.toLocaleString()}원</td>
                <td className="border border-gray-200 px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-center whitespace-nowrap text-xs sm:text-sm md:text-base">{item.status}</td>
                <td className="border border-gray-200 px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-center whitespace-nowrap text-xs sm:text-sm md:text-base hidden lg:table-cell">{item.processedDate || '-'}</td>
                <td className="border border-gray-200 px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-center w-20 sm:w-24 whitespace-nowrap">
                  {item.status === '환전 신청' && (
                    <button
                      className="px-2 sm:px-3 py-1 bg-primary-400 text-white rounded hover:bg-primary-600 transition-colors text-xs sm:text-sm"
                      onClick={() => handleApproveClick(item.id)}
                    >
                      승인
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ExchangeModal open={modalOpen} onClose={() => setModalOpen(false)} onApprove={handleApprove} />
    </div>
  );
};

export default ExchangeList;
