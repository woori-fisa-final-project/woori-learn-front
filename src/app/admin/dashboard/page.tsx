'use client';


import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { useRouter } from 'next/navigation';
import UserDetail from './UserDetail';
import ExchangeList from './ExchangeList';
import PageContainer from '../../../components/common/PageContainer';
import Button from '../../../components/common/Button';
import ProgressBar from '../../../components/common/ProgressBar';
import PointHistoryCard from '../../../components/common/PointHistoryCard';

interface AccountInfo {
  accountNumber: string;
  createdAt: string;
}

interface ScenarioStatus {
  name: string;
  completed: boolean;
}

interface PointHistory {
  date: string;
  status: string;
  amount: string;
  type: 'earn' | 'exchange_request' | 'exchange_complete' | 'exchange_failed';
}

interface User {
  id: string;
  userId: string;
  name: string;
  creationDate: string;
  points: number;
  exchangedPoints: number;
  progress: string;
  account: AccountInfo;
  scenarios: ScenarioStatus[];
  pointHistory: PointHistory[];
}

const sampleData: User[] = [
  {
    id: '12345',
    userId: 'woori123',
    name: '홍길동',
    creationDate: '2025-11-20',
    points: 100,
    exchangedPoints: 30,
    progress: '80%',
    account: {
      accountNumber: '110-1234-5678',
      createdAt: '2025-11-21 10:00',
    },
    scenarios: [
      { name: '시나리오1', completed: true },
      { name: '시나리오2', completed: false },
    ],
    pointHistory: [
      { date: '2025-11-01', status: '적립', amount: '+50', type: 'earn' },
      { date: '2025-10-20', status: '적립', amount: '+30', type: 'earn' },
      { date: '2025-10-10', status: '환전 신청', amount: '-20', type: 'exchange_request' },
    ],
  },
  {
    id: '67890',
    userId: 'fisa678',
    name: '김철수',
    creationDate: '2025-10-15',
    points: 200,
    exchangedPoints: 0,
    progress: '50%',
    account: {
      accountNumber: '110-9876-5432',
      createdAt: '2025-10-16 09:30',
    },
    scenarios: [
      { name: '시나리오1', completed: true },
      { name: '시나리오2', completed: true },
    ],
    pointHistory: [
      { date: '2025-10-15', status: '적립', amount: '+100', type: 'earn' },
      { date: '2025-10-12', status: '환전 완료', amount: '-50', type: 'exchange_complete' },
    ],
  },
];

type Section = 'users' | 'userDetail' | 'exchange';

const AdminMain = () => {
  const [section, setSection] = useState<Section>('users');
  const router = useRouter();
    // TODO: 실제 로그아웃 처리 (API 연동)
    const handleLogout = () => {
      alert('로그아웃 되었습니다.');
      router.push('/');
    };
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [search, setSearch] = useState('');
  const [userFilter, setUserFilter] = useState('');

  const filteredUsers = sampleData
    .filter(user => {
      const keyword = search.trim().toLowerCase();
      if (!keyword) return true;
      return (
        user.userId.toLowerCase().includes(keyword) ||
        user.name.toLowerCase().includes(keyword)
      );
    })
    .filter(user => {
      if (!userFilter) return true;
      const progress = parseInt(user.progress.replace('%', ''));
      if (userFilter === 'progress-100') return progress === 100;
      if (userFilter === 'progress-incomplete') return progress < 100;
      return true;
    });

  // TODO: 회원 목록 불러오기 (API 연동)
  // useEffect(() => {
  //   fetch('/api/users').then(...)
  // }, [])

  const handleNavigate = (target: Section) => {
    setSection(target);
    if (target !== 'userDetail') setSelectedUser(null);
  };

  const handleUserClick = (user: User) => {
    // TODO: 회원 상세정보 요청 (API 연동)
    // fetch(`/api/users/${user.id}`)
    setSelectedUser(user);
    setSection('userDetail');
  };

  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      <div className="h-screen sticky top-0 left-0 flex-none">
        <Sidebar onNavigate={handleNavigate} onLogout={handleLogout} />
      </div>
      
        <div className="max-w-7xl mx-auto min-h-screen px-8 py-6 flex flex-col">
          <h1 className="text-3xl font-bold mb-12 text-center">우리 관리자 센터</h1>
          {section === 'users' && (
            <div className="w-full max-w-7xl mx-auto">
              <h2 className="text-xl font-semibold mb-6 text-center">회원 목록</h2>
              {/* 검색/필터 UI */}
              <div className="flex flex-wrap gap-2 mb-4 w-full justify-between">
                <input
                  type="text"
                  placeholder="아이디/이름 검색"
                  className="border border-gray-300 rounded px-3 py-2 w-60"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                <select
                  className="border border-gray-300 rounded px-3 py-2"
                  value={userFilter}
                  onChange={e => setUserFilter(e.target.value)}
                >
                  <option value="">전체</option>
                  <option value="progress-100">100% 완료</option>
                  <option value="progress-incomplete">미완료</option>
                </select>
              </div>
              <div className="rounded-lg shadow bg-white p-8 w-full">
                <table className="table-auto w-full border-collapse border border-gray-200 bg-white">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-200 px-4 py-3">회원 ID</th>
                      <th className="border border-gray-200 px-4 py-3">이름</th>
                      <th className="border border-gray-200 px-4 py-3">생성일자</th>
                      <th className="border border-gray-200 px-4 py-3">보유 포인트</th>
                      <th className="border border-gray-200 px-4 py-3">교육 진행률</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sampleData.map((user) => {
                      const progressValue = parseInt(user.progress.replace('%', ''));
                      return (
                        <tr
                          key={user.id}
                          className="hover:bg-blue-50 cursor-pointer"
                          onClick={() => handleUserClick(user)}
                        >
                          <td className="border border-gray-200 px-4 py-3 text-center font-semibold">{user.userId}</td>
                          <td className="border border-gray-200 px-4 py-3 text-center">{user.name}</td>
                          <td className="border border-gray-200 px-4 py-3 text-center">{user.creationDate}</td>
                          <td className="border border-gray-200 px-4 py-3 text-center">{user.points.toLocaleString()}p</td>
                          <td className="border border-gray-200 px-4 py-3 text-center">
                            <div className="flex items-center gap-2 justify-center">
                              <div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-3 bg-blue-500 rounded-full transition-all duration-300"
                                  style={{ width: `${progressValue}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-gray-700 font-semibold min-w-8 text-right">{user.progress}</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {section === 'userDetail' && selectedUser && (
            <div className="w-full max-w-5xl mx-auto mt-12">
              <UserDetail user={selectedUser} onBack={() => handleNavigate('users')} />
            </div>
          )}
          {section === 'exchange' && (
            <div className="w-full max-w-6xl mx-auto mt-12">
              {/* TODO: 환전 신청 목록 불러오기 (API 연동) */}
              <ExchangeList />
            </div>
          )}
        </div>
      
    </div>
  );
};

export default AdminMain;
