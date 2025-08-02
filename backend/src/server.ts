import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import pino from 'pino';
import { authRouter } from './routes/auth.js';
import { supplierRouter } from './routes/supplier.js';
import { adminRouter } from './routes/admin.js';
import { authRouter } from './routes/auth';
import { contractorRouter } from './routes/contractor/index.js';

dotenv.config();

const app = express();
const logger = pino();

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: '*' }));
app.use(express.json());
import path from 'path';
app.use('/uploads', express.static(path.resolve('uploads'), {
  setHeaders: (res) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  }
}));

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/auth', authRouter);

app.use('/supplier', supplierRouter);
app.use('/admin', adminRouter);

app.use('/contractor', contractorRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => logger.info(`Server running on :${PORT}`));
