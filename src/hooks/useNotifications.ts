import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { markNotificationRead } from '../api/notifications';
import { getUserNotifications } from '../api/users';

export function useNotifications(userId: number | undefined) {
  return useQuery({
    queryKey: ['notifications', userId],
    queryFn: () => getUserNotifications(userId as number),
    enabled: userId !== undefined,
    refetchInterval: 30_000,
  });
}

export function useUnreadNotificationCount(userId: number | undefined) {
  const { data } = useNotifications(userId);
  return data?.filter((n) => !n.read).length ?? 0;
}

export function useMarkNotificationRead(userId: number | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (notificationId: number) => markNotificationRead(notificationId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications', userId] }),
  });
}
