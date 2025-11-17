import axiosInstance from "@/utils/axiosInstance";

interface LoginResponse {
  data: {
    accessToken: string;
    refreshToken: string;
  };
}

export async function loginUser(id: string, password: string): Promise<LoginResponse> {
  try {
    const response = await axiosInstance.post("/auth/login", {
      userId: id,
      password,
    },{
      skipAuth: true
    });

    const { accessToken, refreshToken } = response.data.data;

    // 브라우저 저장
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    return response.data;
  } catch (error: any) {
    console.error("로그인 요청 오류", error);
    throw new Error("로그인 실패");
  }
}