export interface OrderSummaryLine {
  key: string | number;
  name: string;
  quantity: number;
  totalPrice: number;
}

interface OrderSummaryProps {
  items: OrderSummaryLine[];
  total: number;
  totalLabel?: string;
}

export function OrderSummary({ items, total, totalLabel = 'Total' }: OrderSummaryProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li key={item.key} className="flex items-center justify-between text-sm">
            <span className="text-gray-700">
              {item.name} x{item.quantity}
            </span>
            <span className="font-medium text-gray-900">₹{item.totalPrice.toFixed(2)}</span>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex items-center justify-between border-t border-gray-200 pt-3 text-base font-semibold text-gray-900">
        <span>{totalLabel}</span>
        <span>₹{total.toFixed(2)}</span>
      </div>
    </div>
  );
}
