import { EmptyState } from '../../components/common/EmptyState';
import { Spinner } from '../../components/common/Spinner';
import { NotificationList } from '../../components/notifications/NotificationList';
import { useAuthContext } from '../../context/AuthContext';
import { useMarkNotificationRead, useNotifications } from '../../hooks/useNotifications';

export function Notifications() {
  const { userId } = useAuthContext();
  const { data, isLoading } = useNotifications(userId ?? undefined);
  const markRead = useMarkNotificationRead(userId ?? undefined);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return <EmptyState title="No notifications" description="You're all caught up." />;
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold text-gray-900">Notifications</h1>
      <NotificationList notifications={data} onMarkRead={(id) => markRead.mutate(id)} />
    </div>
  );
}
