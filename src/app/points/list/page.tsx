'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import PageContainer from '@/components/common/PageContainer';
import PointHistoryCard from '@/components/common/PointHistoryCard';
import FilterBottomSheet from '@/components/common/FilterBottomSheet';
import Image from 'next/image';

const searchIcon = '/images/search.png';

export default function PointListPage() {
  const router = useRouter();

  // 탭 상태
  const [activeTab, setActiveTab] = useState<'history' | 'exchange'>('history');

  // 바텀시트
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  // 필터 상태
  const [filterState, setFilterState] = useState({
    period: 'THREE_MONTHS',
    sort: 'DESC',
    status: 'ALL',
    page: 0,
    size: 50,
  });

  // 조회 결과 리스트
  const [historyList, setHistoryList] = useState<any[]>([]);

  // 카드 타입 매핑
  const cardTypeMap: any = {
    WITHDRAW_APPLY: 'exchange_request',
    WITHDRAW_SUCCESS: 'exchange_complete',
    WITHDRAW_FAILED: 'exchange_failed',
  };

  // 카드용 상태 텍스트
  const statusText: any = {
    WITHDRAW_APPLY: '환전 신청',
    WITHDRAW_SUCCESS: '환전 완료',
    WITHDRAW_FAILED: '환전 실패',
  };

  // UI 표시용 텍스트
  const viewText: any = {
    status: {
      ALL: '전체',
      WITHDRAW_APPLY: '환전 신청',
      WITHDRAW_SUCCESS: '환전 완료',
      WITHDRAW_FAILED: '환전 실패',
    },
    sort: {
      DESC: '최신순',
      ASC: '오래된순',
    },
    period: {
      WEEK: '1주일',
      MONTH: '1개월',
      THREE_MONTHS: '3개월',
      ALL: '전체',
    },
  };

  // ===================================
  // 환전 내역 조회 API 호출
  // ===================================
  const fetchExchangeHistory = async () => {
    try {
      const query = new URLSearchParams({
        period: filterState.period,
        sort: filterState.sort,
        status: filterState.status,
        page: String(filterState.page),
        size: String(filterState.size),
      }).toString();

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/points/history?${query}`,
        {
          method: 'GET',
          credentials: 'include',
        }
      );

      const json = await response.json();

      console.log(' 응답 전체:', json);

      const content = json.content ?? [];
      setHistoryList(content);
    } catch (error) {
      console.error('환전 내역 조회 오류:', error);
    }
  };

  useEffect(() => {
    if (activeTab === 'history') {
      fetchExchangeHistory();
    }
  }, [filterState, activeTab]);

  // 필터 적용
  const handleFilterApply = (filters: any) => {
    const periodMap: any = {
      '1주일': 'WEEK',
      '1개월': 'MONTH',
      '3개월': 'THREE_MONTHS',
      전체: 'ALL',
    };

    const sortMap: any = {
      최신순: 'DESC',
      오래된순: 'ASC',
    };

    //  백엔드 enum 에 맞게 변환
    const statusMap: any = {
      전체: 'ALL',
      '환전 신청': 'WITHDRAW_APPLY',
      '환전 완료': 'WITHDRAW_SUCCESS',
      '환전 실패': 'WITHDRAW_FAILED',
    };

    setFilterState((prev) => ({
      ...prev,
      period: periodMap[filters?.period] ?? prev.period,
      sort: sortMap[filters?.sort] ?? prev.sort,
      status: statusMap[filters?.status] ?? prev.status,
      page: 0,
    }));
  };

  const handleBack = () => router.push('/mypage');
  const handleSearchClick = () => setIsBottomSheetOpen(true);
  const handleBottomSheetClose = () => setIsBottomSheetOpen(false);
  const handleExchangeTab = () => router.push('/points/exchange');

  return (
    <PageContainer>
      <div className="flex h-[calc(100dvh-60px)] w-full flex-col">
        <div className="flex-shrink-0">
          <PageHeader title="포인트 관리" onBack={handleBack} />

          {/* 탭 */}
          <div className="mt-8 flex w-full border-b border-gray-200">
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 pb-3 text-[16px] font-medium ${
                activeTab === 'history'
                  ? 'border-b-2 border-primary-400 text-primary-400'
                  : 'text-gray-400'
              }`}
            >
              포인트 내역
            </button>

            <button
              onClick={handleExchangeTab}
              className="flex-1 pb-3 text-[16px] font-medium text-gray-400"
            >
              포인트 환전
            </button>
          </div>

          {/* 필터 표시 */}
          <div className="mt-5 flex w-full items-center justify-between">
            <p className="text-[14px] text-gray-500">
              {viewText.status[filterState.status]} /{' '}
              {viewText.sort[filterState.sort]} /{' '}
              {viewText.period[filterState.period]}
            </p>

            <button onClick={handleSearchClick} className="h-6 w-6">
              <Image src={searchIcon} width={24} height={24} alt="filter" />
            </button>
          </div>
        </div>

        {/* 리스트 */}
        <div className="mt-5 flex-1 min-h-0 overflow-y-auto">
          <div className="flex flex-col gap-4 pb-4">
            {historyList.length > 0 ? (
              historyList.map((item: any) => (
                <PointHistoryCard
                  key={item.id}
                  date={item.createdAt?.slice(0, 10)}
                  status={statusText[item.status] ?? '상태 없음'}
                  amount={`${item.amount.toLocaleString()} P`}
                  type={cardTypeMap[item.status] ?? 'exchange_request'}
                />
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                조회된 환전 내역이 없습니다.
              </div>
            )}
          </div>
        </div>
      </div>

      <FilterBottomSheet
        isOpen={isBottomSheetOpen}
        onClose={handleBottomSheetClose}
        onApply={handleFilterApply}
        initialFilters={{
          period: '3개월',
          sort: '최신순',
          status: '전체',
        }}
      />
    </PageContainer>
  );
}
