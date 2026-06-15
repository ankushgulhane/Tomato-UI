import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { ApiError } from '../../api/client';
import { Button } from '../../components/common/Button';
import { Spinner } from '../../components/common/Spinner';
import { OrderStatusBadge } from '../../components/order/OrderStatusBadge';
import { OrderSummary, type OrderSummaryLine } from '../../components/order/OrderSummary';
import { useToast } from '../../context/ToastContext';
import { useOrder, useProcessPayment } from '../../hooks/useOrders';

const paymentMethods = [
  { value: 'CARD', label: 'Card' },
  { value: 'UPI', label: 'UPI' },
  { value: 'WALLET', label: 'Wallet' },
];

export function Checkout() {
  const { orderId } = useParams<{ orderId: string }>();
  const id = Number(orderId);
  const { data: order, isLoading } = useOrder(id);
  const paymentMutation = useProcessPayment(id);
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [method, setMethod] = useState(paymentMethods[0].value);
  const [paymentResult, setPaymentResult] = useState<'SUCCESS' | 'FAILED' | null>(null);

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

  const handlePay = () => {
    paymentMutation.mutate(
      { orderId: id, amount: order.totalAmount, paymentMethod: method },
      {
        onSuccess: (data) => {
          if (data.status === 'SUCCESS') {
            setPaymentResult('SUCCESS');
            setTimeout(() => navigate(`/orders/${id}`), 1200);
          } else {
            setPaymentResult('FAILED');
          }
        },
        onError: (error) => showToast((error as unknown as ApiError).message, 'error'),
      }
    );
  };

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6">
      <h1 className="text-xl font-semibold text-gray-900">Checkout</h1>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">Order #{order.id}</span>
        <OrderStatusBadge status={order.status} />
      </div>

      <OrderSummary items={summaryItems} total={order.totalAmount} />

      {paymentResult === 'SUCCESS' ? (
        <div className="rounded-md bg-green-50 p-4 text-sm font-medium text-green-800">
          Payment successful! Redirecting to your order...
        </div>
      ) : (
        <>
          <div>
            <p className="mb-2 text-sm font-medium text-gray-700">Payment Method</p>
            <div className="flex flex-col gap-2">
              {paymentMethods.map((pm) => (
                <label key={pm.value} className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={pm.value}
                    checked={method === pm.value}
                    onChange={() => setMethod(pm.value)}
                  />
                  {pm.label}
                </label>
              ))}
            </div>
          </div>

          {paymentResult === 'FAILED' && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
              Payment failed. Please try again.
            </div>
          )}

          <Button onClick={handlePay} isLoading={paymentMutation.isPending} className="w-full">
            {paymentResult === 'FAILED' ? 'Retry Payment' : 'Pay Now'}
          </Button>
        </>
      )}
    </div>
  );
}
