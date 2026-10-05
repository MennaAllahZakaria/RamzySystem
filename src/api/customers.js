import { apiClient } from "./client";
export const listCustomers = (query) => apiClient.get("/customers", query);
export const getCustomer = (id) => apiClient.get(`/customers/${id}`);
export const createCustomer = (payload) => apiClient.post("/customers", payload);
export const updateCustomer = (id, payload) => apiClient.patch(`/customers/${id}`, payload);
export const deleteCustomer = (id) => apiClient.delete(`/customers/${id}`);
