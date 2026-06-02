import { Link } from 'react-router-dom';

export default function VehicleCard({ vehicle }) {
  return (
    <article className="group overflow-hidden rounded-[2rem] border border-white/10 bg-black/40 transition hover:-translate-y-1 hover:border-glow">
      <div className="aspect-[4/3] bg-slate-900" />
      <div className="p-6">
        <p className="text-xs uppercase tracking-[0.25em] text-white/50">{vehicle.category}</p>
        <h3 className="mt-3 text-2xl font-semibold text-white">{vehicle.name}</h3>
        <p className="mt-3 text-sm leading-6 text-slate-300">{vehicle.description}</p>
        <div className="mt-5 flex items-center justify-between text-sm text-white/75">
          <span>₹{vehicle.pricePerDay}/day</span>
          <Link to={`/vehicles/${vehicle.slug}`} className="rounded-full border border-white/10 px-4 py-2 transition hover:border-glow">View</Link>
        </div>
      </div>
    </article>
  );
}
