import api from './api';

export function login(credentials) {
  return api.post('/auth/login', credentials).then((response) => response.data);
}

export function signup(payload) {
  return api.post('/auth/signup', payload).then((response) => response.data);
}

export function refreshToken() {
  return api.post('/auth/refresh').then((response) => response.data);
}
