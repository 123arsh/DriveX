import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { createPaymentOrder, verifyPayment } from '../services/paymentService';

function loadRazorpayScript() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error('Razorpay script failed to load'));
    document.body.appendChild(script);
  });
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const bookingId = state?.bookingId;
  const bookingTotal = state?.totalCost;
  const bookingVehicle = state?.vehicleName;
  const [order, setOrder] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!bookingId) {
      navigate('/booking');
    }
  }, [bookingId, navigate]);

  const startPayment = async () => {
    try {
      setStatusMessage('Creating payment order...');
      const response = await createPaymentOrder({ bookingId });
      const orderData = response.order;
      setOrder(orderData);
      await loadRazorpayScript();

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'DriveX Premium Rentals',
        description: `Booking for ${bookingVehicle || 'selected vehicle'}`,
        order_id: orderData.id,
        handler: async (paymentResult) => {
          setStatusMessage('Verifying payment...');
          await verifyPayment(paymentResult);
          setStatusMessage('Payment verified successfully. Redirecting...');
          setTimeout(() => navigate('/'), 1200);
        },
        prefill: {
          name: '',
          email: '',
          contact: '',
        },
        theme: {
          color: '#1f2937',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      setError(err.message || 'Unable to initialize payment.');
      setStatusMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-surface text-text">
      <Navbar />
      <main className="mx-auto max-w-5xl px-6 py-12">
        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-10 shadow-soft">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.3em] text-white/50">Checkout</p>
            <h1 className="text-3xl font-semibold text-white">Pay for your DriveX booking</h1>
            <p className="text-slate-400">Secure Razorpay payment with our premium rental experience.</p>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_0.9fr]">
            <div className="rounded-[2rem] border border-white/10 bg-black/40 p-8">
              <p className="text-sm text-slate-400">Booking ID</p>
              <p className="mt-3 text-lg text-white">{bookingId || 'Unavailable'}</p>
              <p className="mt-6 text-sm text-slate-400">Vehicle</p>
              <p className="mt-3 text-lg text-white">{bookingVehicle || 'Selected vehicle'}</p>
            </div>

            <aside className="rounded-[2rem] border border-white/10 bg-black/40 p-8">
              <p className="text-sm uppercase tracking-[0.3em] text-white/50">Amount due</p>
              <p className="mt-4 text-4xl font-semibold text-white">₹{bookingTotal?.toLocaleString() || '0'}</p>
              <button onClick={startPayment} className="mt-8 w-full rounded-full bg-glow px-6 py-4 text-black transition hover:opacity-90">
                Pay with Razorpay
              </button>
              {statusMessage && <p className="mt-4 text-sm text-slate-300">{statusMessage}</p>}
              {error && <p className="mt-4 text-sm text-rose-300">{error}</p>}
            </aside>
          </div>
        </section>
      </main>
    </div>
  );
}
