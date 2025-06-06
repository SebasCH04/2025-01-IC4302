import express, { Request, Response } from 'express';
import { publishJob } from '../services/rabbitmq';
import { authenticateToken } from '../middlewares/auth';

const router = express.Router();

router.post('/', authenticateToken, (req: Request, res: Response) => {
  const { job_id, total_pages, page_size } = req.body;

  if (!job_id || !total_pages || !page_size) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  try {
    publishJob({ job_id, total_pages: Number(total_pages), page_size: Number(page_size) });
    return res.status(200).json({ message: 'Job publicado correctamente' });
  } catch (e) {
    console.error('❌ Error al publicar job:', e);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
