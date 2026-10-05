import { apiClient } from "./client";
export const listPayments = (query) => apiClient.get("/payments", query);
export const createPayment = (payload) => apiClient.post("/payments", payload);
