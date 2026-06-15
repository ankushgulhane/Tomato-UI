import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createRestaurant,
  getRestaurant,
  listRestaurants,
  searchRestaurants,
  submitRating,
  updateRestaurant,
} from '../api/restaurants';
import { useAuthContext } from '../context/AuthContext';
import type { CreateRestaurantRequest, RatingRequest, UpdateRestaurantRequest } from '../types/dto';

export function useRestaurants() {
  return useQuery({ queryKey: ['restaurants'], queryFn: listRestaurants, staleTime: 60_000 });
}

export function useRestaurantSearch(query: string) {
  return useQuery({
    queryKey: ['restaurants', 'search', query],
    queryFn: () => searchRestaurants(query),
    enabled: query.trim().length > 0,
  });
}

export function useRestaurant(restaurantId: number | undefined) {
  return useQuery({
    queryKey: ['restaurant', restaurantId],
    queryFn: () => getRestaurant(restaurantId as number),
    enabled: restaurantId !== undefined,
  });
}

// The API has no "my restaurant" endpoint, so the list is fetched and
// filtered client-side for the current owner (see LLD Section 8 note).
export function useMyRestaurant() {
  const { userId, role } = useAuthContext();

  return useQuery({
    queryKey: ['myRestaurant', userId],
    queryFn: async () => {
      const all = await listRestaurants();
      return all.find((r) => r.ownerId === userId) ?? null;
    },
    enabled: role === 'RESTAURANT' && userId !== null,
  });
}

export function useCreateRestaurant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateRestaurantRequest) => createRestaurant(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myRestaurant'] });
      queryClient.invalidateQueries({ queryKey: ['restaurants'] });
    },
  });
}

export function useUpdateRestaurant(restaurantId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateRestaurantRequest) => updateRestaurant(restaurantId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myRestaurant'] });
      queryClient.invalidateQueries({ queryKey: ['restaurant', restaurantId] });
      queryClient.invalidateQueries({ queryKey: ['restaurants'] });
    },
  });
}

export function useSubmitRating(restaurantId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: RatingRequest) => submitRating(restaurantId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurant', restaurantId] });
    },
  });
}
