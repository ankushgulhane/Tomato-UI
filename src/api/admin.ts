import { api } from './client';
import type { RegisterUserRequest, UserResponse } from '../types/dto';

export const createUser = (body: RegisterUserRequest) =>
  api.post<UserResponse>('/api/admin/users', body).then((r) => r.data);
