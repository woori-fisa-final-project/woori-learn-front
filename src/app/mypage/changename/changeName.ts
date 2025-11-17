import { ApiError } from "@/utils/apiError";
import axiosInstance from "@/utils/axiosInstance";

export async function changeName(newName: string) {
  try {
    const response = await axiosInstance.put("/users/nickname", {
      nickname: newName,
    });

    return response.data.data; // axios는 이미 JSON 파싱 완료
  } catch (error) {
    if (error instanceof ApiError) {
      throw error; // 이미 ApiError로 변환됨
    }
    throw new ApiError(-1, "닉네임 변경 중 알 수 없는 오류가 발생했습니다.");
  }
}