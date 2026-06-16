import mongoose from 'mongoose';

export default async function connectDatabase(uri) {
  const connectionString = uri || 'mongodb://127.0.0.1:27017/drivex';

  try {
    await mongoose.connect(connectionString, {
      dbName: 'drivex',
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // 10 second timeout for initial connection
      socketTimeoutMS: 45000, // 45 second timeout for socket operations
    });

    console.log(`✓ Connected to MongoDB successfully`);
    console.log(`Database: ${mongoose.connection.db.getName()}`);
  } catch (error) {
    console.error('✗ MongoDB Connection Error:', {
      message: error.message,
      code: error.code,
      timestamp: new Date().toISOString(),
    });
    throw error;
  }
}
