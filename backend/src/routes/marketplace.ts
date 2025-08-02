import { Router } from 'express';
import { listProducts } from '../controllers/marketplace.controller.js';

export const marketplaceRouter = Router();

marketplaceRouter.get('/products', listProducts);
