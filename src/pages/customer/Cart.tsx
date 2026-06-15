import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ApiError } from '../../api/client';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/common/EmptyState';
import { Textarea } from '../../components/common/Input';
import { CartItemRow } from '../../components/cart/CartItemRow';
import { OrderSummary, type OrderSummaryLine } from '../../components/order/OrderSummary';
import { useAuthContext } from '../../context/AuthContext';
import { useCartContext } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { useCurrentUser } from '../../hooks/useAuth';
import { useCreateOrder } from '../../hooks/useOrders';

export function Cart() {
  const { items, restaurantId, restaurantName, subtotal, updateQuantity, removeItem, clearCart } = useCartContext();
  const { userId } = useAuthContext();
  const { data: user } = useCurrentUser();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const createOrderMutation = useCreateOrder();

  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');

  useEffect(() => {
    if (user?.address) setDeliveryAddress(user.address);
  }, [user]);

  if (items.length === 0 || restaurantId === null) {
    return (
      <EmptyState
        title="Your cart is empty"
        description="Browse restaurants to add items to your cart."
        action={<Button onClick={() => navigate('/')}>Browse Restaurants</Button>}
      />
    );
  }

  const summaryItems: OrderSummaryLine[] = items.map((item) => ({
    key: item.menuItemId,
    name: item.name,
    quantity: item.quantity,
    totalPrice: item.price * item.quantity,
  }));

  const handlePlaceOrder = () => {
    if (!userId) return;
    createOrderMutation.mutate(
      {
        userId,
        restaurantId,
        deliveryAddress,
        specialInstructions,
        items: items.map((item) => ({ menuItemId: item.menuItemId, quantity: item.quantity })),
      },
      {
        onSuccess: (data) => {
          clearCart();
          navigate(`/checkout/${data.orderId}`);
        },
        onError: (error) => showToast((error as unknown as ApiError).message, 'error'),
      }
    );
  };

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <div className="flex-1">
        <h1 className="mb-4 text-xl font-semibold text-gray-900">Your Cart</h1>
        {restaurantName && <p className="mb-3 text-sm text-gray-500">From {restaurantName}</p>}
        <div className="divide-y divide-gray-100 rounded-lg border border-gray-200 bg-white px-4">
          {items.map((item) => (
            <CartItemRow
              key={item.menuItemId}
              item={item}
              onIncrement={() => updateQuantity(item.menuItemId, item.quantity + 1)}
              onDecrement={() => updateQuantity(item.menuItemId, item.quantity - 1)}
              onRemove={() => removeItem(item.menuItemId)}
            />
          ))}
        </div>
        <div className="mt-4 flex flex-col gap-4">
          <Textarea
            label="Delivery Address"
            rows={2}
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
          />
          <Textarea
            label="Special Instructions (optional)"
            rows={2}
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
          />
        </div>
      </div>
      <div className="w-full lg:w-80">
        <OrderSummary items={summaryItems} total={subtotal} totalLabel="Subtotal" />
        <Button
          className="mt-4 w-full"
          onClick={handlePlaceOrder}
          isLoading={createOrderMutation.isPending}
          disabled={!deliveryAddress.trim()}
        >
          Place Order
        </Button>
      </div>
    </div>
  );
}
