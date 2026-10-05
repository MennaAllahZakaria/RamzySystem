import { apiClient } from "./client";
export const listProducts = (query) => apiClient.get("/products", query);
export const getProduct = (id) => apiClient.get(`/products/${id}`);
export const getProductBySerial = (serialNumber) => apiClient.get(`/products/serial/${encodeURIComponent(serialNumber)}`);
export const createProduct = (payload) => apiClient.post("/products", payload);
export const updateProduct = (id, payload) => apiClient.patch(`/products/${id}`, payload);
export const deleteProduct = (id) => apiClient.delete(`/products/${id}`);
