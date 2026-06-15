import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCartContext } from '../../context/CartContext';
import { Button } from '../common/Button';
import { EmptyState } from '../common/EmptyState';
import { CartItemRow } from './CartItemRow';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, restaurantName, subtotal, updateQuantity, removeItem } = useCartContext();
  const navigate = useNavigate();

  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose} />}
      <div
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-sm transform flex-col bg-white shadow-xl transition-transform ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
          <h2 className="text-lg font-semibold text-gray-900">Your Cart</h2>
          <button type="button" aria-label="Close cart" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <EmptyState title="Your cart is empty" description="Add items from the menu to get started." />
          ) : (
            <>
              {restaurantName && <p className="pb-2 text-sm text-gray-500">From {restaurantName}</p>}
              <div className="divide-y divide-gray-100">
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
            </>
          )}
        </div>
        {items.length > 0 && (
          <div className="border-t border-gray-200 p-4">
            <div className="mb-3 flex items-center justify-between text-base font-semibold text-gray-900">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <Button
              className="w-full"
              onClick={() => {
                onClose();
                navigate('/cart');
              }}
            >
              Go to Cart
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
