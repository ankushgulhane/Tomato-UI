import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { cancelOrder, createOrder, getOrder } from '../api/orders';
import { processPayment } from '../api/payments';
import { acceptOrder, getRestaurantOrders, rejectOrder, updateOrderStatus } from '../api/restaurantOrders';
import { getUserOrders } from '../api/users';
import { TERMINAL_STATUSES } from '../lib/orderStatus';
import type { CreateOrderRequest, OrderResponse, OrderStatus, PaymentRequest, OrderStatusUpdateRequest } from '../types/dto';

export function useOrder(orderId: number | undefined, options?: { poll?: boolean }) {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: () => getOrder(orderId as number),
    enabled: orderId !== undefined,
    refetchInterval: (query) => {
      if (!options?.poll) return false;
      const status = (query.state.data as OrderResponse | undefined)?.status;
      return status && !TERMINAL_STATUSES.has(status) ? 15_000 : false;
    },
  });
}

export function useUserOrders(userId: number | undefined) {
  return useQuery({
    queryKey: ['orders', userId],
    queryFn: () => getUserOrders(userId as number),
    enabled: userId !== undefined,
  });
}

export function useCreateOrder() {
  return useMutation({
    mutationFn: (body: CreateOrderRequest) => createOrder(body),
  });
}

export function useCancelOrder(orderId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => cancelOrder(orderId),
    onSuccess: (data) => {
      queryClient.setQueryData(['order', orderId], data);
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export function useProcessPayment(orderId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: PaymentRequest) => processPayment(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', orderId] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

// --- Restaurant-side order management ---

export function useRestaurantOrders(restaurantId: number | undefined, status?: OrderStatus) {
  return useQuery({
    queryKey: ['restaurantOrders', restaurantId, status],
    queryFn: () => getRestaurantOrders(restaurantId as number, status),
    enabled: restaurantId !== undefined,
    refetchInterval: 15_000,
  });
}

export function useAcceptRestaurantOrder(restaurantId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderId: number) => acceptOrder(restaurantId, orderId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['restaurantOrders', restaurantId] }),
  });
}

export function useRejectRestaurantOrder(restaurantId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderId: number) => rejectOrder(restaurantId, orderId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['restaurantOrders', restaurantId] }),
  });
}

export function useUpdateRestaurantOrderStatus(restaurantId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, body }: { orderId: number; body: OrderStatusUpdateRequest }) =>
      updateOrderStatus(restaurantId, orderId, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['restaurantOrders', restaurantId] }),
  });
}
