import { MongoClient } from 'mongodb';
import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfoy';
const options = {};

let client;
let clientPromise;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// MongoDB bağlantı fonksiyonu
export async function connect() {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(uri);
      console.log('MongoDB bağlantısı başarılı!');
    }
  } catch (error) {
    console.error('MongoDB bağlantı hatası:', error);
    throw error;
  }
}

export default clientPromise;
