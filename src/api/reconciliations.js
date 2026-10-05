import { apiClient } from "./client";
export const previewReconciliation = (query) => apiClient.get("/reconciliations/preview", query);
export const listReconciliations = (query) => apiClient.get("/reconciliations", query);
export const createReconciliation = (payload) => apiClient.post("/reconciliations", payload);
export const approveReconciliation = (id) => apiClient.post(`/reconciliations/${id}/approve`);
