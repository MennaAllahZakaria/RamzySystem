import { apiClient } from "./client";
export const getDailyCashFlow = (query) => apiClient.get("/cash-flow/daily", query);
