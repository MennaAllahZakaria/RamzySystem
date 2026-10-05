import { apiClient } from "./client";
export const getDueInvoiceAlerts = (query) => apiClient.get("/alerts/due-invoices", query);
