import api from './api';

export function fetchVehicles(params) {
  return api.get('/vehicles', { params }).then((response) => response.data);
}

export function fetchVehicleBySlug(slug) {
  return api.get(`/vehicles/${slug}`).then((response) => response.data);
}
