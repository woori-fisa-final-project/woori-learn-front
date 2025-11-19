import { ApiError } from "@/utils/apiError";
import axiosInstance from "@/utils/axiosInstance";

export async function changeName(newName: string) {
  try {
    const response = await axiosInstance.put("/users/nickname", {
      nickname: newName,
    });

    return response.data.data; // axios는 이미 JSON 파싱 완료
  } catch (error) {
    console.error("닉네임 변경 중 오류 발생:", error);
    throw error;
  }
}