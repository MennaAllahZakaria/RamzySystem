import { apiClient } from "./client";
export const listSuppliers = (query) => apiClient.get("/suppliers", query);
export const getSupplier = (id) => apiClient.get(`/suppliers/${id}`);
export const createSupplier = (payload) => apiClient.post("/suppliers", payload);
export const updateSupplier = (id, payload) => apiClient.patch(`/suppliers/${id}`, payload);
export const deleteSupplier = (id) => apiClient.delete(`/suppliers/${id}`);
