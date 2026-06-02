import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-surface text-text">
      <Navbar />
      <main className="mx-auto flex min-h-[calc(100vh-88px)] max-w-4xl flex-col items-center justify-center px-6 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-white/50">404</p>
        <h1 className="mt-5 text-5xl font-semibold text-white">Page not found</h1>
        <p className="mt-4 max-w-xl text-slate-300">The DriveX route you are looking for does not exist. Return to the homepage and continue your premium journey.</p>
        <Link to="/" className="mt-8 inline-flex rounded-full bg-glow px-8 py-4 text-black transition hover:opacity-90">Back to Home</Link>
      </main>
    </div>
  );
}
