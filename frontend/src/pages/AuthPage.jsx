import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Navbar from '../components/layout/Navbar';
import { useAuth } from '../contexts/AuthContext';
import { loginSchema, signupSchema } from '../validators/authSchema';

export default function AuthPage() {
  const [mode, setMode] = useState('login');
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, signup } = useAuth();
  const schema = mode === 'login' ? loginSchema : signupSchema;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (values) => {
    try {
      setServerError('');
      if (mode === 'login') {
        await login(values);
      } else {
        await signup(values);
      }
      const next = searchParams.get('next') || '/booking';
      navigate(next);
    } catch (error) {
      setServerError(error.response?.data?.error || error.message || 'Unable to authenticate.');
    }
  };

  return (
    <div className="min-h-screen bg-surface text-text">
      <Navbar />
      <main className="mx-auto flex min-h-[calc(100vh-88px)] max-w-4xl items-center justify-center px-6 py-12">
        <div className="w-full rounded-[2rem] border border-white/10 bg-white/5 p-10 shadow-soft">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-semibold text-white">{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h1>
            <button className="text-sm text-white/70 underline" onClick={() => setMode((prev) => (prev === 'login' ? 'signup' : 'login'))}>
              {mode === 'login' ? 'Create account' : 'Sign in'}
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-5">
            {mode === 'signup' && (
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2 text-sm text-slate-300">
                  First name
                  <input {...register('firstName')} className="w-full rounded-3xl bg-black/40 px-4 py-4 text-white outline-none" placeholder="First name" />
                  {errors.firstName && <span className="text-xs text-rose-300">{errors.firstName.message}</span>}
                </label>
                <label className="space-y-2 text-sm text-slate-300">
                  Last name
                  <input {...register('lastName')} className="w-full rounded-3xl bg-black/40 px-4 py-4 text-white outline-none" placeholder="Last name" />
                  {errors.lastName && <span className="text-xs text-rose-300">{errors.lastName.message}</span>}
                </label>
              </div>
            )}

            <label className="block text-sm text-slate-300">
              Email address
              <input {...register('email')} className="mt-3 w-full rounded-3xl bg-black/40 px-4 py-4 text-white outline-none" placeholder="Email address" />
              {errors.email && <span className="text-xs text-rose-300">{errors.email.message}</span>}
            </label>

            {mode === 'signup' && (
              <label className="block text-sm text-slate-300">
                Mobile number
                <input {...register('mobile')} className="mt-3 w-full rounded-3xl bg-black/40 px-4 py-4 text-white outline-none" placeholder="Mobile number" />
                {errors.mobile && <span className="text-xs text-rose-300">{errors.mobile.message}</span>}
              </label>
            )}

            <label className="block text-sm text-slate-300">
              Password
              <input {...register('password')} type="password" className="mt-3 w-full rounded-3xl bg-black/40 px-4 py-4 text-white outline-none" placeholder="Password" />
              {errors.password && <span className="text-xs text-rose-300">{errors.password.message}</span>}
            </label>

            {serverError && <p className="text-sm text-rose-300">{serverError}</p>}
            <button type="submit" disabled={isSubmitting} className="w-full rounded-full bg-glow px-6 py-4 text-black transition hover:opacity-90 disabled:opacity-60">
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
