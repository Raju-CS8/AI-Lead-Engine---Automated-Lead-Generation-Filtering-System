import axios, { AxiosError } from 'axios';
import type { ApiResponse, Lead, LeadSearchParams } from '../types/index';

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

if (!BASE_URL) {
  throw new Error('[API] VITE_API_BASE_URL not set.');
}

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 120000,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.response.use(
  (r) => r,
  (error: AxiosError<{ error?: string }>) =>
    Promise.reject(new Error(error.response?.data?.error ?? error.message ?? 'Unexpected error'))
);

export async function generateLeads(params: LeadSearchParams): Promise<ApiResponse<Lead[]>> {
  const response = await apiClient.post('/leads', params);
  const raw = response.data;

  // Handle double-wrapped response: {success, data: {success, meta, data}}
  if (raw?.data?.data && Array.isArray(raw.data.data)) {
    return raw.data as ApiResponse<Lead[]>;
  }

  // Handle single-wrapped response: {success, meta, data}
  if (raw?.data && Array.isArray(raw.data)) {
    return raw as ApiResponse<Lead[]>;
  }

  return raw;
}

export async function fetchIndustries(): Promise<string[]> {
  const { data } = await apiClient.get<{ success: boolean; data: string[] }>('/industries');
  return data.data;
}