import { apiClient } from "./client";
export const listWarehouses = () => apiClient.get("/warehouses");
export const createWarehouse = (payload) => apiClient.post("/warehouses", payload);
export const transferStock = (payload) => apiClient.post("/warehouses/transfers", payload);
export const createStockCount = (payload) => apiClient.post("/warehouses/counts", payload);
export const approveStockCount = (id) => apiClient.post(`/warehouses/counts/${id}/approve`);
export const getStockAlerts = (query) => apiClient.get("/warehouses/alerts", query);
