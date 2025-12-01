import { post } from "./http";

export async function register({ username, password, nickname }) {
  return post("/auth/register", { body: { username, password, nickname } });
}

export async function login({ username, password }) {
  const data = await post("/auth/login", { body: { username, password } });
  // 응답에 access_token 있다고 가정
  if (data?.access_token) {
    localStorage.setItem("access_token", data.access_token);
  }
  return data;
}

export function logout() {
  localStorage.removeItem("access_token");
}
