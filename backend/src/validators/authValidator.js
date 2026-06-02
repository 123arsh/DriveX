import { z } from 'zod';

export const signupSchema = z.object({
  firstName: z.string().min(2).max(40),
  lastName: z.string().min(2).max(40),
  email: z.string().email(),
  password: z.string().min(8).max(128),
  mobile: z.string().min(10).max(16),
  country: z.string().min(2),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
});
