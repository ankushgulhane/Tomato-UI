import { api } from './client';
import type { AvailableOrderResponse, OrderResponse } from '../types/dto';

export const getAvailableOrders = () =>
  api.get<AvailableOrderResponse[]>('/api/delivery/orders/available').then((r) => r.data);

export const acceptDeliveryOrder = (orderId: number) =>
  api.put<OrderResponse>(`/api/delivery/orders/${orderId}/accept`).then((r) => r.data);

export const declineDeliveryOrder = (orderId: number) =>
  api.put<void>(`/api/delivery/orders/${orderId}/decline`).then((r) => r.data);

export const confirmPickup = (orderId: number) =>
  api.put<OrderResponse>(`/api/delivery/orders/${orderId}/pickup`).then((r) => r.data);

export const confirmDelivery = (orderId: number) =>
  api.put<OrderResponse>(`/api/delivery/orders/${orderId}/deliver`).then((r) => r.data);
