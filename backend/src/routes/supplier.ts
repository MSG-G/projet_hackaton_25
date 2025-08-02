import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { authenticate, authorize } from '../middleware/auth.js';
import {
  getSummary,
  getCategories,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/product.controller.js';

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, path.resolve('uploads')),
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

export const supplierRouter = Router();
supplierRouter.use(authenticate, authorize('supplier'));

supplierRouter.get('/summary', getSummary);
supplierRouter.get('/categories', getCategories);

supplierRouter.get('/products', getProducts);
supplierRouter.post('/products', upload.array('images', 5), createProduct);
supplierRouter.put('/products/:id', upload.array('images', 5), updateProduct);
supplierRouter.delete('/products/:id', deleteProduct);

import { listOrders, updateOrderStatus } from '../controllers/order.controller.js';

supplierRouter.get('/orders', listOrders);
supplierRouter.put('/orders/:id', updateOrderStatus);