import { mongo } from './mongo';
import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';

const SALT_ROUNDS = 10;

export async function createUser(username: string, password: string) {
  const existing = await mongo.collection('users').findOne({ username });
  if (existing) throw new Error('El usuario ya existe');

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const result = await mongo.collection('users').insertOne({ username, password: hashedPassword });
  return result.insertedId;
}

export async function validateUser(username: string, password: string) {
  const user = await mongo.collection('users').findOne({ username });
  if (!user) return null;

  const match = await bcrypt.compare(password, user.password);
  return match ? user : null;
}
