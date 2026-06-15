import axios from 'axios';
import type { ErrorResponse } from '../types/dto';

export interface ApiError {
  status: number;
  message: string;
  details: string[] | null;
}

let authToken: string | null = null;
let unauthorizedHandler: (() => void) | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

export function setUnauthorizedHandler(handler: (() => void) | null) {
  unauthorizedHandler = handler;
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
});

api.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      unauthorizedHandler?.();
    }

    const data = error.response?.data as ErrorResponse | undefined;
    const apiError: ApiError = {
      status: error.response?.status ?? 0,
      message: data?.message ?? error.message ?? 'Something went wrong',
      details: data?.details ?? null,
    };

    return Promise.reject(apiError);
  }
);
