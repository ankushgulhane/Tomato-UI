import { api } from './client';

export const markNotificationRead = (notificationId: number) =>
  api.put<void>(`/api/notifications/${notificationId}/read`).then((r) => r.data);
