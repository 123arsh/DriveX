import { randomBytes } from 'crypto';

export default function generateBookingId() {
  return `DRX-${randomBytes(3).toString('hex').toUpperCase()}-${Date.now().toString().slice(-6)}`;
}
