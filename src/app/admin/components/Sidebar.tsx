import React from 'react';

type Section = 'users' | 'userDetail' | 'exchange';

interface SidebarProps {
  onNavigate: (section: Section) => void;
  onLogout?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onNavigate, onLogout }) => {
  return (
    <aside className="w-56 h-full bg-blue-50 border-r border-gray-200 p-6 flex flex-col gap-4 justify-between">
      <div>
        <h2 className="text-lg font-bold mb-6">관리자 메뉴</h2>
        <button
          className="text-left px-2 py-2 rounded hover:bg-blue-100 transition w-full"
          onClick={() => onNavigate('users')}
        >
          회원 목록
        </button>
        <button
          className="text-left px-2 py-2 rounded hover:bg-blue-100 transition w-full"
          onClick={() => onNavigate('exchange')}
        >
          포인트 환전 신청 목록
        </button>
      </div>
      <button
        className="mt-8 px-2 py-2 rounded bg-red-100 text-red-600 hover:bg-red-200 transition w-full font-semibold"
        onClick={onLogout}
      >
        로그아웃
      </button>
    </aside>
  );
};

export default Sidebar;
