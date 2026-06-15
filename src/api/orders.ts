import { api } from './client';
import type { CreateOrderRequest, CreateOrderResponse, OrderResponse } from '../types/dto';

export const createOrder = (body: CreateOrderRequest) =>
  api.post<CreateOrderResponse>('/api/orders', body).then((r) => r.data);

export const getOrder = (orderId: number) => api.get<OrderResponse>(`/api/orders/${orderId}`).then((r) => r.data);

export const cancelOrder = (orderId: number) =>
  api.put<OrderResponse>(`/api/orders/${orderId}/cancel`).then((r) => r.data);
