import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    vehicleType: { type: String, enum: ['car', 'bike', 'scooter'], required: true },
    category: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    pricePerDay: { type: Number, required: true },
    availabilityStatus: { type: String, enum: ['available', 'unavailable', 'reserved'], default: 'available' },
    fuelType: { type: String, trim: true },
    seats: { type: Number },
    transmission: { type: String, trim: true },
    mileage: { type: String, trim: true },
    engine: { type: String, trim: true },
    features: [{ type: String }],
    images: [{ type: String }],
    rating: { type: Number, default: 4.9 },
    reviewsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

vehicleSchema.index({ name: 'text', description: 'text', brand: 'text' });

export default mongoose.model('Vehicle', vehicleSchema);
