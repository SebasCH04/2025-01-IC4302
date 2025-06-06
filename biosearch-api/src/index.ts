import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectToMongo } from './services/mongo';
import { connectToRabbitMQ } from './services/rabbitmq';
import authRoutes from './routes/auth';
import jobRoutes from './routes/job';
import searchRoutes from './routes/search';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Conectar a MongoDB y RabbitMQ antes de iniciar el servidor
async function startServer() {
  await connectToMongo();
  await connectToRabbitMQ();

  app.use('/auth', authRoutes);
  app.use('/job', jobRoutes);
  app.use('/search', searchRoutes);

  app.listen(PORT, () => {
    console.log(`🚀 API escuchando en http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Error al iniciar el servidor:', err);
  process.exit(1);
});
