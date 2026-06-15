import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/common/EmptyState';
import { Modal } from '../../components/common/Modal';
import { Spinner } from '../../components/common/Spinner';
import { MenuItemCard } from '../../components/menu/MenuItemCard';
import { RestaurantHeader } from '../../components/restaurant/RestaurantHeader';
import { useCartContext } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { useMenu } from '../../hooks/useMenu';
import { useRestaurant } from '../../hooks/useRestaurants';
import type { MenuItemResponse } from '../../types/dto';

export function RestaurantDetail() {
  const { id } = useParams<{ id: string }>();
  const restaurantId = Number(id);

  const { data: restaurant, isLoading, isError } = useRestaurant(restaurantId);
  const { data: menu, isLoading: isMenuLoading } = useMenu(restaurantId);
  const { addItem, replaceCart } = useCartContext();
  const { showToast } = useToast();
  const [conflictItem, setConflictItem] = useState<MenuItemResponse | null>(null);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError || !restaurant) {
    return <p className="text-sm text-red-600">Restaurant not found.</p>;
  }

  const handleAddToCart = (item: MenuItemResponse) => {
    const result = addItem(restaurant.id, restaurant.name, {
      menuItemId: item.id,
      name: item.name,
      price: item.price,
    });
    if (result === 'conflict') {
      setConflictItem(item);
    } else {
      showToast(`Added ${item.name} to cart`, 'success');
    }
  };

  const handleConfirmReplace = () => {
    if (conflictItem) {
      replaceCart(restaurant.id, restaurant.name, {
        menuItemId: conflictItem.id,
        name: conflictItem.name,
        price: conflictItem.price,
      });
      showToast(`Added ${conflictItem.name} to cart`, 'success');
    }
    setConflictItem(null);
  };

  const groups = groupByCategory(menu ?? []);

  return (
    <div className="flex flex-col gap-6">
      <RestaurantHeader restaurant={restaurant} />

      {isMenuLoading && (
        <div className="flex justify-center py-8">
          <Spinner size="lg" />
        </div>
      )}

      {menu && menu.length === 0 && <EmptyState title="No menu items available" />}

      {groups.map(([category, items]) => (
        <section key={category}>
          <h2 className="mb-3 text-lg font-semibold text-gray-900">{category}</h2>
          <div className="flex flex-col gap-3">
            {items.map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
                onAddToCart={() => handleAddToCart(item)}
                addToCartDisabled={restaurant.status === 'CLOSED'}
              />
            ))}
          </div>
        </section>
      ))}

      <Modal open={!!conflictItem} onClose={() => setConflictItem(null)} title="Replace your cart?">
        <p className="text-sm text-gray-600">
          Your cart has items from another restaurant. Adding this item will clear your current cart.
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setConflictItem(null)}>
            Cancel
          </Button>
          <Button onClick={handleConfirmReplace}>Replace Cart</Button>
        </div>
      </Modal>
    </div>
  );
}

function groupByCategory(items: MenuItemResponse[]): [string, MenuItemResponse[]][] {
  const groups = new Map<string, MenuItemResponse[]>();
  for (const item of items) {
    const category = item.category?.trim() || 'Other';
    const group = groups.get(category);
    if (group) {
      group.push(item);
    } else {
      groups.set(category, [item]);
    }
  }
  return Array.from(groups.entries());
}
