import { useMutation } from '@tanstack/react-query';
import { createUser } from '../api/admin';
import type { RegisterUserRequest } from '../types/dto';

export function useCreateUser() {
  return useMutation({
    mutationFn: (body: RegisterUserRequest) => createUser(body),
  });
}
