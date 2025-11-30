import { create } from "zustand";

interface UserState {
  availablePoints: number;
  setAvailablePoints: (points: number) => void;
}

export const useUserStore = create<UserState>((set) => ({
  // 포인트는 항상 서버 응답을 신뢰한다. 초기값은 0으로 두고 서버 값으로 덮어쓴다.
  availablePoints: 0,
  setAvailablePoints: (points) => set({ availablePoints: points }),
}));

