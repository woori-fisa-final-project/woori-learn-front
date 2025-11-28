import { create } from "zustand";
import { getAvailablePoints } from "@/constants/points";

interface UserState {
  availablePoints: number;
  setAvailablePoints: (points: number) => void;
}

export const useUserStore = create<UserState>((set) => ({
  availablePoints: getAvailablePoints(),
  setAvailablePoints: (points) => set({ availablePoints: points }),
}));

