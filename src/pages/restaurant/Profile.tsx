import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Navigate } from 'react-router-dom';
import { z } from 'zod';
import type { ApiError } from '../../api/client';
import { Button } from '../../components/common/Button';
import { Input, Textarea } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Spinner } from '../../components/common/Spinner';
import { RatingStars } from '../../components/restaurant/RatingStars';
import { useToast } from '../../context/ToastContext';
import { useMyRestaurant, useUpdateRestaurant } from '../../hooks/useRestaurants';

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  cuisine: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  status: z.enum(['OPEN', 'CLOSED']),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function RestaurantProfile() {
  const { showToast } = useToast();
  const { data: restaurant, isLoading } = useMyRestaurant();
  const updateMutation = useUpdateRestaurant(restaurant?.id ?? 0);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: '', cuisine: '', address: '', phone: '', status: 'OPEN' },
  });

  useEffect(() => {
    if (restaurant) {
      reset({
        name: restaurant.name,
        cuisine: restaurant.cuisine ?? '',
        address: restaurant.address ?? '',
        phone: restaurant.phone ?? '',
        status: restaurant.status,
      });
    }
  }, [restaurant, reset]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!restaurant) {
    return <Navigate to="/restaurant/onboard" replace />;
  }

  const onSubmit = (values: ProfileFormValues) => {
    updateMutation.mutate(values, {
      onSuccess: () => showToast('Restaurant updated', 'success'),
      onError: (error) => showToast((error as ApiError).message, 'error'),
    });
  };

  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-2 text-xl font-semibold text-gray-900">Restaurant Profile</h1>
      <div className="mb-6">
        <RatingStars value={restaurant.averageRating ?? 0} count={restaurant.ratingCount ?? 0} size={18} />
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input label="Restaurant Name" {...register('name')} error={errors.name?.message} />
        <Input label="Cuisine" {...register('cuisine')} error={errors.cuisine?.message} />
        <Textarea label="Address" rows={2} {...register('address')} error={errors.address?.message} />
        <Input label="Phone" {...register('phone')} error={errors.phone?.message} />
        <Select
          label="Status"
          options={[
            { value: 'OPEN', label: 'Open' },
            { value: 'CLOSED', label: 'Closed' },
          ]}
          {...register('status')}
          error={errors.status?.message}
        />
        <Button type="submit" isLoading={updateMutation.isPending}>
          Save Changes
        </Button>
      </form>
    </div>
  );
}
