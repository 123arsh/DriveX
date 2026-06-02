import VehicleCard from './VehicleCard';

export default function VehicleGrid({ vehicles }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {vehicles?.map((vehicle) => (
        <VehicleCard key={vehicle._id} vehicle={vehicle} />
      ))}
    </div>
  );
}
