import { apiClient } from "./client";
export const listCategories = (query) => apiClient.get("/categories", query);
export const getCategory = (id) => apiClient.get(`/categories/${id}`);
export const createCategory = (payload) => apiClient.post("/categories", payload);
export const updateCategory = (id, payload) => apiClient.patch(`/categories/${id}`, payload);
export const deleteCategory = (id) => apiClient.delete(`/categories/${id}`);
