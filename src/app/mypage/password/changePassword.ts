import { ApiError } from "@/utils/apiError";
import axiosInstance from "@/utils/axiosInstance";

export async function changePassword(currPw: string, newPw: string) {
  try {
    const response = await axiosInstance.put("/auth/password", {
      currentPassword: currPw,
      newPassword: newPw,
    });

    return response.data.data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(-1, "비밀번호 변경 중 알 수 없는 오류가 발생했습니다.");
  }
}