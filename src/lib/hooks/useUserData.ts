import { useState, useEffect } from 'react';
import { getCurrentUser } from '@/lib/api/user.api';
import { getAvailablePoints, setAvailablePoints as cachePoints } from '@/constants/points';

/**
 * 사용자 데이터를 관리하는 커스텀 훅
 * 
 * API 우선으로 동작하며 localStorage는 캐시/폴백용으로만 사용:
 * 1. API에서 최신 데이터 가져오기 시도
 * 2. 성공 시 localStorage에 캐시
 * 3. 실패 시 localStorage 캐시 데이터 사용 (폴백)
 */
export function useUserData() {
  const [userName, setUserName] = useState('아무개');
  const [availablePoints, setAvailablePoints] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (typeof window === 'undefined') return; // SSR 안전 처리

      try {
        setIsLoading(true);
        setError(null);

        // 1. API에서 최신 사용자 데이터 가져오기
        const userData = await getCurrentUser();

        setUserName(userData.name);
        setAvailablePoints(userData.points);

        // 2. localStorage에 캐시 저장
        localStorage.setItem('userName', userData.name);
        cachePoints(userData.points);

      } catch (err) {
        // 3. API 실패 시 localStorage 캐시 데이터 사용 (폴백)
        console.warn('API 호출 실패, 캐시 데이터 사용:', err);
        setError('사용자 정보를 불러오는 중 문제가 발생했습니다.');

        const cachedName = localStorage.getItem('userName');
        const cachedPoints = getAvailablePoints();

        if (cachedName) setUserName(cachedName);
        setAvailablePoints(cachedPoints);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  /**
   * 사용자 이름 업데이트 함수
   * API 호출은 하지 않고 로컬 상태만 업데이트 (필요시 API 연동 가능)
   */
  const updateUserName = (name: string) => {
    setUserName(name);
    if (typeof window !== 'undefined') {
      localStorage.setItem('userName', name);
    }
  };

  return {
    userName,
    availablePoints,
    isLoading,
    error,
    updateUserName,
  };
}


