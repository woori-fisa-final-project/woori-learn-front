import { useState, useEffect } from "react";
import { getCurrentUser } from "@/lib/api/user.api";
import { getAvailablePoints, setAvailablePoints as cachePoints } from "@/constants/points";

/**
 * 사용자 데이터를 관리하는 커스텀 훅
 * 
 * API 우선으로 동작하며 localStorage는 캐시/폴백용으로만 사용:
 * 1. API에서 최신 데이터 가져오기 시도
 * 2. 성공 시 localStorage에 캐시
 * 3. 실패 시 localStorage 캐시 데이터 사용 (폴백)
 */
export function useUserData() {
  const [userName, setUserName] = useState("아무개");
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

        // 필드 스키마(name/points vs nickname/point) 차이를 흡수해서 안전하게 설정
        const safeName =
          data.name ?? (data as { nickname?: string }).nickname ?? "고객님";
        const pointsRaw =
          data.points ?? (data as { point?: number }).point;
        const safePoints =
          typeof pointsRaw === "number" ? pointsRaw : 0;

        setUserName(safeName);
        setAvailablePoints(safePoints);

        // 캐시 저장
        localStorage.setItem("userName", safeName);
        cachePoints(safePoints);

      } catch (err) {
        console.warn("API 호출 실패, 캐시 데이터 사용:", err);
        setError("사용자 정보를 불러오는 중 문제가 발생했습니다.");

        const cachedName = localStorage.getItem("userName");
        const cachedPoints = getAvailablePoints();

        if (cachedName) setUserName(cachedName);
        setAvailablePoints(cachedPoints);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const updateUserName = (name: string) => {
    setUserName(name);
    if (typeof window !== "undefined") {
      localStorage.setItem("userName", name);
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
