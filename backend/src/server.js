import dotenv from 'dotenv';
import app from './app.js';
import connectDatabase from './config/db.js';

dotenv.config();
const PORT = process.env.PORT || 5000;

// Start server regardless of database connection status
app.listen(PORT, () => {
  console.log(`DriveX backend running on http://localhost:${PORT}`);
});

// Try to connect to database
connectDatabase(process.env.MONGODB_URI)
  .then(() => {
    console.log('Database connected successfully');
  })
  .catch((error) => {
    console.error('Database connection failed:', error);
    console.warn('Server running without database connection');
  });
