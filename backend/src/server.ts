import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import pino from 'pino';
import { authRouter } from './routes/auth';
import { contractorRouter } from './routes/contractor/index.js';

dotenv.config();

const app = express();
const logger = pino();

app.use(helmet());
app.use(cors({ origin: '*' }));
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/auth', authRouter);
app.use('/contractor', contractorRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => logger.info(`Server running on :${PORT}`));
