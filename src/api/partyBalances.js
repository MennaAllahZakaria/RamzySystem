import { apiClient } from "./client";
export const getCustomerBalances = (query) => apiClient.get("/party-balances/customers", query);
export const getSupplierBalances = (query) => apiClient.get("/party-balances/suppliers", query);
export const exportCustomerBalances = (query) => apiClient.download("/party-balances/customers/export", query);
export const exportSupplierBalances = (query) => apiClient.download("/party-balances/suppliers/export", query);
export const getCustomerStatement = (id, query) => apiClient.get(`/party-balances/customers/${id}/statement`, query);
export const getSupplierStatement = (id, query) => apiClient.get(`/party-balances/suppliers/${id}/statement`, query);
export const exportPartyStatement = (role, id, query) => apiClient.download(`/party-balances/${role}/${id}/statement/export`, query);
export const getPartyBalance = (id, query) => apiClient.get(`/party-balances/${id}`, query);
