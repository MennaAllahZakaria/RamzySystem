import { apiClient } from "./client";
export const listAccounts = (query) => apiClient.get("/accounting/accounts", query);
export const createAccount = (payload) => apiClient.post("/accounting/accounts", payload);
export const updateAccount = (id, payload) => apiClient.patch(`/accounting/accounts/${id}`, payload);
export const seedDefaultAccounts = () => apiClient.post("/accounting/accounts/seed-defaults");
export const listJournalEntries = (query) => apiClient.get("/accounting/journal-entries", query);
export const createJournalEntry = (payload) => apiClient.post("/accounting/journal-entries", payload);
