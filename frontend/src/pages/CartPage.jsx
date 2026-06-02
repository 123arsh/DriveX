import { Link, useNavigate } from 'react-router-dom';
import useCartStore from '../store/cartStore';

export default function CartPage() {
  const navigate = useNavigate();
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);

  const total = items.reduce((sum, item) => sum + item.pricePerDay, 0);

  return (
    <div className="min-h-screen bg-surface text-text">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-white/50">Your cart</p>
            <h1 className="mt-2 text-4xl font-semibold text-white">Ready to reserve your premium ride.</h1>
          </div>
          <Link to="/search" className="rounded-full border border-white/10 px-5 py-3 text-sm text-white transition hover:border-glow">Continue browsing</Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="space-y-4">
            {items.length === 0 ? (
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-10 text-center text-slate-300">Your cart is empty. Add a vehicle to begin your booking journey.</div>
            ) : (
              items.map((vehicle) => (
                <div key={vehicle._id} className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-soft">
                  <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
                    <div>
                      <p className="text-sm uppercase tracking-[0.25em] text-slate-400">{vehicle.category}</p>
                      <h2 className="text-2xl font-semibold text-white">{vehicle.name}</h2>
                      <p className="mt-2 text-sm text-slate-300">{vehicle.brand}</p>
                    </div>
                    <button onClick={() => removeItem(vehicle._id)} className="rounded-full border border-white/10 px-4 py-2 text-sm text-white transition hover:border-glow">
                      Remove
                    </button>
                  </div>
                  <div className="mt-5 flex items-center justify-between text-white/80">
                    <span>Price per day</span>
                    <span>₹{vehicle.pricePerDay}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          <aside className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-soft">
            <p className="text-sm uppercase tracking-[0.3em] text-white/50">Order summary</p>
            <p className="mt-4 text-3xl font-semibold text-white">₹{total.toLocaleString()}</p>
            <p className="mt-3 text-sm text-slate-400">Estimate is per-day total for selected vehicles.</p>
            <button disabled={items.length === 0} className="mt-8 w-full rounded-full bg-glow px-6 py-4 text-black transition disabled:cursor-not-allowed disabled:opacity-50">
              Proceed to Booking
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
}
