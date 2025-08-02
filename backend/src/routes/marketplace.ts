import { Router } from 'express';
import { listProducts } from '../controllers/marketplace.controller.js';

export const marketplaceRouter = Router();

// Public route to list products (no auth)
marketplaceRouter.get('/products', listProducts);
