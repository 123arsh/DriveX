import api from './api';

export function createBooking(payload) {
  return api.post('/user/bookings', payload).then((response) => response.data);
}
