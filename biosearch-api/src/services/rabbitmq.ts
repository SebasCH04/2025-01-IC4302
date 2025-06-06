import amqplib, { Channel } from 'amqplib';
import dotenv from 'dotenv';

dotenv.config();

let channel: Channel;

export async function connectToRabbitMQ() {
  try {
    const conn = await amqplib.connect(process.env.RABBITMQ_URL!);
    channel = await conn.createChannel();
    await channel.assertQueue('jobs', { durable: true });
    console.log('✅ Conectado a RabbitMQ');
  } catch (e) {
    console.error('❌ Error conectando a RabbitMQ:', e);
    process.exit(1);
  }
}

export function publishJob(job: { job_id: string; total_pages: number; page_size: number }) {
  if (!channel) throw new Error('RabbitMQ no inicializado');
  channel.sendToQueue('jobs', Buffer.from(JSON.stringify(job)), {
    persistent: true,
  });
}
