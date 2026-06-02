import { z } from 'zod';

export const createBookingSchema = z.object({
  vehicleId: z.string().min(1),
  startDate: z.string().refine((value) => !Number.isNaN(Date.parse(value)), 'Invalid start date'),
  endDate: z.string().refine((value) => !Number.isNaN(Date.parse(value)), 'Invalid end date'),
  rentalDays: z.number().int().positive(),
  pricePerDay: z.number().positive(),
});
