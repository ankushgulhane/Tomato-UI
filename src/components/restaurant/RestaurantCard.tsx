import { Link } from 'react-router-dom';
import type { RestaurantResponse } from '../../types/dto';
import { RatingStars } from './RatingStars';

export function RestaurantCard({ restaurant }: { restaurant: RestaurantResponse }) {
  return (
    <Link
      to={`/restaurants/${restaurant.id}`}
      className="block rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-base font-semibold text-gray-900">{restaurant.name}</h3>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
            restaurant.status === 'OPEN' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
          }`}
        >
          {restaurant.status}
        </span>
      </div>
      {restaurant.cuisine && <p className="mt-1 text-sm text-gray-500">{restaurant.cuisine}</p>}
      {restaurant.address && <p className="mt-1 line-clamp-1 text-sm text-gray-500">{restaurant.address}</p>}
      <div className="mt-2">
        <RatingStars value={restaurant.averageRating ?? 0} count={restaurant.ratingCount ?? 0} />
      </div>
    </Link>
  );
}
