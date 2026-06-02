import Navbar from '../components/layout/Navbar';
import { motion } from 'framer-motion';
import useVehicles from '../hooks/useVehicles';
import VehicleGrid from '../components/vehicles/VehicleGrid';

const heroVehicles = [
  { title: 'Luxury Car', subtitle: 'Ride in unrivaled comfort.' },
  { title: 'Sports Car', subtitle: 'Feel every curve of the road.' },
  { title: 'Bike', subtitle: 'Urban agility for every journey.' },
  { title: 'Scooter', subtitle: 'Effortless city cruising.' },
];

export default function HomePage() {
  const { data, isLoading, isError } = useVehicles({ type: 'car', limit: 6 });
  const vehicles = data?.data || [];

  return (
    <div className="min-h-screen overflow-hidden">
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-10">
        <section className="grid gap-10 py-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-8 text-left">
            <motion.span
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/70"
            >
              Premium Vehicle Rentals
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="max-w-3xl text-5xl font-semibold leading-tight text-white md:text-6xl"
            >
              Rent Any Vehicle For Any Journey.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl text-lg text-slate-300"
            >
              Discover a premium collection of cars, bikes, and scooters built for luxury travel, everyday rides, and adventurous escapes.
            </motion.p>
            <div className="flex flex-wrap gap-4">
              <a href="#vehicles" className="rounded-full bg-glow px-8 py-4 font-semibold text-black transition hover:opacity-90">
                Browse Vehicles
              </a>
              <a href="#booking" className="rounded-full border border-white/10 px-8 py-4 text-white transition hover:border-glow">
                Rent Now
              </a>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-soft">
            <div className="grid gap-4">
              {heroVehicles.map((item, index) => (
                <motion.article
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 * index, duration: 0.6 }}
                  className="rounded-3xl border border-white/10 bg-black/40 p-6"
                >
                  <p className="text-sm uppercase tracking-[0.25em] text-white/60">{item.title}</p>
                  <h2 className="mt-3 text-3xl font-semibold text-white">{item.subtitle}</h2>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section id="vehicles" className="space-y-8 py-16">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-white/50">New Arrivals</p>
              <h2 className="mt-3 text-4xl font-semibold text-white">Featured Vehicles</h2>
            </div>
          </div>

          {isLoading ? (
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-10 text-center text-white/70">Loading vehicles...</div>
          ) : isError ? (
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-10 text-center text-red-300">Unable to load vehicles.</div>
          ) : (
            <VehicleGrid vehicles={vehicles} />
          )}
        </section>
      </main>
    </div>
  );
}
