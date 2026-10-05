import { apiClient } from "./client";
export const listAuditLogs = (query) => apiClient.get("/audit-logs", query);
