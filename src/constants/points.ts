// 보유 포인트 상수 (실제로는 API에서 가져올 값)
// localStorage에서 읽어오거나, API에서 가져온 후 여기에 저장
export const getAvailablePoints = (): number => { // 현재 보유 포인트를 조회하는 함수입니다.
  if (typeof window !== "undefined") { // 브라우저 환경에서만 localStorage에 접근하도록 안전장치를 둡니다.
    const stored = localStorage.getItem("availablePoints"); // 저장된 포인트 값을 문자열로 불러옵니다.
    if (stored) { // 값이 존재하면
      return parseInt(stored, 10); // 문자열을 10진수 숫자로 변환하여 반환합니다.
    }
  }
  return 5000; // 기본값
};

export const setAvailablePoints = (points: number): void => { // 현재 보유 포인트를 저장하는 함수입니다.
  if (typeof window !== "undefined") { // 브라우저 환경인지 확인합니다.
    localStorage.setItem("availablePoints", points.toString()); // 포인트 값을 문자열로 변환하여 localStorage에 저장합니다.
  }
};

// 기본 보유 포인트 (초기값)
export const DEFAULT_POINTS = 5000;



