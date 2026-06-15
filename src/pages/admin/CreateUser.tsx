import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import type { ApiError } from '../../api/client';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { useToast } from '../../context/ToastContext';
import { useCreateUser } from '../../hooks/useAdmin';

const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  phone: z.string().optional(),
  address: z.string().optional(),
  role: z.enum(['USER', 'RESTAURANT', 'DELIVERY_PARTNER', 'ADMIN']),
});

type CreateUserFormValues = z.infer<typeof createUserSchema>;

const roleOptions = [
  { value: 'USER', label: 'Customer' },
  { value: 'RESTAURANT', label: 'Restaurant Owner' },
  { value: 'DELIVERY_PARTNER', label: 'Delivery Partner' },
  { value: 'ADMIN', label: 'Admin' },
];

export function CreateUser() {
  const { showToast } = useToast();
  const createMutation = useCreateUser();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: { role: 'RESTAURANT' },
  });

  const onSubmit = (values: CreateUserFormValues) => {
    createMutation.mutate(values, {
      onSuccess: (user) => {
        showToast(`Created ${user.role.toLowerCase()} account for ${user.email}`, 'success');
        reset({ name: '', email: '', password: '', phone: '', address: '', role: values.role });
      },
      onError: (error) => showToast((error as ApiError).message, 'error'),
    });
  };

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="mb-2 text-2xl font-bold text-gray-900">Create User Account</h1>
      <p className="mb-6 text-sm text-gray-500">
        Set up a restaurant owner, delivery partner, or admin account. Self-registration is only
        available for customer accounts.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input label="Name" {...register('name')} error={errors.name?.message} />
        <Input label="Email" type="email" autoComplete="off" {...register('email')} error={errors.email?.message} />
        <Input
          label="Temporary Password"
          type="password"
          autoComplete="new-password"
          {...register('password')}
          error={errors.password?.message}
        />
        <Input label="Phone" {...register('phone')} error={errors.phone?.message} />
        <Input label="Address" {...register('address')} error={errors.address?.message} />
        <Select label="Role" options={roleOptions} {...register('role')} error={errors.role?.message} />
        <Button type="submit" isLoading={createMutation.isPending} className="w-full">
          Create Account
        </Button>
      </form>
    </div>
  );
}
