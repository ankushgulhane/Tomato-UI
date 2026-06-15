import { api } from './client';
import type { AuthResponse, LoginRequest, RegisterUserRequest } from '../types/dto';

export const login = (body: LoginRequest) => api.post<AuthResponse>('/api/auth/login', body).then((r) => r.data);

export const register = (body: RegisterUserRequest) =>
  api.post<AuthResponse>('/api/auth/register', body).then((r) => r.data);
