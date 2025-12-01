// src/services/teacher.api.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function getAccessToken() {
  try {
    const stored = localStorage.getItem("auth");
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.access_token || parsed.token || null;
    }
  } catch (e) {
    // ignore
  }
  return localStorage.getItem("access_token");
}

/**
 * GET /teacher/:textbookId/students
 * 쿼리:
 *  - version (integer)
 *  - q (string)
 *  - sort (recent | progress | name 등)
 *  - order (asc | desc)
 *  - limit, offset
 */
export async function fetchTeacherStudents({
  textbookId,
  version = 1,
  q = "",
  sort = "recent",
  order = "desc",
  limit = 50,
  offset = 0,
} = {}) {
  if (!API_BASE_URL) {
    throw new Error("VITE_API_BASE_URL이 설정되지 않았습니다.");
  }

  if (!textbookId) {
    throw new Error("textbookId가 필요합니다.");
  }

  const token = getAccessToken();
  if (!token) {
    throw new Error("로그인 토큰이 없습니다.");
  }

  const params = new URLSearchParams();
  params.set("version", String(version));
  if (q) params.set("q", q);
  if (sort) params.set("sort", sort);
  if (order) params.set("order", order);
  params.set("limit", String(limit));
  params.set("offset", String(offset));

  const res = await fetch(
    `${API_BASE_URL}/teacher/${encodeURIComponent(textbookId)}/students?${params.toString()}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    let msg = "학생 목록 조회에 실패했습니다.";
    try {
      const body = await res.json();
      if (body && body.message) msg = body.message;
    } catch {
      // ignore
    }
    throw new Error(msg);
  }

  const data = await res.json();
  return data.students ?? [];
}
