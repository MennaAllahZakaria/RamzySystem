import { apiClient } from "./client";
export const getDueInvoiceAlerts = (query) => apiClient.get("/alerts/due-invoices", query);
export const getFollowUpAlerts = (query) => apiClient.get("/alerts/follow-up", query);
