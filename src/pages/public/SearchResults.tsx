import { useSearchParams } from 'react-router-dom';
import { EmptyState } from '../../components/common/EmptyState';
import { Spinner } from '../../components/common/Spinner';
import { RestaurantCard } from '../../components/restaurant/RestaurantCard';
import { useRestaurantSearch } from '../../hooks/useRestaurants';

export function SearchResults() {
  const [params] = useSearchParams();
  const query = params.get('query') ?? '';
  const { data, isLoading, isError } = useRestaurantSearch(query);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold text-gray-900">Search results for &quot;{query}&quot;</h1>

      {isLoading && (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      )}
      {isError && <p className="text-sm text-red-600">Search failed.</p>}
      {data && data.length === 0 && (
        <EmptyState title="No results" description="Try a different search term." />
      )}
      {data && data.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      )}
    </div>
  );
}
