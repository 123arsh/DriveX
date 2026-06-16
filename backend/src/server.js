import dotenv from 'dotenv';
import app from './app.js';
import connectDatabase from './config/db.js';

dotenv.config();
const PORT = process.env.PORT || 5000;

// Log startup configuration
console.log('='.repeat(60));
console.log('DriveX Backend Starting...');
console.log('='.repeat(60));
console.log(`Environment: ${process.env.NODE_ENV}`);
console.log(`Port: ${PORT}`);
console.log(`CORS Enabled: true`);
console.log('='.repeat(60));

// Start server
const server = app.listen(PORT, () => {
  console.log(`✓ DriveX backend running on port ${PORT}`);
  console.log(`API Base URL: http://localhost:${PORT}/api`);
});

// Try to connect to database
console.log('Attempting to connect to MongoDB...');
connectDatabase(process.env.MONGODB_URI)
  .then(() => {
    console.log('✓ Database connected successfully');
  })
  .catch((error) => {
    console.error('✗ Database connection failed:', error.message);
    console.error('Server will continue to run, but database operations will fail.');
  });

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
