import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { getStats } from '../controllers/admin.controller.js';

export const adminRouter = Router();

adminRouter.get('/stats', authenticate, authorize('admin'), getStats);



export default adminRouter;