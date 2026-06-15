import { Route, Routes } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { CreateUser } from '../pages/admin/CreateUser';
import { ActiveDelivery } from '../pages/delivery/ActiveDelivery';
import { AvailableOrders } from '../pages/delivery/AvailableOrders';
import { Cart } from '../pages/customer/Cart';
import { Checkout } from '../pages/customer/Checkout';
import { Notifications } from '../pages/customer/Notifications';
import { OrderDetail } from '../pages/customer/OrderDetail';
import { OrderHistory } from '../pages/customer/OrderHistory';
import { Profile } from '../pages/customer/Profile';
import { Home } from '../pages/public/Home';
import { Login } from '../pages/public/Login';
import { Register } from '../pages/public/Register';
import { RestaurantDetail } from '../pages/public/RestaurantDetail';
import { SearchResults } from '../pages/public/SearchResults';
import { IncomingOrders } from '../pages/restaurant/IncomingOrders';
import { MenuManagement } from '../pages/restaurant/MenuManagement';
import { Onboard } from '../pages/restaurant/Onboard';
import { RestaurantProfile } from '../pages/restaurant/Profile';
import { ProtectedRoute } from './ProtectedRoute';
import { RoleRoute } from './RoleRoute';

export function AppRouter() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Home />} />
        <Route path="search" element={<SearchResults />} />
        <Route path="restaurants/:id" element={<RestaurantDetail />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route path="orders/:orderId" element={<OrderDetail />} />
          <Route path="profile" element={<Profile />} />
          <Route path="notifications" element={<Notifications />} />

          <Route element={<RoleRoute roles={['USER']} />}>
            <Route path="cart" element={<Cart />} />
            <Route path="checkout/:orderId" element={<Checkout />} />
            <Route path="orders" element={<OrderHistory />} />
          </Route>

          <Route element={<RoleRoute roles={['RESTAURANT']} />}>
            <Route path="restaurant/onboard" element={<Onboard />} />
            <Route path="restaurant/profile" element={<RestaurantProfile />} />
            <Route path="restaurant/menu" element={<MenuManagement />} />
            <Route path="restaurant/orders" element={<IncomingOrders />} />
          </Route>

          <Route element={<RoleRoute roles={['DELIVERY_PARTNER']} />}>
            <Route path="delivery/available" element={<AvailableOrders />} />
            <Route path="delivery/active/:orderId" element={<ActiveDelivery />} />
          </Route>

          <Route element={<RoleRoute roles={['ADMIN']} />}>
            <Route path="admin/users/new" element={<CreateUser />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}
