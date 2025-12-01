const BASE_URL = import.meta.env.VITE_API_URL;

function token() { return localStorage.getItem("access_token"); }

export async function http(method, path, { params, body } = {}) {
  let url = BASE_URL + path;
  if (params) {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k,v]) => (v!==undefined && v!=="") && qs.set(k, v));
    const s = qs.toString(); if (s) url += `?${s}`;
  }
  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token() ? { Authorization: `Bearer ${token()}` } : {})
    },
    body: ["POST","PUT","PATCH"].includes(method) ? JSON.stringify(body||{}) : undefined
  });
  if (res.status === 204) return null;
  const data = await res.json().catch(()=> ({}));
  if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);
  return data;
}

export const get = (p, o) => http("GET", p, o);
export const post = (p, o) => http("POST", p, o);
