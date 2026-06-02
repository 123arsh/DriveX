import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/layout/AdminSidebar';
import { fetchDashboard } from '../services/adminApi';
import { useAdminAuth } from '../contexts/AdminAuthContext';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAdminAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    fetchDashboard()
      .then((data) => {
        setDashboard(data);
      })
      .catch((err) => {
        setError(err?.response?.data?.error || err?.message || 'Unable to load dashboard');
      })
      .finally(() => setLoading(false));
  }, [isAuthenticated, navigate]);

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[280px_1fr]">
      <AdminSidebar />
      <main className="space-y-8 bg-surface p-10 text-white">
        {loading ? (
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-10 text-center text-slate-300">Loading dashboard...</div>
        ) : error ? (
          <div className="rounded-[2rem] border border-red-500/20 bg-black/50 p-10 text-center text-red-300">{error}</div>
        ) : (
          <>
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-panel">
                <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Active Rentals</p>
                <p className="mt-4 text-4xl font-semibold">{dashboard.activeRentals}</p>
              </div>
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-panel">
                <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Total Vehicles</p>
                <p className="mt-4 text-4xl font-semibold">{dashboard.totalVehicles}</p>
              </div>
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-panel">
                <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Revenue</p>
                <p className="mt-4 text-4xl font-semibold">₹{dashboard.revenue.toLocaleString()}</p>
              </div>
            </div>
            <section className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-panel">
                <h2 className="text-xl font-semibold text-white">Pending Verifications</h2>
                <p className="mt-3 text-slate-400">Review new identity submissions, approve documents, and maintain compliance.</p>
              </div>
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-panel">
                <h2 className="text-xl font-semibold text-white">Booking Queue</h2>
                <p className="mt-3 text-slate-400">Monitor booking status, payment verification, and fleet assignments in real time.</p>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
