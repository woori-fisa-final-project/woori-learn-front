import { useState, useEffect } from "react"; // 사용자 이름과 포인트 정보를 상태로 관리하기 위해 React 훅을 사용합니다.
import axiosInstance from "@/utils/axiosInstance";
import { ApiError } from "@/utils/apiError";

export function useUserData() { // 사용자 이름과 보유 포인트를 제공하는 커스텀 훅입니다.
  const [userName, setUserName] = useState("아무개"); // 사용자 이름을 상태로 관리하며 기본값을 설정합니다.
  const [availablePoints, setAvailablePoints] = useState(0); // 보유 포인트를 상태로 관리합니다.

  useEffect(() => { // 컴포넌트 마운트 시 로컬 저장소에서 사용자 데이터를 불러옵니다.
    if (typeof window === "undefined") return; // ✅ SSR 환경 안전 처리

    async function loadUserData() {
      try{
        const response = await axiosInstance.get("/users/me");
        const data = response.data.data;

        setUserName(data.nickname);
        setAvailablePoints(data.point);
      }catch(error){
        if (error instanceof ApiError) {
          console.error("사용자 정보를 불러오는 중 오류:", error.message);
        } else {
          console.error("알 수 없는 오류 발생:", error);
        }
      }
    }

    loadUserData();
  }, []);

  return { userName, availablePoints}; // 컴포넌트에서 이름, 포인트, 이름 업데이트 함수를 사용할 수 있도록 반환합니다.
}

