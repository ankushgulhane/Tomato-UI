import { Plus } from 'lucide-react';
import { useState } from 'react';
import type { ApiError } from '../../api/client';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/common/EmptyState';
import { Modal } from '../../components/common/Modal';
import { Spinner } from '../../components/common/Spinner';
import { MenuItemCard } from '../../components/menu/MenuItemCard';
import { MenuItemForm, type MenuItemFormValues } from '../../components/menu/MenuItemForm';
import { useToast } from '../../context/ToastContext';
import { useAddMenuItem, useMenu, useUpdateMenuItem, useDeactivateMenuItem } from '../../hooks/useMenu';
import { useMyRestaurant } from '../../hooks/useRestaurants';
import type { MenuItemResponse } from '../../types/dto';

export function MenuManagement() {
  const { showToast } = useToast();
  const { data: restaurant, isLoading: isRestaurantLoading } = useMyRestaurant();
  const restaurantId = restaurant?.id;
  const { data: menu, isLoading: isMenuLoading } = useMenu(restaurantId);

  const addMutation = useAddMenuItem(restaurantId ?? 0);
  const updateMutation = useUpdateMenuItem(restaurantId ?? 0);
  const deactivateMutation = useDeactivateMenuItem(restaurantId ?? 0);

  const [addOpen, setAddOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItemResponse | null>(null);
  const [showInactive, setShowInactive] = useState(false);

  if (isRestaurantLoading || isMenuLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  const activeItems = (menu ?? []).filter((item) => item.active);
  const inactiveItems = (menu ?? []).filter((item) => !item.active);

  const handleAdd = (values: MenuItemFormValues) => {
    addMutation.mutate(
      {
        name: values.name,
        description: values.description,
        price: values.price,
        category: values.category,
      },
      {
        onSuccess: () => {
          setAddOpen(false);
          showToast('Menu item added', 'success');
        },
        onError: (error) => showToast((error as unknown as ApiError).message, 'error'),
      }
    );
  };

  const handleUpdate = (values: MenuItemFormValues) => {
    if (!editingItem) return;
    updateMutation.mutate(
      { menuItemId: editingItem.id, body: values },
      {
        onSuccess: () => {
          setEditingItem(null);
          showToast('Menu item updated', 'success');
        },
        onError: (error) => showToast((error as unknown as ApiError).message, 'error'),
      }
    );
  };

  const handleDeactivate = (item: MenuItemResponse) => {
    deactivateMutation.mutate(item.id, {
      onSuccess: () => showToast(`${item.name} deactivated`, 'success'),
      onError: (error) => showToast((error as unknown as ApiError).message, 'error'),
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Menu Management</h1>
        <Button onClick={() => setAddOpen(true)}>
          <Plus size={16} /> Add Item
        </Button>
      </div>

      {activeItems.length === 0 ? (
        <EmptyState title="No menu items yet" description="Add your first menu item to get started." />
      ) : (
        <div className="flex flex-col gap-3">
          {activeItems.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              onEdit={() => setEditingItem(item)}
              onDeactivate={() => handleDeactivate(item)}
            />
          ))}
        </div>
      )}

      {inactiveItems.length > 0 && (
        <div>
          <button
            type="button"
            onClick={() => setShowInactive((prev) => !prev)}
            className="text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            {showInactive ? 'Hide' : 'Show'} inactive items ({inactiveItems.length})
          </button>
          {showInactive && (
            <div className="mt-3 flex flex-col gap-3">
              {inactiveItems.map((item) => (
                <MenuItemCard key={item.id} item={item} onEdit={() => setEditingItem(item)} />
              ))}
            </div>
          )}
        </div>
      )}

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add Menu Item">
        <MenuItemForm onSubmit={handleAdd} isSubmitting={addMutation.isPending} submitLabel="Add Item" />
      </Modal>

      <Modal open={!!editingItem} onClose={() => setEditingItem(null)} title="Edit Menu Item">
        {editingItem && (
          <MenuItemForm
            defaultValues={{
              name: editingItem.name,
              description: editingItem.description ?? '',
              price: editingItem.price,
              category: editingItem.category ?? '',
              active: editingItem.active,
            }}
            onSubmit={handleUpdate}
            isSubmitting={updateMutation.isPending}
            showActiveToggle
            submitLabel="Save Changes"
          />
        )}
      </Modal>
    </div>
  );
}
