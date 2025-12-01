// src/services/auth.api.js

// Vite 환경변수 사용
const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://223.194.46.67:21090";

async function handleResponse(res) {
  let data = null;
  try {
    data = await res.json();
  } catch (e) {
    // body 없는 204 같은 응답 대비
  }

  if (!res.ok) {
    const error = new Error((data && data.message) || "요청 중 오류가 발생했습니다.");
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}

// 회원가입: POST /auth/register
export async function registerUser({ username, password, nickname }) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
      nickname,
    }),
    credentials: "include", // 쿠키 쓸 일 있으면 유지, 아니면 빼도 됨
  });

  return handleResponse(res);
}

// 로그인: POST /auth/login (나중에 Login.jsx에서 사용)
export async function loginUser({ username, password }) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
    
  });

  const data = await handleResponse(res);

  // 토큰 저장 (필요 없으면 지워도 됨)
  if (data.access_token) {
    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("token_type", data.token_type || "Bearer");
    localStorage.setItem("user", JSON.stringify(data.user));
  }

  return data;
}

// 아이디 중복체크: POST /auth/check-username
export async function checkUsernameAvailable(username) {
  const res = await fetch(`${BASE_URL}/auth/check-username`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username }),
    credentials: "include",
  });

  return handleResponse(res); // { available: true/false }
}
