export async function loginUser(id: string, password: string) {
  const response = await fetch("http://localhost:8080/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId: id, password }),
  });

  if (!response.ok) {
    throw new Error("로그인 실패");
  }

  const data = await response.json();
  const accessToken = data.data.accessToken;   // 서버에서 주는 access token
  const refreshToken = data.data.refreshToken; // 서버에서 주는 refresh token

  // 브라우저에 저장 (보통 localStorage 또는 sessionStorage)
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);

  return data;
}