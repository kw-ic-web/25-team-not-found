import { get } from "./http";
export const getTextbookStudents = (textbookId, params) =>
  get(`/teacher/${textbookId}/students`, { params });
