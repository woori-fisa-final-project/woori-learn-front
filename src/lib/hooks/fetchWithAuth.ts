export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  // 저장된 access token / refresh token 가져오기
  let accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  // access token이 존재하지 않을 경우 로그인 페이지로 넘어가기
  if (!accessToken) {
    window.location.href = "/login";
    return new Response(null, { status: 401 });
  }

  // 헤더 세팅
  const fetchOptions: RequestInit = {
    ...options,
    headers: {
      ...options.headers,
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: "same-origin"
  };

  // 요청 보내기
  let response = await fetch(url, fetchOptions);

  // access token 만료로 401/403 발생 시
  if (response.status === 401 || response.status === 403) {
    // refresh token 없으면 로그인 페이지로 이동
    if (!refreshToken) {
      window.location.href = "/login";
      return new Response(null, { status: 401 });
    }

    // refresh token으로 access token 갱신
    const refreshResponse = await fetch("http://localhost:8080/auth/refresh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    // refresh token 만료 -> 로그인 페이지
    if (refreshResponse.status === 401 || refreshResponse.status === 403) {
      window.location.href = "/login";
      return new Response(null, { status: 401 });
    }

    type refreshData = {
        accessToken: string,
        refreshToken: string
    };
    const refreshData : refreshData = await refreshResponse.json();

    accessToken = refreshData.accessToken;
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    // 갱신된 access token으로 다시 요청
    fetchOptions.headers = {
      ...fetchOptions.headers,
      Authorization: `Bearer ${accessToken}`,
    };

    response = await fetch(url, fetchOptions);
  }

  return response;
}