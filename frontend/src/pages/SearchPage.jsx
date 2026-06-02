import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import VehicleGrid from '../components/vehicles/VehicleGrid';
import useVehicles from '../hooks/useVehicles';

const defaultFilters = { type: '', category: '', brand: '' };

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState(defaultFilters);

  useEffect(() => {
    const brand = searchParams.get('brand') || '';
    setFilters((prev) => ({ ...prev, brand }));
  }, [searchParams]);

  const { data, isLoading, isError } = useVehicles({ ...filters, limit: 12 });
  const vehicles = data?.data || [];

  const summary = useMemo(() => {
    if (isLoading) return 'Searching premium rides...';
    if (isError) return 'Unable to load vehicles. Please try again.';
    return `${vehicles.length} vehicles found for your journey`;
  }, [isLoading, isError, vehicles]);

  return (
    <div className="min-h-screen bg-surface text-text">
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-10">
        <section className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-soft">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-white/50">Search premium vehicles</p>
                <h1 className="mt-3 text-4xl font-semibold text-white">Find the perfect ride for every occasion.</h1>
              </div>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <label className="block">
                <span className="text-sm text-slate-400">Vehicle type</span>
                <select value={filters.type} onChange={(e) => setFilters((prev) => ({ ...prev, type: e.target.value }))} className="mt-3 w-full rounded-3xl bg-black/40 px-4 py-4 text-white outline-none">
                  <option value="">Any</option>
                  <option value="car">Car</option>
                  <option value="bike">Bike</option>
                  <option value="scooter">Scooter</option>
                </select>
              </label>
              <label className="block">
                <span className="text-sm text-slate-400">Category</span>
                <input value={filters.category} onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))} placeholder="Luxury, Sports, SUV" className="mt-3 w-full rounded-3xl bg-black/40 px-4 py-4 text-white outline-none" />
              </label>
              <label className="block">
                <span className="text-sm text-slate-400">Brand</span>
                <input value={filters.brand} onChange={(e) => setFilters((prev) => ({ ...prev, brand: e.target.value }))} placeholder="Tesla, BMW, Royal Enfield" className="mt-3 w-full rounded-3xl bg-black/40 px-4 py-4 text-white outline-none" />
              </label>
            </div>
          </div>

          <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-soft">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-white">Search results</h2>
                <p className="mt-2 text-sm text-slate-400">{summary}</p>
              </div>
              <button onClick={() => setFilters(defaultFilters)} className="rounded-full border border-white/10 px-5 py-3 text-sm text-white transition hover:border-glow">
                Reset Filters
              </button>
            </div>
            {isLoading ? (
              <div className="rounded-[1.75rem] border border-white/10 bg-black/40 p-10 text-center text-white/70">Loading vehicles...</div>
            ) : isError ? (
              <div className="rounded-[1.75rem] border border-red-500/20 bg-black/40 p-10 text-center text-red-300">Unable to load vehicles.</div>
            ) : (
              <VehicleGrid vehicles={vehicles} />
            )}
          </section>
        </section>
      </main>
    </div>
  );
}
