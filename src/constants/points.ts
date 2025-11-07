// 보유 포인트 상수 (실제로는 API에서 가져올 값)
// localStorage에서 읽어오거나, API에서 가져온 후 여기에 저장
export const getAvailablePoints = (): number => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("availablePoints");
    if (stored) {
      return parseInt(stored, 10);
    }
  }
  return 5000; // 기본값
};

export const setAvailablePoints = (points: number): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("availablePoints", points.toString());
  }
};

// 기본 보유 포인트 (초기값)
export const DEFAULT_POINTS = 5000;



