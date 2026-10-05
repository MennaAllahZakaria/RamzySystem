import { apiClient } from "./client";
export const listEmployees = (query) => apiClient.get("/employees", query);
export const getEmployee = (id) => apiClient.get(`/employees/${id}`);
export const createEmployee = (payload) => apiClient.post("/employees", payload);
export const updateEmployee = (id, payload) => apiClient.patch(`/employees/${id}`, payload);
export const deactivateEmployee = (id) => apiClient.delete(`/employees/${id}`);
