import React from 'react';

type Section = 'users' | 'userDetail' | 'exchange';

interface SidebarProps {
  currentSection: Section;
  onNavigate: (section: Section) => void;
  onLogout?: () => void;
}

/**
 * 데스크톱 전용 사이드바 컴포넌트
 * lg 이상 화면에서만 표시되며, 좌측에 고정되어 있습니다.
 */
const Sidebar: React.FC<SidebarProps> = ({ currentSection, onNavigate, onLogout }) => {
  return (
    <aside className="
      hidden lg:block
      fixed left-0 top-14 sm:top-16
      w-56
      h-[calc(100dvh-3.5rem)] sm:h-[calc(100dvh-4rem)]
      bg-primary-50
      border-r border-gray-200
      p-4 sm:p-5 md:p-6
      flex flex-col
      gap-4
      overflow-y-auto
    ">
      <div className="flex flex-col gap-4 flex-1">
        <h2 className="text-lg sm:text-xl font-bold text-primary-600 mb-2">
          관리자 메뉴
        </h2>
        <button
          className={`
            text-left px-4 py-3 rounded
            transition-colors
            text-sm sm:text-base font-medium
            ${currentSection === 'users'
              ? 'bg-primary-500 text-white'
              : 'text-gray-700 hover:bg-primary-100'
            }
          `}
          onClick={() => onNavigate('users')}
        >
          회원 목록
        </button>
        <button
          className={`
            text-left px-4 py-3 rounded
            transition-colors
            text-sm sm:text-base font-medium
            ${currentSection === 'exchange'
              ? 'bg-primary-500 text-white'
              : 'text-gray-700 hover:bg-primary-100'
            }
          `}
          onClick={() => onNavigate('exchange')}
        >
          포인트 환전 신청 목록
        </button>
      </div>
      {onLogout && (
        <button
          className="
            px-4 py-3 rounded
            bg-red-100 text-red-600
            hover:bg-red-200
            transition-colors
            text-sm sm:text-base font-semibold
            w-full
          "
          onClick={onLogout}
        >
          로그아웃
        </button>
      )}
    </aside>
  );
};

export default Sidebar;
