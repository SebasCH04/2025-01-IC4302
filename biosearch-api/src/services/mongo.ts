import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const client = new MongoClient(process.env.MONGO_URI!);
export let mongo: Db;

export async function connectToMongo() {
  try {
    await client.connect();
    mongo = client.db(process.env.MONGO_DB!);
    console.log('✅ MongoDB conectado');
  } catch (e) {
    console.error('❌ Error conectando a MongoDB:', e);
    process.exit(1);
  }
}
