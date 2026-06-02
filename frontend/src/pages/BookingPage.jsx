import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCartStore from '../store/cartStore';
import { useAuth } from '../contexts/AuthContext';
import { createBooking } from '../services/bookingService';

export default function BookingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const [startDate, setStartDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState(() => new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10));
  const [pickup, setPickup] = useState('');
  const [bookingError, setBookingError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedVehicle = items[0] || null;
  const rentalDays = useMemo(() => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
    return diff;
  }, [startDate, endDate]);

  const bookingTotal = useMemo(() => {
    return selectedVehicle ? selectedVehicle.pricePerDay * rentalDays : 0;
  }, [selectedVehicle, rentalDays]);

  useEffect(() => {
    if (items.length === 0) {
      return;
    }
  }, [items.length]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedVehicle) {
      setBookingError('Please add a vehicle to your cart before booking.');
      return;
    }
    if (!pickup) {
      setBookingError('Please provide a pickup location.');
      return;
    }
    if (!isAuthenticated) {
      navigate('/auth?next=/booking');
      return;
    }

    try {
      setBookingError('');
      setIsSubmitting(true);

      const result = await createBooking({
        vehicleId: selectedVehicle._id,
        startDate,
        endDate,
        rentalDays,
        pricePerDay: selectedVehicle.pricePerDay,
      });

      clearCart();
      navigate('/checkout', { state: { bookingId: result._id, totalCost: bookingTotal, vehicleName: selectedVehicle.name } });
    } catch (error) {
      setBookingError(error.response?.data?.error || 'Unable to create booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface text-text">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.3em] text-white/50">Booking details</p>
          <h1 className="mt-2 text-4xl font-semibold text-white">Reserve your premium vehicle in a few steps.</h1>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
          <form onSubmit={handleSubmit} className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-soft space-y-6">
            <label className="block text-sm text-slate-300">
              Pickup location
              <input value={pickup} onChange={(event) => setPickup(event.target.value)} className="mt-3 w-full rounded-3xl bg-black/40 px-4 py-4 text-white outline-none" placeholder="Enter pickup address" />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm text-slate-300">
                Start date
                <input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} className="mt-3 w-full rounded-3xl bg-black/40 px-4 py-4 text-white outline-none" />
              </label>
              <label className="block text-sm text-slate-300">
                End date
                <input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} className="mt-3 w-full rounded-3xl bg-black/40 px-4 py-4 text-white outline-none" />
              </label>
            </div>
            <button type="submit" disabled={isSubmitting} className="w-full rounded-full bg-glow px-6 py-4 font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60">
              {isAuthenticated ? 'Continue to payment' : 'Sign in to continue'}
            </button>
            {bookingError && <p className="text-sm text-rose-300">{bookingError}</p>}
          </form>

          <aside className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-soft">
            <p className="text-sm uppercase tracking-[0.3em] text-white/50">Selected vehicle</p>
            <div className="mt-6 space-y-4">
              {!selectedVehicle ? (
                <p className="text-sm text-slate-400">No vehicles selected yet. Add from the fleet to continue.</p>
              ) : (
                <div className="rounded-3xl border border-white/10 bg-black/40 p-4">
                  <p className="text-sm uppercase tracking-[0.25em] text-slate-400">{selectedVehicle.category}</p>
                  <h2 className="mt-2 text-xl font-semibold text-white">{selectedVehicle.name}</h2>
                  <p className="mt-2 text-sm text-white/80">₹{selectedVehicle.pricePerDay}/day</p>
                </div>
              )}
            </div>
            {selectedVehicle && (
              <div className="mt-6 rounded-3xl border border-white/10 bg-black/40 p-4">
                <p className="text-sm text-slate-400">Rental days</p>
                <p className="mt-2 text-lg text-white">{rentalDays}</p>
                <p className="mt-4 text-sm text-slate-400">Estimated total</p>
                <p className="mt-2 text-3xl font-semibold text-white">₹{bookingTotal.toLocaleString()}</p>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
