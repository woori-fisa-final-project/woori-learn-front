import { useState, useEffect } from "react";
import { getCurrentUser } from "@/lib/api/user.api";
import { getAvailablePoints, setAvailablePoints as cachePoints } from "@/constants/points";

/**
 * 사용자 데이터를 관리하는 커스텀 훅
 * 
 * API 우선으로 동작하며 localStorage는 캐시/폴백용:
 * 1. API에서 최신 데이터 가져오기
 * 2. 성공 시 localStorage에 캐시
 * 3. 실패 시 localStorage 데이터로 폴백
 */
export function useUserData() {
  const [userId, setUserId] = useState<number | null>(null);
  const [userName, setUserName] = useState("고객님");
  const [availablePoints, setAvailablePoints] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // API 호출
        const data = await getCurrentUser();

        // 안전한 필드 매핑 (백엔드 스키마 변화 대응)
        const safeId = data.id ?? null;
        const safeName =
          data.name ??
          (data as { nickname?: string }).nickname ??
          "고객님";

        const pointsRaw =
          data.points ?? (data as { point?: number }).point;
        const safePoints = typeof pointsRaw === "number" ? pointsRaw : 0;

        // 상태 업데이트
        setUserId(safeId);
        setUserName(safeName);
        setAvailablePoints(safePoints);

        // LocalStorage에 캐시
        localStorage.setItem("userName", safeName);
        cachePoints(safePoints);
      } catch (err) {
        console.warn("API 호출 실패. 캐시 데이터 사용:", err);
        setError("사용자 정보를 불러오는 중 문제가 발생했습니다.");

        // 캐시에서 이름 읽기
        const cachedName = localStorage.getItem("userName");
        if (cachedName) setUserName(cachedName);

        // 캐시된 포인트 읽기
        setAvailablePoints(getAvailablePoints());
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // 이름 업데이트 (LocalStorage도 업데이트)
  const updateUserName = (name: string) => {
    setUserName(name);
    if (typeof window !== "undefined") {
      localStorage.setItem("userName", name);
    }
  };

  return {
    userId,
    userName,
    availablePoints,
    isLoading,
    error,
    updateUserName,
  };
}
