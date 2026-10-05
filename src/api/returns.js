import { apiClient } from "./client";
export const listReturns = (query) => apiClient.get("/returns", query);
export const getReturn = (id) => apiClient.get(`/returns/${id}`);
export const createReturnDraft = (payload) => apiClient.post("/returns", payload);
export const issueReturn = (id) => apiClient.post(`/returns/${id}/issue`);
