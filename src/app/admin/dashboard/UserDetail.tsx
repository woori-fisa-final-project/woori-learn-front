import React from 'react';

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

interface UserDetailProps {
  user: {
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
  };
  onBack: () => void;
}


const UserDetail: React.FC<UserDetailProps> = ({ user, onBack }) => {
  return (
    <div className="p-8 border border-gray-200 rounded-lg bg-white w-full">
      <button className="mb-4 text-blue-600 hover:underline" onClick={onBack}>&larr; 회원 목록으로</button>
      <h2 className="text-2xl font-bold mb-6">회원 상세정보</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <div className="mb-2"><span className="font-semibold">회원 ID:</span> {user.userId}</div>
          <div className="mb-2"><span className="font-semibold">이름:</span> {user.name}</div>
          <div className="mb-2"><span className="font-semibold">생성일자:</span> {user.creationDate}</div>
          <div className="mb-2 flex items-center gap-2">
            <span className="font-semibold">교육 진행률:</span>
            <div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-3 bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: user.progress }}
              ></div>
            </div>
            <span className="text-xs text-gray-700 font-semibold min-w-8 text-right">{user.progress}</span>
          </div>
        </div>
        <div>
          <div className="mb-2"><span className="font-semibold">보유 포인트:</span> {user.points.toLocaleString()}p</div>
          <div className="mb-2"><span className="font-semibold">환전한 포인트:</span> {user.exchangedPoints.toLocaleString()}p</div>
          <div className="mb-2"><span className="font-semibold">계좌번호:</span> {user.account.accountNumber}</div>
          <div className="mb-2"><span className="font-semibold">계좌 연동일시:</span> {user.account.createdAt}</div>
        </div>
      </div>
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2">시나리오 완료 여부</h3>
        <ul className="list-disc pl-6">
          {user.scenarios.map((s) => (
            <li key={s.name} className={s.completed ? 'text-green-600' : 'text-gray-400'}>
              {s.name} {s.completed ? '(완료)' : '(미완료)'}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="text-lg font-bold mb-2">포인트 적립/출금 내역</h3>
        <div className="flex flex-col gap-3">
          {user.pointHistory.map((h, idx) => (
            <div key={idx} className="flex items-center gap-4 border-b border-gray-100 pb-2 last:border-b-0">
              <span className="text-sm text-gray-500 w-28">{h.date}</span>
              <span className="text-sm w-32">{h.status}</span>
              <span className={`text-base font-semibold ${h.type === 'earn' ? 'text-blue-600' : 'text-red-500'}`}>{h.amount}p</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
