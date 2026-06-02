import dotenv from 'dotenv';
import app from './app.js';
import connectDatabase from './config/db.js';

dotenv.config();
const PORT = process.env.PORT || 5000;

connectDatabase(process.env.MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`DriveX backend running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database connection failed:', error);
    process.exit(1);
  });
