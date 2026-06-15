import { Pencil, Plus, Trash2 } from 'lucide-react';
import type { MenuItemResponse } from '../../types/dto';
import { Button } from '../common/Button';

interface MenuItemCardProps {
  item: MenuItemResponse;
  onAddToCart?: () => void;
  addToCartDisabled?: boolean;
  onEdit?: () => void;
  onDeactivate?: () => void;
}

export function MenuItemCard({ item, onAddToCart, addToCartDisabled, onEdit, onDeactivate }: MenuItemCardProps) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h4 className="font-medium text-gray-900">{item.name}</h4>
          {!item.active && (
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">Inactive</span>
          )}
          {item.category && <span className="text-xs text-gray-400">{item.category}</span>}
        </div>
        {item.description && <p className="mt-1 text-sm text-gray-500">{item.description}</p>}
        <p className="mt-2 text-sm font-semibold text-gray-900">₹{item.price.toFixed(2)}</p>
      </div>
      <div className="flex shrink-0 flex-col gap-2">
        {onAddToCart && (
          <span title={addToCartDisabled ? 'Restaurant is closed' : undefined}>
            <Button variant="primary" onClick={onAddToCart} disabled={addToCartDisabled} className="whitespace-nowrap">
              <Plus size={16} /> Add
            </Button>
          </span>
        )}
        {onEdit && (
          <Button variant="secondary" onClick={onEdit} className="whitespace-nowrap">
            <Pencil size={16} /> Edit
          </Button>
        )}
        {onDeactivate && item.active && (
          <Button variant="danger" onClick={onDeactivate} className="whitespace-nowrap">
            <Trash2 size={16} /> Deactivate
          </Button>
        )}
      </div>
    </div>
  );
}
