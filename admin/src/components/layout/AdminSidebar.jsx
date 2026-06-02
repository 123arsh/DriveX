import { Link } from 'react-router-dom';

export default function AdminSidebar() {
  return (
    <aside className="border-r border-white/10 bg-[#020617] p-8 text-white shadow-panel">
      <div className="mb-10">
        <div className="text-2xl font-semibold text-white">DriveX Admin</div>
        <p className="mt-2 text-sm text-slate-400">Secure operations for fleet, bookings and verification.</p>
      </div>
      <nav className="space-y-4 text-sm text-slate-300">
        <Link className="block rounded-3xl bg-white/5 px-5 py-4 transition hover:bg-white/10" to="/dashboard">Dashboard</Link>
        <Link className="block rounded-3xl bg-white/5 px-5 py-4 transition hover:bg-white/10" to="/dashboard">Bookings</Link>
        <Link className="block rounded-3xl bg-white/5 px-5 py-4 transition hover:bg-white/10" to="/dashboard">Vehicles</Link>
        <Link className="block rounded-3xl bg-white/5 px-5 py-4 transition hover:bg-white/10" to="/dashboard">Users</Link>
      </nav>
    </aside>
  );
}
