import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';
import { useToast, type ToastVariant } from '../../context/ToastContext';

const variantStyles: Record<ToastVariant, string> = {
  success: 'bg-green-50 text-green-800 border-green-200',
  error: 'bg-red-50 text-red-800 border-red-200',
  info: 'bg-blue-50 text-blue-800 border-blue-200',
};

const variantIcons: Record<ToastVariant, typeof Info> = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
};

export function ToastContainer() {
  const { toasts, dismissToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex w-80 flex-col gap-2">
      {toasts.map((toast) => {
        const Icon = variantIcons[toast.variant];
        return (
          <div
            key={toast.id}
            className={`flex items-start gap-2 rounded-md border p-3 shadow-md ${variantStyles[toast.variant]}`}
          >
            <Icon size={18} className="mt-0.5 shrink-0" />
            <p className="flex-1 text-sm">{toast.message}</p>
            <button
              type="button"
              aria-label="Dismiss"
              onClick={() => dismissToast(toast.id)}
              className="text-current opacity-60 hover:opacity-100"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
