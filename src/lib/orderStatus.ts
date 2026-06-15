import type { OrderStatus } from '../types/dto';

export const ORDER_STATUS_META: Record<OrderStatus, { label: string; color: string }> = {
  CREATED: { label: 'Awaiting payment', color: 'bg-status-gray text-white' },
  PAYMENT_FAILED: { label: 'Payment failed', color: 'bg-status-red text-white' },
  PLACED: { label: 'Order placed', color: 'bg-status-blue text-white' },
  RESTAURANT_CONFIRMED: { label: 'Confirmed by restaurant', color: 'bg-status-blue text-white' },
  RESTAURANT_REJECTED: { label: 'Rejected by restaurant', color: 'bg-status-red text-white' },
  PREPARING: { label: 'Preparing', color: 'bg-status-amber text-white' },
  READY_FOR_PICKUP: { label: 'Ready for pickup', color: 'bg-status-amber text-white' },
  OUT_FOR_DELIVERY: { label: 'Out for delivery', color: 'bg-status-indigo text-white' },
  DELIVERED: { label: 'Delivered', color: 'bg-status-green text-white' },
  CANCELLED: { label: 'Cancelled', color: 'bg-status-red text-white' },
};

// The "happy path" sequence rendered as steps by OrderTimeline.
export const HAPPY_PATH_STATUSES: OrderStatus[] = [
  'CREATED',
  'PLACED',
  'RESTAURANT_CONFIRMED',
  'PREPARING',
  'READY_FOR_PICKUP',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
];

// Terminal statuses that replace the timeline with a banner instead of a step.
export const BANNER_STATUSES = new Set<OrderStatus>(['PAYMENT_FAILED', 'RESTAURANT_REJECTED', 'CANCELLED']);

// Statuses for which polling should stop (no further transitions expected).
export const TERMINAL_STATUSES = new Set<OrderStatus>([
  'DELIVERED',
  'CANCELLED',
  'RESTAURANT_REJECTED',
  'PAYMENT_FAILED',
]);

export const CANCELLABLE_STATUSES = new Set<OrderStatus>([
  'CREATED',
  'PLACED',
  'RESTAURANT_CONFIRMED',
  'PREPARING',
]);

export function isCancellable(status: OrderStatus): boolean {
  return CANCELLABLE_STATUSES.has(status);
}
