import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  acceptDeliveryOrder,
  confirmDelivery,
  confirmPickup,
  declineDeliveryOrder,
  getAvailableOrders,
} from '../api/delivery';

export function useAvailableOrders() {
  return useQuery({
    queryKey: ['deliveryAvailable'],
    queryFn: getAvailableOrders,
    refetchInterval: 15_000,
  });
}

export function useAcceptDeliveryOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderId: number) => acceptDeliveryOrder(orderId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['deliveryAvailable'] }),
  });
}

export function useDeclineDeliveryOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderId: number) => declineDeliveryOrder(orderId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['deliveryAvailable'] }),
  });
}

export function useConfirmPickup(orderId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => confirmPickup(orderId),
    onSuccess: (data) => queryClient.setQueryData(['order', orderId], data),
  });
}

export function useConfirmDelivery(orderId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => confirmDelivery(orderId),
    onSuccess: (data) => queryClient.setQueryData(['order', orderId], data),
  });
}
