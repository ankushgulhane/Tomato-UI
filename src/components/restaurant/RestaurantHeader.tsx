import type { RestaurantResponse } from '../../types/dto';
import { RatingStars } from './RatingStars';

export function RestaurantHeader({ restaurant }: { restaurant: RestaurantResponse }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{restaurant.name}</h1>
          {restaurant.cuisine && <p className="text-sm text-gray-500">{restaurant.cuisine}</p>}
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
            restaurant.status === 'OPEN' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
          }`}
        >
          {restaurant.status}
        </span>
      </div>
      <div className="mt-4 flex flex-col gap-1 text-sm text-gray-600">
        {restaurant.address && <p>{restaurant.address}</p>}
        {restaurant.phone && <p>{restaurant.phone}</p>}
      </div>
      <div className="mt-3">
        <RatingStars value={restaurant.averageRating ?? 0} count={restaurant.ratingCount ?? 0} size={18} />
      </div>
    </div>
  );
}
