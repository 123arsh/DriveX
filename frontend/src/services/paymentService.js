import api from './api';

export function createPaymentOrder(payload) {
  return api.post('/payments/order', payload).then((response) => response.data);
}

export function verifyPayment(payload) {
  return api.post('/payments/verify', payload).then((response) => response.data);
}
