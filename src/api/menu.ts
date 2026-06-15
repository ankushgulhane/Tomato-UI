import { api } from './client';
import type { CreateMenuItemRequest, MenuItemResponse, UpdateMenuItemRequest } from '../types/dto';

export const getMenu = (restaurantId: number) =>
  api.get<MenuItemResponse[]>(`/api/restaurants/${restaurantId}/menu`).then((r) => r.data);

export const addMenuItem = (restaurantId: number, body: CreateMenuItemRequest) =>
  api.post<MenuItemResponse>(`/api/restaurants/${restaurantId}/menu`, body).then((r) => r.data);

export const updateMenuItem = (restaurantId: number, menuItemId: number, body: UpdateMenuItemRequest) =>
  api.put<MenuItemResponse>(`/api/restaurants/${restaurantId}/menu/${menuItemId}`, body).then((r) => r.data);

export const deactivateMenuItem = (restaurantId: number, menuItemId: number) =>
  api.delete<void>(`/api/restaurants/${restaurantId}/menu/${menuItemId}`).then((r) => r.data);
