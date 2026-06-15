import { Minus, Plus, Trash2 } from 'lucide-react';
import type { CartItem } from '../../context/CartContext';

interface CartItemRowProps {
  item: CartItem;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
}

export function CartItemRow({ item, onIncrement, onDecrement, onRemove }: CartItemRowProps) {
  return (
    <div className="flex items-center gap-3 py-3">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">{item.name}</p>
        <p className="text-sm text-gray-500">₹{item.price.toFixed(2)}</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Decrease quantity"
          onClick={onDecrement}
          className="rounded-md border border-gray-300 p-1 text-gray-600 hover:bg-gray-100"
        >
          <Minus size={14} />
        </button>
        <span className="w-6 text-center text-sm">{item.quantity}</span>
        <button
          type="button"
          aria-label="Increase quantity"
          onClick={onIncrement}
          className="rounded-md border border-gray-300 p-1 text-gray-600 hover:bg-gray-100"
        >
          <Plus size={14} />
        </button>
      </div>
      <p className="w-20 text-right text-sm font-semibold text-gray-900">
        ₹{(item.price * item.quantity).toFixed(2)}
      </p>
      <button
        type="button"
        aria-label="Remove item"
        onClick={onRemove}
        className="text-gray-400 hover:text-red-500"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
