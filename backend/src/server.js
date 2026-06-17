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

async function startServer() {
  try {
    // Wait for the database before starting the HTTP server so requests do not
    // hit the API before the connection is ready.
    console.log('Attempting to connect to MongoDB...');
    await connectDatabase(process.env.MONGODB_URI);
    console.log('✓ Database connected successfully');

    const server = app.listen(PORT, () => {
      console.log(`✓ DriveX backend running on port ${PORT}`);
      console.log(`API Base URL: http://localhost:${PORT}/api`);
    });

    const gracefulShutdown = (signal) => {
      console.log(`${signal} signal received: closing HTTP server`);
      server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  } catch (error) {
    console.error('✗ Database connection failed:', error.message);
    process.exit(1);
  }
}

startServer();
