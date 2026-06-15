import { useQueryClient } from '@tanstack/react-query';
import { LogOut, ShoppingCart, UtensilsCrossed } from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { useCartContext } from '../../context/CartContext';
import { NotificationBell } from '../notifications/NotificationBell';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
    isActive ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-100'
  }`;

interface NavbarProps {
  onCartClick: () => void;
}

export function Navbar({ onCartClick }: NavbarProps) {
  const { isAuthenticated, role, logout } = useAuthContext();
  const { items } = useCartContext();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    queryClient.clear();
    navigate('/');
  };

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold text-primary-500">
          <UtensilsCrossed size={22} />
          Tomato
        </Link>

        <nav className="hidden items-center gap-1 sm:flex">
          <NavLink to="/" className={navLinkClass} end>
            Home
          </NavLink>
          {role === 'USER' && (
            <NavLink to="/orders" className={navLinkClass}>
              My Orders
            </NavLink>
          )}
          {role === 'RESTAURANT' && (
            <>
              <NavLink to="/restaurant/profile" className={navLinkClass}>
                Restaurant
              </NavLink>
              <NavLink to="/restaurant/menu" className={navLinkClass}>
                Menu
              </NavLink>
              <NavLink to="/restaurant/orders" className={navLinkClass}>
                Orders
              </NavLink>
            </>
          )}
          {role === 'DELIVERY_PARTNER' && (
            <NavLink to="/delivery/available" className={navLinkClass}>
              Available Orders
            </NavLink>
          )}
          {role === 'ADMIN' && (
            <NavLink to="/admin/users/new" className={navLinkClass}>
              Create User
            </NavLink>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {isAuthenticated && <NotificationBell />}
          {role === 'USER' && (
            <button
              type="button"
              aria-label="Cart"
              onClick={onCartClick}
              className="relative rounded-full p-2 text-gray-600 hover:bg-gray-100"
            >
              <ShoppingCart size={20} />
              {items.length > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary-500 px-1 text-[10px] font-semibold text-white">
                  {items.length}
                </span>
              )}
            </button>
          )}
          {isAuthenticated ? (
            <>
              <NavLink to="/profile" className={navLinkClass}>
                Profile
              </NavLink>
              <button
                type="button"
                aria-label="Log out"
                onClick={handleLogout}
                className="rounded-full p-2 text-gray-600 hover:bg-gray-100"
              >
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100">
                Log in
              </Link>
              <Link
                to="/register"
                className="rounded-md bg-primary-500 px-3 py-2 text-sm font-medium text-white hover:bg-primary-600"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
