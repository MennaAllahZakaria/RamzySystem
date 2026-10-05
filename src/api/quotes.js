import { apiClient } from "./client";
export const listQuotes = (query) => apiClient.get("/quotes", query);
export const getQuote = (id) => apiClient.get(`/quotes/${id}`);
export const createQuote = (payload) => apiClient.post("/quotes", payload);
export const updateQuote = (id, payload) => apiClient.patch(`/quotes/${id}`, payload);
export const cancelQuote = (id) => apiClient.delete(`/quotes/${id}`);
export const getQuotePdf = (id) => apiClient.download(`/quotes/${id}/pdf`);
