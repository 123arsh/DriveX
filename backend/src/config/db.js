import mongoose from 'mongoose';

export default async function connectDatabase(uri) {
  const connectionString = uri || 'mongodb://127.0.0.1:27017/drivex';

  await mongoose.connect(connectionString, {
    dbName: 'drivex',
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  console.log(`Connected to MongoDB at ${connectionString}`);
}
