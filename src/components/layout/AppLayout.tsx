import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { CartDrawer } from '../cart/CartDrawer';
import { ChatWidget } from '../chat/ChatWidget';
import { Footer } from './Footer';
import { Navbar } from './Navbar';

export function AppLayout() {
  const [cartOpen, setCartOpen] = useState(false);
  const { isAuthenticated, role } = useAuthContext();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar onCartClick={() => setCartOpen(true)} />
      <main className="flex-1 bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <Outlet />
        </div>
      </main>
      <Footer />
      {role === 'USER' && <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />}
      {isAuthenticated && <ChatWidget />}
    </div>
  );
}
