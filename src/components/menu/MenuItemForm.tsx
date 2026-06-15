import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '../common/Button';
import { Input, Textarea } from '../common/Input';

const menuItemSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  price: z.coerce.number().positive('Price must be greater than 0'),
  category: z.string().optional(),
  active: z.boolean(),
});

export type MenuItemFormValues = z.infer<typeof menuItemSchema>;

interface MenuItemFormProps {
  defaultValues?: Partial<MenuItemFormValues>;
  onSubmit: (values: MenuItemFormValues) => void;
  isSubmitting?: boolean;
  showActiveToggle?: boolean;
  submitLabel?: string;
}

export function MenuItemForm({
  defaultValues,
  onSubmit,
  isSubmitting,
  showActiveToggle = false,
  submitLabel = 'Save',
}: MenuItemFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MenuItemFormValues>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: { name: '', description: '', price: 0, category: '', active: true, ...defaultValues },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input label="Name" {...register('name')} error={errors.name?.message} />
      <Textarea label="Description" rows={2} {...register('description')} error={errors.description?.message} />
      <Input
        label="Price"
        type="number"
        step="0.01"
        min="0"
        {...register('price')}
        error={errors.price?.message}
      />
      <Input label="Category" {...register('category')} error={errors.category?.message} />
      {showActiveToggle && (
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" {...register('active')} className="h-4 w-4 rounded border-gray-300" />
          Active
        </label>
      )}
      <Button type="submit" isLoading={isSubmitting}>
        {submitLabel}
      </Button>
    </form>
  );
}
