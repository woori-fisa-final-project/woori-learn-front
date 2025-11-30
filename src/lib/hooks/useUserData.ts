import { useState, useEffect } from "react";
import { getCurrentUser } from "@/lib/api/user.api";
import { useUserStore } from "@/lib/stores/userStore";

export function useUserData() {
  const [userId, setUserId] = useState<number | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [userName, setUserName] = useState("고객님");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { availablePoints, setAvailablePoints } = useUserStore();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await getCurrentUser();

        const safeId = data.id ?? null;
        const safeName = data.name ?? (data as { nickname?: string }).nickname ?? "고객님";

        const pointsRaw = data.points ?? (data as { point?: number }).point;
        const safePoints = typeof pointsRaw === "number" ? pointsRaw : 0;
        const safeAccount = (data as { account?: string | null }).account ?? null;

        setUserId(safeId);
        setUserName(safeName);
        setAvailablePoints(safePoints);
        setAccount(safeAccount);

        localStorage.setItem("userId", String(safeId));
        localStorage.setItem("userName", safeName);
        if (safeAccount) localStorage.setItem("account", safeAccount);

      } catch (err) {
        console.warn("API 호출 실패. 캐시 데이터 사용:", err);
        setError("사용자 정보를 불러오는 중 문제가 발생했습니다.");

        const cachedId = Number(localStorage.getItem("userId"));
        if (!isNaN(cachedId)) setUserId(cachedId);

        const cachedName = localStorage.getItem("userName");
        if (cachedName) setUserName(cachedName);

        setAvailablePoints(0);
        const cachedAccount = localStorage.getItem("account");
        if (cachedAccount) setAccount(cachedAccount);
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
    userId,
    userName,
    account,
    availablePoints,
    isLoading,
    error,
    updateUserName,
  };
}
