import { apiClient } from "./client";
export const listWorkers = (query) => apiClient.get("/workers", query);
export const getWorker = (id) => apiClient.get(`/workers/${id}`);
export const createWorker = (payload) => apiClient.post("/workers", payload);
export const updateWorker = (id, payload) => apiClient.patch(`/workers/${id}`, payload);
export const deactivateWorker = (id) => apiClient.delete(`/workers/${id}`);
