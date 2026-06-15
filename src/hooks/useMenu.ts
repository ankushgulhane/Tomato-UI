import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addMenuItem, deactivateMenuItem, getMenu, updateMenuItem } from '../api/menu';
import type { CreateMenuItemRequest, MenuItemResponse, UpdateMenuItemRequest } from '../types/dto';

export function useMenu(restaurantId: number | undefined) {
  return useQuery({
    queryKey: ['menu', restaurantId],
    queryFn: () => getMenu(restaurantId as number),
    enabled: restaurantId !== undefined,
  });
}

export function useAddMenuItem(restaurantId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateMenuItemRequest) => addMenuItem(restaurantId, body),
    onSuccess: (created) => {
      queryClient.setQueryData<MenuItemResponse[]>(['menu', restaurantId], (prev) =>
        prev ? [...prev, created] : [created]
      );
    },
  });
}

// GET /menu only returns active items, so deactivating/reactivating updates the
// cached list directly instead of refetching - otherwise deactivated items would
// vanish instead of moving to the "Inactive items" section.
export function useUpdateMenuItem(restaurantId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ menuItemId, body }: { menuItemId: number; body: UpdateMenuItemRequest }) =>
      updateMenuItem(restaurantId, menuItemId, body),
    onSuccess: (updated) => {
      queryClient.setQueryData<MenuItemResponse[]>(['menu', restaurantId], (prev) =>
        prev ? prev.map((item) => (item.id === updated.id ? updated : item)) : [updated]
      );
    },
  });
}

export function useDeactivateMenuItem(restaurantId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (menuItemId: number) => deactivateMenuItem(restaurantId, menuItemId),
    onSuccess: (_data, menuItemId) => {
      queryClient.setQueryData<MenuItemResponse[]>(['menu', restaurantId], (prev) =>
        prev ? prev.map((item) => (item.id === menuItemId ? { ...item, active: false } : item)) : prev
      );
    },
  });
}
