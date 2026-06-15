import { api } from './client';
import type {
  CreateRestaurantRequest,
  RatingRequest,
  RatingResponse,
  RestaurantResponse,
  UpdateRestaurantRequest,
} from '../types/dto';

export const listRestaurants = () => api.get<RestaurantResponse[]>('/api/restaurants').then((r) => r.data);

export const searchRestaurants = (query: string) =>
  api.get<RestaurantResponse[]>('/api/restaurants/search', { params: { query } }).then((r) => r.data);

export const getRestaurant = (restaurantId: number) =>
  api.get<RestaurantResponse>(`/api/restaurants/${restaurantId}`).then((r) => r.data);

export const createRestaurant = (body: CreateRestaurantRequest) =>
  api.post<RestaurantResponse>('/api/restaurants', body).then((r) => r.data);

export const updateRestaurant = (restaurantId: number, body: UpdateRestaurantRequest) =>
  api.put<RestaurantResponse>(`/api/restaurants/${restaurantId}`, body).then((r) => r.data);

export const submitRating = (restaurantId: number, body: RatingRequest) =>
  api.post<RatingResponse>(`/api/restaurants/${restaurantId}/rating`, body).then((r) => r.data);
