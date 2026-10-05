import { apiClient, setAuthToken } from "./client";
export async function login(credentials) { const result = await apiClient.post("/auth/login", credentials); setAuthToken(result.token || result.data?.token); return result; }
export const getMe = () => apiClient.get("/auth/me");
export const updateMe = (payload) => apiClient.patch("/auth/me", payload);
export const changePassword = (payload) => apiClient.patch("/auth/me/password", payload);
export const listUsers = () => apiClient.get("/auth/users");
export const createUser = (payload) => apiClient.post("/auth/users", payload);
export const updateUser = (id, payload) => apiClient.patch(`/auth/users/${id}`, payload);
export const deactivateUser = (id) => apiClient.delete(`/auth/users/${id}`);
export function logout() { setAuthToken(null); }
