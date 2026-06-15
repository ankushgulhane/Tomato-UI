import { Link } from 'react-router-dom';
import { EmptyState } from '../../components/common/EmptyState';
import { Spinner } from '../../components/common/Spinner';
import { OrderStatusBadge } from '../../components/order/OrderStatusBadge';
import { useAuthContext } from '../../context/AuthContext';
import { useUserOrders } from '../../hooks/useOrders';

export function OrderHistory() {
  const { userId } = useAuthContext();
  const { data, isLoading } = useUserOrders(userId ?? undefined);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return <EmptyState title="No orders yet" description="Your past orders will appear here." />;
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold text-gray-900">Order History</h1>
      <div className="flex flex-col gap-3">
        {data.map((order) => (
          <Link
            key={order.id}
            to={`/orders/${order.id}`}
            className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
          >
            <div>
              <p className="font-medium text-gray-900">{order.restaurantName}</p>
              <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-semibold text-gray-900">₹{order.totalAmount.toFixed(2)}</span>
              <OrderStatusBadge status={order.status} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
