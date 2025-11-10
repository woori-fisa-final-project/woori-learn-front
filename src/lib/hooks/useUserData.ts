import { useState, useEffect } from "react"; // 사용자 이름과 포인트 정보를 상태로 관리하기 위해 React 훅을 사용합니다.
import { getAvailablePoints } from "@/constants/points"; // 기본 포인트 값을 계산하기 위해 포인트 유틸 함수를 불러옵니다.

export function useUserData() { // 사용자 이름과 보유 포인트를 제공하는 커스텀 훅입니다.
  const [userName, setUserName] = useState("아무개"); // 사용자 이름을 상태로 관리하며 기본값을 설정합니다.
  const [availablePoints, setAvailablePoints] = useState(0); // 보유 포인트를 상태로 관리합니다.

  useEffect(() => { // 컴포넌트 마운트 시 로컬 저장소에서 사용자 데이터를 불러옵니다.
    if (typeof window === "undefined") return; // ✅ SSR 환경 안전 처리

    const savedName = localStorage.getItem("userName"); // 저장된 사용자 이름이 있는지 확인합니다.
    if (savedName) {
      setUserName(savedName);
    }

    const points = getAvailablePoints(); // 포인트 유틸을 통해 기본 포인트를 계산합니다.
    setAvailablePoints(points); // 계산된 포인트를 상태에 반영합니다.
  }, []);

  // 이름 변경이 필요한 경우 사용할 수 있도록 setter도 함께 반환
  const updateUserName = (name: string) => { // 사용자 이름을 변경할 때 호출하는 함수입니다.
    setUserName(name); // 상태에 즉시 반영하여 UI를 업데이트합니다.
    if (typeof window !== "undefined") {
      localStorage.setItem("userName", name); // 브라우저 환경일 때만 로컬 스토리지에 이름을 저장합니다.
    }
  };

  return { userName, availablePoints, updateUserName }; // 컴포넌트에서 이름, 포인트, 이름 업데이트 함수를 사용할 수 있도록 반환합니다.
}

