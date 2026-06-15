import { useNavigate } from 'react-router-dom';
import type { ApiError } from '../../api/client';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/common/EmptyState';
import { Spinner } from '../../components/common/Spinner';
import { useToast } from '../../context/ToastContext';
import { useAcceptDeliveryOrder, useAvailableOrders, useDeclineDeliveryOrder } from '../../hooks/useDelivery';

export function AvailableOrders() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { data: orders, isLoading } = useAvailableOrders();
  const acceptMutation = useAcceptDeliveryOrder();
  const declineMutation = useDeclineDeliveryOrder();

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  const handleAccept = (orderId: number) => {
    acceptMutation.mutate(orderId, {
      onSuccess: () => navigate(`/delivery/active/${orderId}`),
      onError: (error) => showToast((error as ApiError).message, 'error'),
    });
  };

  const handleDecline = (orderId: number) => {
    declineMutation.mutate(orderId, {
      onError: (error) => showToast((error as ApiError).message, 'error'),
    });
  };

  if (!orders || orders.length === 0) {
    return <EmptyState title="No orders available" description="Check back soon for new delivery requests." />;
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-gray-900">Available Orders</h1>
      <div className="flex flex-col gap-3">
        {orders.map((order) => (
          <div
            key={order.orderId}
            className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-medium text-gray-900">{order.restaurantName}</p>
              {order.restaurantAddress && (
                <p className="text-sm text-gray-500">Pickup: {order.restaurantAddress}</p>
              )}
              {order.deliveryAddress && (
                <p className="text-sm text-gray-500">Deliver to: {order.deliveryAddress}</p>
              )}
              <p className="mt-1 text-sm font-semibold text-gray-900">₹{order.totalAmount.toFixed(2)}</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={() => handleDecline(order.orderId)}
                isLoading={declineMutation.isPending}
              >
                Decline
              </Button>
              <Button onClick={() => handleAccept(order.orderId)} isLoading={acceptMutation.isPending}>
                Accept
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
