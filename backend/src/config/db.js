import mongoose from 'mongoose';

const DEFAULT_DB_NAME = 'drivex';
const DEFAULT_URI = 'mongodb://127.0.0.1:27017/drivex';

export default async function connectDatabase(
  uri = process.env.MONGODB_URI || DEFAULT_URI
) {
  // Keep the database name explicit so the app behaves correctly in both
  // local development and production environments.
  const connectionString = uri;
  const dbName = process.env.DB_NAME || DEFAULT_DB_NAME;

  // Register event listeners once so connection state is easier to debug.
  mongoose.connection.on('connected', () => {
    console.log('MongoDB connection established');
  });

  mongoose.connection.on('error', (error) => {
    console.error('MongoDB connection error:', error);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB connection disconnected');
  });

  try {
    await mongoose.connect(connectionString, {
      dbName,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      autoIndex: true,
    });

    const connection = mongoose.connection;

    // `connection.name` is the correct Mongoose API for the database name.
    // `connection.db.getName()` is not valid for the current MongoDB driver.
    console.log('✓ Connected to MongoDB successfully');
    console.log(`Database: ${connection.name}`);
  } catch (error) {
    console.error('✗ MongoDB Connection Error:', {
      message: error.message,
      code: error.code,
      timestamp: new Date().toISOString(),
    });
    throw error;
  }
}
