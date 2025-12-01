import { get, post } from "./http";
export const getMyTextbooks = () => get("/textbooks/mine");
export const createTextbook = ({ title }) => post("/textbooks", { body: { title }});
