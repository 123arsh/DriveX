import adminApi from './adminApi';

export function requestAdminOtp(email) {
  return adminApi.post('/auth/login', { email }).then((response) => response.data);
}

export function verifyAdminOtp(email, otp) {
  return adminApi.post('/auth/verify', { email, otp }).then((response) => response.data);
}
