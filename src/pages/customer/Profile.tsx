import { Spinner } from '../../components/common/Spinner';
import { useCurrentUser } from '../../hooks/useAuth';

export function Profile() {
  const { data: user, isLoading } = useCurrentUser();

  if (isLoading || !user) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  const fields: [string, string][] = [
    ['Name', user.name],
    ['Email', user.email],
    ['Role', user.role],
    ['Phone', user.phone ?? '-'],
    ['Address', user.address ?? '-'],
  ];

  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-6 text-xl font-semibold text-gray-900">Profile</h1>
      <dl className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        {fields.map(([label, value]) => (
          <div key={label}>
            <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</dt>
            <dd className="text-sm text-gray-900">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
