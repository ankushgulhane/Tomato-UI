import { api } from './client';
import type { NotificationResponse, OrderResponse, UserResponse } from '../types/dto';

export const getUser = (userId: number) => api.get<UserResponse>(`/api/users/${userId}`).then((r) => r.data);

export const getUserOrders = (userId: number) =>
  api.get<OrderResponse[]>(`/api/users/${userId}/orders`).then((r) => r.data);

export const getUserNotifications = (userId: number) =>
  api.get<NotificationResponse[]>(`/api/users/${userId}/notifications`).then((r) => r.data);
