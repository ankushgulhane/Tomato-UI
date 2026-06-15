import { Check } from 'lucide-react';
import { BANNER_STATUSES, HAPPY_PATH_STATUSES, ORDER_STATUS_META } from '../../lib/orderStatus';
import type { OrderStatus } from '../../types/dto';

export function OrderTimeline({ status }: { status: OrderStatus }) {
  if (BANNER_STATUSES.has(status)) {
    const meta = ORDER_STATUS_META[status];
    return <div className={`rounded-md p-4 text-sm font-medium ${meta.color}`}>{meta.label}</div>;
  }

  const currentIndex = HAPPY_PATH_STATUSES.indexOf(status);

  return (
    <ol className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-2">
      {HAPPY_PATH_STATUSES.map((step, index) => {
        const isComplete = index < currentIndex;
        const isCurrent = index === currentIndex;
        return (
          <li key={step} className="flex flex-1 items-center gap-2 sm:flex-col sm:items-center sm:text-center">
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                isComplete
                  ? 'bg-primary-500 text-white'
                  : isCurrent
                    ? 'bg-primary-100 text-primary-600 ring-2 ring-primary-500'
                    : 'bg-gray-100 text-gray-400'
              }`}
            >
              {isComplete ? <Check size={14} /> : index + 1}
            </span>
            <span className={`text-xs sm:text-sm ${isCurrent ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>
              {ORDER_STATUS_META[step].label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
