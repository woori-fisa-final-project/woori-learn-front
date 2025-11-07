import { useState, useEffect } from "react";
import { getAvailablePoints } from "@/constants/points";

export function useUserData() {
  const [userName, setUserName] = useState("아무개");
  const [availablePoints, setAvailablePoints] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return; // ✅ SSR 환경 안전 처리

    const savedName = localStorage.getItem("userName");
    if (savedName) {
      setUserName(savedName);
    }

    const points = getAvailablePoints();
    setAvailablePoints(points);
  }, []);

  // 이름 변경이 필요한 경우 사용할 수 있도록 setter도 함께 반환
  const updateUserName = (name: string) => {
    setUserName(name);
    if (typeof window !== "undefined") {
      localStorage.setItem("userName", name);
    }
  };

  return { userName, availablePoints, updateUserName };
}

