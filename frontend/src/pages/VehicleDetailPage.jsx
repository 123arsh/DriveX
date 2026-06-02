import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import Navbar from '../components/layout/Navbar';
import { fetchVehicleBySlug } from '../services/vehicleService';
import useCartStore from '../store/cartStore';

export default function VehicleDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);
  const [message, setMessage] = useState(null);

  const { data: vehicle, isLoading, isError } = useQuery(['vehicle', slug], () => fetchVehicleBySlug(slug), {
    enabled: Boolean(slug),
    staleTime: 1000 * 60 * 5,
  });

  const handleAddToCart = () => {
    if (!vehicle) return;
    addItem(vehicle);
    setMessage('Added to cart successfully.');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface text-text">
        <Navbar />
        <main className="mx-auto max-w-6xl px-6 py-12">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-12 text-center text-white/70">Loading vehicle details...</div>
        </main>
      </div>
    );
  }

  if (isError || !vehicle) {
    return (
      <div className="min-h-screen bg-surface text-text">
        <Navbar />
        <main className="mx-auto max-w-6xl px-6 py-12">
          <div className="rounded-[2rem] border border-red-500/20 bg-black/40 p-12 text-center text-red-300">Unable to load this vehicle. Please try again or return to the search page.</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface text-text">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-12">
        <section className="grid gap-10 lg:grid-cols-[1.4fr_0.7fr]">
          <div className="space-y-5 rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-soft">
            <img src={vehicle.images?.[0] || '/vehicle-placeholder.png'} alt={vehicle.name} className="aspect-[16/9] w-full rounded-[1.75rem] object-cover" />
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-white/60">{vehicle.vehicleType || 'Vehicle'} • {vehicle.category || 'Premium'}</p>
                  <h1 className="text-4xl font-semibold text-white">{vehicle.name}</h1>
                  <p className="mt-2 text-sm text-slate-400">{vehicle.brand}</p>
                </div>
                <span className="inline-flex rounded-full bg-emerald-500/20 px-4 py-2 text-sm text-emerald-200">{vehicle.availabilityStatus === 'available' ? 'Available' : 'Unavailable'}</span>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                <div className="rounded-3xl border border-white/10 bg-black/40 p-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-white/50">Fuel</p>
                  <p className="mt-2 text-lg font-semibold text-white">{vehicle.fuelType || 'Electric'}</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-black/40 p-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-white/50">Seats</p>
                  <p className="mt-2 text-lg font-semibold text-white">{vehicle.seats || 4}</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-black/40 p-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-white/50">Transmission</p>
                  <p className="mt-2 text-lg font-semibold text-white">{vehicle.transmission || 'Automatic'}</p>
                </div>
              </div>
              <p className="text-slate-300">{vehicle.description || 'A premium vehicle built for unforgettable journeys, with luxury appointments and intelligent performance.'}</p>
            </div>
          </div>

          <aside className="space-y-6 rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-soft">
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.3em] text-white/60">Price</p>
              <p className="text-4xl font-semibold text-white">₹{vehicle.pricePerDay}<span className="text-base font-medium text-white/70"> / day</span></p>
            </div>
            <button onClick={() => navigate('/booking')} className="w-full rounded-full bg-glow px-6 py-4 text-black transition hover:opacity-90">Book Now</button>
            <button onClick={handleAddToCart} className="w-full rounded-full border border-white/10 px-6 py-4 text-white transition hover:border-glow">Add to Cart</button>
            {message && <p className="mt-3 text-sm text-emerald-300">{message}</p>}
          </aside>
        </section>
      </main>
    </div>
  );
}
