import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('MONGODB_URI is missing. Add it to backend/.env');
  }

  mongoose.connection.on('disconnected', () => {
    console.error('MongoDB disconnected. Check Atlas Network Access, cluster health, and local firewall/VPN.');
  });

  mongoose.connection.on('error', (error) => {
    console.error('MongoDB connection error:', error.message);
  });

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000,
    family: 4
  });
  console.log('MongoDB connected');
};
