import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import type { ApiError } from '../../api/client';
import { Button } from '../../components/common/Button';
import { Input, Textarea } from '../../components/common/Input';
import { Spinner } from '../../components/common/Spinner';
import { useToast } from '../../context/ToastContext';
import { useCreateRestaurant, useMyRestaurant } from '../../hooks/useRestaurants';

const onboardSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  cuisine: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
});

type OnboardFormValues = z.infer<typeof onboardSchema>;

export function Onboard() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { data: myRestaurant, isLoading } = useMyRestaurant();
  const createMutation = useCreateRestaurant();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OnboardFormValues>({
    resolver: zodResolver(onboardSchema),
    defaultValues: { name: '', cuisine: '', address: '', phone: '' },
  });

  useEffect(() => {
    if (myRestaurant) navigate('/restaurant/profile', { replace: true });
  }, [myRestaurant, navigate]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  const onSubmit = (values: OnboardFormValues) => {
    createMutation.mutate(values, {
      onSuccess: () => navigate('/restaurant/profile', { replace: true }),
      onError: (error) => showToast((error as unknown as ApiError).message, 'error'),
    });
  };

  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-2 text-xl font-semibold text-gray-900">Set up your restaurant</h1>
      <p className="mb-6 text-sm text-gray-500">
        Tell us a bit about your restaurant to get started on Tomato.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input label="Restaurant Name" {...register('name')} error={errors.name?.message} />
        <Input label="Cuisine" {...register('cuisine')} error={errors.cuisine?.message} />
        <Textarea label="Address" rows={2} {...register('address')} error={errors.address?.message} />
        <Input label="Phone" {...register('phone')} error={errors.phone?.message} />
        <Button type="submit" isLoading={createMutation.isPending}>
          Create Restaurant
        </Button>
      </form>
    </div>
  );
}
