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
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">포인트 전환 신청 내역</h2>
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="아이디/이름 검색"
          className="border border-gray-300 rounded px-3 py-2 w-60"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="border border-gray-300 rounded px-3 py-2"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        >
          <option value="">전체</option>
          <option value="환전 신청">신청</option>
          <option value="환전 완료">완료</option>
        </select>
      </div>
      <table className="table-auto w-full border-collapse border border-gray-300 bg-white">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">회원 ID</th>
            <th className="border border-gray-300 px-4 py-2">이름</th>
            <th className="border border-gray-300 px-4 py-2">신청일자</th>
            <th className="border border-gray-300 px-4 py-2">신청금액</th>
            <th className="border border-gray-300 px-4 py-2">처리상태</th>
            <th className="border border-gray-300 px-4 py-2">처리일자</th>
            <th className="border border-gray-300 px-4 py-2 w-24">관리</th>
          </tr>
        </thead>
        <tbody>
          {filteredList.map((item) => (
            <tr key={item.id}>
              <td className="border border-gray-300 px-4 py-2 text-center whitespace-nowrap">{item.userId}</td>
              <td className="border border-gray-300 px-4 py-2 text-center whitespace-nowrap">{item.name}</td>
              <td className="border border-gray-300 px-4 py-2 text-center whitespace-nowrap">{item.requestDate}</td>
              <td className="border border-gray-300 px-4 py-2 text-center whitespace-nowrap">{item.amount?.toLocaleString()}원</td>
              <td className="border border-gray-300 px-4 py-2 text-center whitespace-nowrap">{item.status}</td>
              <td className="border border-gray-300 px-4 py-2 text-center whitespace-nowrap">{item.processedDate || '-'}</td>
              <td className="border border-gray-300 px-4 py-2 text-center w-24 whitespace-nowrap">
                {item.status === '환전 신청' && (
                  <button
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
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
      <ExchangeModal open={modalOpen} onClose={() => setModalOpen(false)} onApprove={handleApprove} />
    </div>
  );
};

export default ExchangeList;
