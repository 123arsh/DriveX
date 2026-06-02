import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import ThemeContext from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import useCartStore from '../../store/cartStore';

export default function Navbar() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const itemCount = useCartStore((state) => state.items.length);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');

  const submitSearch = (event) => {
    event.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?brand=${encodeURIComponent(query.trim())}`);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/60 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 text-sm text-white">
        <Link to="/" className="font-brand text-2xl tracking-[0.18em] uppercase text-white">
          DriveX
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link to="/" className="transition hover:text-glow">Home</Link>
          <Link to="/search" className="transition hover:text-glow">Vehicles</Link>
          <Link to="/cart" className="transition hover:text-glow">Cart</Link>
          <Link to="/auth" className="transition hover:text-glow">Login</Link>
        </nav>

        <div className="flex items-center gap-3">
          <button onClick={() => setSearchOpen((prev) => !prev)} className="rounded-full border border-white/15 px-4 py-2 transition hover:border-glow">
            Search
          </button>
          <Link to="/cart" className="relative rounded-full border border-white/15 px-4 py-2 transition hover:border-glow">
            Cart{itemCount > 0 && <span className="absolute -right-2 -top-2 inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-glow text-xs font-semibold text-black">{itemCount}</span>}
          </Link>
          {isAuthenticated ? (
            <button onClick={logout} className="rounded-full border border-white/15 px-4 py-2 transition hover:border-glow">
              Logout
            </button>
          ) : (
            <Link to="/auth" className="rounded-full border border-white/15 px-4 py-2 transition hover:border-glow">
              Login
            </Link>
          )}
          <button className="rounded-full border border-white/15 px-4 py-2 transition hover:border-glow" onClick={toggleTheme}>
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
        </div>
      </div>
      {searchOpen && (
        <div className="border-t border-white/10 bg-black/80 px-6 py-4">
          <form onSubmit={submitSearch} className="mx-auto flex max-w-3xl gap-3">
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search vehicles, brands, or categories" className="w-full rounded-full border border-white/10 bg-slate-950 px-5 py-3 text-white outline-none" />
            <button type="submit" className="rounded-full bg-glow px-5 py-3 font-semibold text-black">Go</button>
          </form>
        </div>
      )}
    </header>
  );
}
