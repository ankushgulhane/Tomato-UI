import { useMutation, useQuery } from '@tanstack/react-query';
import { login as loginApi, register as registerApi } from '../api/auth';
import { getUser } from '../api/users';
import { useAuthContext } from '../context/AuthContext';
import type { LoginRequest, RegisterUserRequest } from '../types/dto';

export function useAuth() {
  const auth = useAuthContext();

  const loginMutation = useMutation({
    mutationFn: (body: LoginRequest) => loginApi(body),
    onSuccess: (data) => auth.login(data.token),
  });

  const registerMutation = useMutation({
    mutationFn: (body: RegisterUserRequest) => registerApi(body),
    onSuccess: (data) => auth.login(data.token),
  });

  return { ...auth, loginMutation, registerMutation };
}

export function useCurrentUser() {
  const { userId } = useAuthContext();
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUser(userId as number),
    enabled: userId !== null,
  });
}
