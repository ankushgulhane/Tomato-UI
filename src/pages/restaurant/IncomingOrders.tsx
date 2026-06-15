import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { ApiError } from '../../api/client';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/common/EmptyState';
import { Spinner } from '../../components/common/Spinner';
import { OrderStatusBadge } from '../../components/order/OrderStatusBadge';
import { useToast } from '../../context/ToastContext';
import {
  useAcceptRestaurantOrder,
  useRejectRestaurantOrder,
  useRestaurantOrders,
  useUpdateRestaurantOrderStatus,
} from '../../hooks/useOrders';
import { useMyRestaurant } from '../../hooks/useRestaurants';
import type { OrderStatus } from '../../types/dto';

const filterTabs: { value: OrderStatus | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'All' },
  { value: 'PLACED', label: 'Placed' },
  { value: 'RESTAURANT_CONFIRMED', label: 'Confirmed' },
  { value: 'PREPARING', label: 'Preparing' },
  { value: 'READY_FOR_PICKUP', label: 'Ready for Pickup' },
  { value: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
  { value: 'DELIVERED', label: 'Delivered' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

export function IncomingOrders() {
  const { showToast } = useToast();
  const { data: restaurant, isLoading: isRestaurantLoading } = useMyRestaurant();
  const restaurantId = restaurant?.id;
  const [filter, setFilter] = useState<OrderStatus | 'ALL'>('ALL');

  const { data: orders, isLoading } = useRestaurantOrders(
    restaurantId,
    filter === 'ALL' ? undefined : filter
  );

  const acceptMutation = useAcceptRestaurantOrder(restaurantId ?? 0);
  const rejectMutation = useRejectRestaurantOrder(restaurantId ?? 0);
  const statusMutation = useUpdateRestaurantOrderStatus(restaurantId ?? 0);

  if (isRestaurantLoading || isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  const handleAccept = (orderId: number) => {
    acceptMutation.mutate(orderId, { onError: (error) => showToast((error as unknown as ApiError).message, 'error') });
  };

  const handleReject = (orderId: number) => {
    rejectMutation.mutate(orderId, { onError: (error) => showToast((error as unknown as ApiError).message, 'error') });
  };

  const handleStatusUpdate = (orderId: number, status: OrderStatus) => {
    statusMutation.mutate(
      { orderId, body: { status } },
      { onError: (error) => showToast((error as unknown as ApiError).message, 'error') }
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-gray-900">Incoming Orders</h1>

      <div className="flex flex-wrap gap-2">
        {filterTabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setFilter(tab.value)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              filter === tab.value
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {!orders || orders.length === 0 ? (
        <EmptyState title="No orders" description="Orders matching this filter will appear here." />
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((order) => (
            <div key={order.id} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <Link to={`/orders/${order.id}`} className="flex-1">
                  <p className="font-medium text-gray-900">Order #{order.id}</p>
                  <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
                  <p className="mt-1 text-sm font-semibold text-gray-900">₹{order.totalAmount.toFixed(2)}</p>
                </Link>
                <div className="flex flex-col items-end gap-2">
                  <OrderStatusBadge status={order.status} />
                  {order.status === 'PLACED' && (
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        onClick={() => handleAccept(order.id)}
                        isLoading={acceptMutation.isPending}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleReject(order.id)}
                        isLoading={rejectMutation.isPending}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                  {order.status === 'RESTAURANT_CONFIRMED' && (
                    <Button
                      onClick={() => handleStatusUpdate(order.id, 'PREPARING')}
                      isLoading={statusMutation.isPending}
                    >
                      Start Preparing
                    </Button>
                  )}
                  {order.status === 'PREPARING' && (
                    <Button
                      onClick={() => handleStatusUpdate(order.id, 'READY_FOR_PICKUP')}
                      isLoading={statusMutation.isPending}
                    >
                      Mark Ready for Pickup
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
