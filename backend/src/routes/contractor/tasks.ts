import { Router } from 'express';
import { PrismaClient, PriorityLevel, TaskStatus } from '@prisma/client';
import { z } from 'zod';
import type { AuthRequest } from '../../middleware/auth.js';

const prisma = new PrismaClient();
const router = Router();
const idParam = z.string().uuid('Invalid uuid');

const createSchema = z.object({
  projectId: idParam,
  title: z.string().min(2),
  description: z.string().nullable().optional(),
  priority: z.nativeEnum(PriorityLevel).optional(),
  dueDate: z.string().datetime({ offset: true }).nullable().optional()
});

// List tasks with optional filters
router.get('/', async (req: AuthRequest, res) => {
  const { projectId, status } = req.query as { projectId?: string; status?: string };
  const where: any = { project: { contractorId: req.user!.userId } };
  if (projectId) where.projectId = projectId;
  if (status) where.status = status;

  const tasks = await prisma.task.findMany({ where, include: { checklist: true } });
  return res.json({ tasks });
});

router.post('/', async (req: AuthRequest, res) => {
  const parse = createSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ errors: parse.error.flatten() });
  const project = await prisma.project.findFirst({ where: { id: parse.data.projectId, contractorId: req.user!.userId } });
  if (!project) return res.status(404).json({ message: 'Project not found' });

  const task = await prisma.task.create({
    data: {
      projectId: project.id,
      title: parse.data.title,
      description: parse.data.description ?? null,
      priority: parse.data.priority ?? PriorityLevel.medium,
      dueDate: parse.data.dueDate ? new Date(parse.data.dueDate) : null,
      status: TaskStatus.todo
    }
  });
  return res.status(201).json({ task });
});

const updateSchema = z.object({
  title: z.string().min(2).optional(),
  description: z.string().nullable().optional(),
  priority: z.nativeEnum(PriorityLevel).optional(),
  status: z.nativeEnum(TaskStatus).optional(),
  dueDate: z.string().datetime({ offset: true }).nullable().optional(),
  progress: z.number().int().min(0).max(100).optional()
});

router.patch('/:taskId', async (req: AuthRequest, res) => {
  const taskRes = idParam.safeParse(req.params.taskId);
  if (!taskRes.success) return res.status(400).json({ message: taskRes.error.message });
  const parse = updateSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ errors: parse.error.flatten() });

  const task = await prisma.task.findUnique({ where: { id: taskRes.data }, include: { project: true } });
  if (!task || task.project.contractorId !== req.user!.userId) return res.status(404).json({ message: 'Task not found' });

  const updated = await prisma.task.update({
    where: { id: task.id },
    data: {
      ...parse.data,
      description: parse.data.description ?? undefined,
      dueDate: parse.data.dueDate ? new Date(parse.data.dueDate) : undefined
    }
  });
  return res.json({ task: updated });
});

export default router;
