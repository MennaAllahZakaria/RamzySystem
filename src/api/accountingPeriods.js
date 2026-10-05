import { apiClient } from "./client";
export const listAccountingPeriods = (query) => apiClient.get("/accounting-periods", query);
export const createAccountingPeriod = (payload) => apiClient.post("/accounting-periods", payload);
export const closeAccountingPeriod = (id) => apiClient.post(`/accounting-periods/${id}/close`);
export const lockAccountingPeriod = (id) => apiClient.post(`/accounting-periods/${id}/lock`);
