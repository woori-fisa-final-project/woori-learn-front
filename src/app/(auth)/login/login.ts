import { ApiError } from "@/utils/apiError";
import axiosInstance from "@/utils/axiosInstance";
import { useAuthStore } from "@/utils/tokenStorage";

interface LoginResponse {
  data: {
    accessToken: string;
  };
}

export async function loginUser(id: string, password: string): Promise<LoginResponse> {
  if (!id.trim() || !password.trim()) {
    throw new ApiError(400, "아이디와 비밀번호를 입력해주세요.");
  }
  
  try {
    const response = await axiosInstance.post(
      "/auth/login", {
        userId: id,
        password,
      },{
      skipAuth: true
    });

    const { accessToken } = response.data.data;

    // 브라우저 저장
    const { setAccessToken } = useAuthStore.getState();
    setAccessToken(accessToken);

    return response.data;
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(-1, "로그인 요청 중 알 수 없는 오류가 발생했습니다.");
  }
}