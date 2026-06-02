import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import SearchPage from '../pages/SearchPage';
import VehicleDetailPage from '../pages/VehicleDetailPage';
import CartPage from '../pages/CartPage';
import BookingPage from '../pages/BookingPage';
import CheckoutPage from '../pages/CheckoutPage';
import AuthPage from '../pages/AuthPage';
import NotFoundPage from '../pages/NotFoundPage';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/vehicles/:slug" element={<VehicleDetailPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/booking" element={<BookingPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
