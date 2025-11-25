import axiosInstance from "@/utils/axiosInstance";

export async function changePassword(currPw: string, newPw: string) {
  try {
    const response = await axiosInstance.put("/auth/password", {
      currentPassword: currPw,
      newPassword: newPw,
    });

    return response.data.data;
  } catch (error) {
    console.error("비밀번호 변경 중 오류 발생:", error);
    throw error;
  }
}