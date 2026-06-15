import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { useUnreadNotificationCount } from '../../hooks/useNotifications';

export function NotificationBell() {
  const { userId } = useAuthContext();
  const unread = useUnreadNotificationCount(userId ?? undefined);

  return (
    <Link
      to="/notifications"
      aria-label="Notifications"
      className="relative inline-flex items-center justify-center rounded-full p-2 text-gray-600 hover:bg-gray-100"
    >
      <Bell size={20} />
      {unread > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary-500 px-1 text-[10px] font-semibold text-white">
          {unread > 9 ? '9+' : unread}
        </span>
      )}
    </Link>
  );
}
