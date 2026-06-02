import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestAdminOtp, verifyAdminOtp } from '../services/adminAuthService';
import { useAdminAuth } from '../contexts/AdminAuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('request');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAdminAuth();

  const handleRequestOtp = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    try {
      await requestAdminOtp(email);
      setMessage('OTP sent to admin email placeholder. Enter it below to continue.');
      setStep('verify');
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Unable to request OTP');
    }
  };

  const handleVerifyOtp = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    try {
      const response = await verifyAdminOtp(email, otp);
      await login({ token: response.token, admin: response.admin });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Unable to verify OTP');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/5 p-10 shadow-panel">
        <h1 className="text-3xl font-semibold text-white">Admin Sign In</h1>
        <p className="mt-3 text-sm text-slate-400">Secure operations for fleet, bookings, and admin reviews.</p>
        <form className="mt-8 space-y-5" onSubmit={step === 'request' ? handleRequestOtp : handleVerifyOtp}>
          <label className="block text-sm text-slate-300">
            Email
            <input value={email} onChange={(event) => setEmail(event.target.value)} className="mt-3 w-full rounded-3xl border border-white/10 bg-slate-950 px-4 py-4 text-white outline-none" placeholder="admin@drivex.com" />
          </label>

          {step === 'verify' && (
            <label className="block text-sm text-slate-300">
              OTP
              <input value={otp} onChange={(event) => setOtp(event.target.value)} className="mt-3 w-full rounded-3xl border border-white/10 bg-slate-950 px-4 py-4 text-white outline-none" placeholder="Enter OTP" />
            </label>
          )}

          {message && <p className="text-sm text-emerald-300">{message}</p>}
          {error && <p className="text-sm text-rose-300">{error}</p>}

          <button type="submit" className="w-full rounded-full bg-accent px-6 py-4 font-semibold text-black transition hover:opacity-90">
            {step === 'request' ? 'Request OTP' : 'Verify OTP'}
          </button>
        </form>
      </div>
    </div>
  );
}
