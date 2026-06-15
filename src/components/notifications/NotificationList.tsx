import { Link } from 'react-router-dom';
import type { NotificationResponse } from '../../types/dto';

interface NotificationListProps {
  notifications: NotificationResponse[];
  onMarkRead: (notificationId: number) => void;
}

export function NotificationList({ notifications, onMarkRead }: NotificationListProps) {
  return (
    <ul className="divide-y divide-gray-100 rounded-lg border border-gray-200 bg-white">
      {notifications.map((notification) => (
        <li key={notification.id} className="hover:bg-gray-50">
          <Link
            to={`/orders/${notification.orderId}`}
            onClick={() => !notification.read && onMarkRead(notification.id)}
            className="flex items-start gap-3 p-4"
          >
            {!notification.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary-500" />}
            <div className={notification.read ? 'pl-5' : ''}>
              <p className="text-sm text-gray-900">{notification.message}</p>
              <p className="mt-1 text-xs text-gray-400">{new Date(notification.createdAt).toLocaleString()}</p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
