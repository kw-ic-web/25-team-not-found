import { get } from "./http";

export async function getDashboard() {
  // { success, data: { recent_textbooks: [...], ongoing_sessions: [...] } }
  return get("/dashboard");
}
