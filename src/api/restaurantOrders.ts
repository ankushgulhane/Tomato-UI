import { api } from './client';
import type { OrderResponse, OrderStatus, OrderStatusUpdateRequest } from '../types/dto';

export const getRestaurantOrders = (restaurantId: number, status?: OrderStatus) =>
  api
    .get<OrderResponse[]>(`/api/restaurants/${restaurantId}/orders`, { params: status ? { status } : undefined })
    .then((r) => r.data);

export const acceptOrder = (restaurantId: number, orderId: number) =>
  api.put<OrderResponse>(`/api/restaurants/${restaurantId}/orders/${orderId}/accept`).then((r) => r.data);

export const rejectOrder = (restaurantId: number, orderId: number) =>
  api.put<OrderResponse>(`/api/restaurants/${restaurantId}/orders/${orderId}/reject`).then((r) => r.data);

export const updateOrderStatus = (restaurantId: number, orderId: number, body: OrderStatusUpdateRequest) =>
  api.put<OrderResponse>(`/api/restaurants/${restaurantId}/orders/${orderId}/status`, body).then((r) => r.data);
