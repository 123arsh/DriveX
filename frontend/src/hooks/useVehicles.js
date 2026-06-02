import { useQuery } from 'react-query';
import { fetchVehicles } from '../services/vehicleService';

export default function useVehicles(params) {
  return useQuery(['vehicles', params], () => fetchVehicles(params), {
    keepPreviousData: true,
    staleTime: 1000 * 60 * 2,
  });
}
