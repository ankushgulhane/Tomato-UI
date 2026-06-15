import { ORDER_STATUS_META } from '../../lib/orderStatus';
import type { OrderStatus } from '../../types/dto';

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const meta = ORDER_STATUS_META[status];
  return (
    <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${meta.color}`}>{meta.label}</span>
  );
}
