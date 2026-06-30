import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URL = process.env.MONGODB_URL;

if (!MONGODB_URL) {
  throw new Error('Missing MONGODB_URL environment variable');
}

const globalWithMongoose = globalThis;

if (!globalWithMongoose._mongoose) {
  globalWithMongoose._mongoose = {
    conn: null,
    promise: null,
  };
}

async function connectToDatabase() {
  if (globalWithMongoose._mongoose.conn) {
    return globalWithMongoose._mongoose.conn;
  }

  if (!globalWithMongoose._mongoose.promise) {
    globalWithMongoose._mongoose.promise = mongoose
      .connect(MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then((mongooseInstance) => mongooseInstance);
  }

  globalWithMongoose._mongoose.conn = await globalWithMongoose._mongoose.promise;
  return globalWithMongoose._mongoose.conn;
}

export default connectToDatabase;
