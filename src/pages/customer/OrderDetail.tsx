import { useState } from 'react';
import { useParams } from 'react-router-dom';
import type { ApiError } from '../../api/client';
import { Button } from '../../components/common/Button';
import { Spinner } from '../../components/common/Spinner';
import { OrderStatusBadge } from '../../components/order/OrderStatusBadge';
import { OrderSummary, type OrderSummaryLine } from '../../components/order/OrderSummary';
import { OrderTimeline } from '../../components/order/OrderTimeline';
import { RatingModal } from '../../components/order/RatingModal';
import { useAuthContext } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useCancelOrder, useOrder } from '../../hooks/useOrders';
import { useSubmitRating } from '../../hooks/useRestaurants';
import { isCancellable } from '../../lib/orderStatus';

export function OrderDetail() {
  const { orderId } = useParams<{ orderId: string }>();
  const id = Number(orderId);
  const { role } = useAuthContext();
  const { showToast } = useToast();
  const { data: order, isLoading } = useOrder(id, { poll: true });
  const cancelMutation = useCancelOrder(id);
  const ratingMutation = useSubmitRating(order?.restaurantId ?? 0);
  const [ratingOpen, setRatingOpen] = useState(false);
  const [rated, setRated] = useState(false);

  if (isLoading || !order) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  const summaryItems: OrderSummaryLine[] = order.items.map((item) => ({
    key: item.menuItemId,
    name: item.name,
    quantity: item.quantity,
    totalPrice: item.totalPrice,
  }));

  const handleCancel = () => {
    cancelMutation.mutate(undefined, {
      onError: (error) => showToast((error as unknown as ApiError).message, 'error'),
    });
  };

  const handleSubmitRating = (score: number, comment: string) => {
    ratingMutation.mutate(
      { orderId: order.id, score, comment },
      {
        onSuccess: () => {
          setRated(true);
          setRatingOpen(false);
          showToast('Thanks for your rating!', 'success');
        },
        onError: (error) => showToast((error as unknown as ApiError).message, 'error'),
      }
    );
  };

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Order #{order.id}</h1>
        <OrderStatusBadge status={order.status} />
      </div>
      <p className="text-sm text-gray-500">{order.restaurantName}</p>

      <OrderTimeline status={order.status} />

      <OrderSummary items={summaryItems} total={order.totalAmount} />

      {order.deliveryAddress && (
        <div>
          <h3 className="text-sm font-medium text-gray-700">Delivery Address</h3>
          <p className="text-sm text-gray-500">{order.deliveryAddress}</p>
        </div>
      )}

      {order.specialInstructions && (
        <div>
          <h3 className="text-sm font-medium text-gray-700">Special Instructions</h3>
          <p className="text-sm text-gray-500">{order.specialInstructions}</p>
        </div>
      )}

      {role === 'USER' && (
        <div className="flex gap-2">
          {isCancellable(order.status) && (
            <Button variant="danger" onClick={handleCancel} isLoading={cancelMutation.isPending}>
              Cancel Order
            </Button>
          )}
          {order.status === 'DELIVERED' && !rated && (
            <Button variant="secondary" onClick={() => setRatingOpen(true)}>
              Rate Restaurant
            </Button>
          )}
        </div>
      )}

      <RatingModal
        open={ratingOpen}
        onClose={() => setRatingOpen(false)}
        onSubmit={handleSubmitRating}
        isSubmitting={ratingMutation.isPending}
      />
    </div>
  );
}
