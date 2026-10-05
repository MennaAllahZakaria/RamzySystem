import { apiClient } from "./client";
export const listInvoices = (query) => apiClient.get("/invoices", query);
export const getInvoice = (id) => apiClient.get(`/invoices/${id}`);
export const createInvoiceDraft = (payload) => apiClient.post("/invoices", payload);
export const issueInvoice = (id) => apiClient.post(`/invoices/${id}/issue`);
export const cancelInvoice = (id) => apiClient.post(`/invoices/${id}/cancel`);
