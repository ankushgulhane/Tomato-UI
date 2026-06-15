import { Link, useParams } from 'react-router-dom';
import type { ApiError } from '../../api/client';
import { Button } from '../../components/common/Button';
import { Spinner } from '../../components/common/Spinner';
import { OrderTimeline } from '../../components/order/OrderTimeline';
import { useToast } from '../../context/ToastContext';
import { useConfirmDelivery, useConfirmPickup } from '../../hooks/useDelivery';
import { useOrder } from '../../hooks/useOrders';

export function ActiveDelivery() {
  const { orderId } = useParams<{ orderId: string }>();
  const id = Number(orderId);
  const { showToast } = useToast();
  const { data: order, isLoading } = useOrder(id, { poll: true });
  const pickupMutation = useConfirmPickup(id);
  const deliverMutation = useConfirmDelivery(id);

  if (isLoading || !order) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  const handlePickup = () => {
    pickupMutation.mutate(undefined, { onError: (error) => showToast((error as ApiError).message, 'error') });
  };

  const handleDeliver = () => {
    deliverMutation.mutate(undefined, { onError: (error) => showToast((error as ApiError).message, 'error') });
  };

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <h1 className="text-xl font-semibold text-gray-900">Order #{order.id}</h1>
      <p className="text-sm text-gray-500">{order.restaurantName}</p>

      <OrderTimeline status={order.status} />

      {order.deliveryAddress && (
        <div>
          <h3 className="text-sm font-medium text-gray-700">Delivery Address</h3>
          <p className="text-sm text-gray-500">{order.deliveryAddress}</p>
        </div>
      )}

      {order.status === 'READY_FOR_PICKUP' && (
        <Button onClick={handlePickup} isLoading={pickupMutation.isPending} className="w-full">
          Confirm Pickup
        </Button>
      )}

      {order.status === 'OUT_FOR_DELIVERY' && (
        <Button onClick={handleDeliver} isLoading={deliverMutation.isPending} className="w-full">
          Confirm Delivery
        </Button>
      )}

      {order.status === 'DELIVERED' && (
        <div className="flex flex-col items-center gap-3 rounded-md bg-green-50 p-6 text-center">
          <p className="text-sm font-medium text-green-800">Delivery completed!</p>
          <Link to="/delivery/available">
            <Button variant="secondary">Back to Available Orders</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
