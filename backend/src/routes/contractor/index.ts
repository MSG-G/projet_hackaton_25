import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth.js';
import projectsRouter from './projects';
import phasesRouter from './phases';
import tasksRouter from './tasks';
import cartRouter from './cart';

const contractorRouter = Router();

// global guards
contractorRouter.use(authenticate, authorize('contractor'));

// mount sub-routers
contractorRouter.use('/projects', projectsRouter); // /contractor/projects
contractorRouter.use('/phases', phasesRouter);     // /contractor/phases
contractorRouter.use('/tasks', tasksRouter);       // /contractor/tasks
contractorRouter.use('/cart', cartRouter);         // /contractor/cart

export { contractorRouter };
export default contractorRouter;
