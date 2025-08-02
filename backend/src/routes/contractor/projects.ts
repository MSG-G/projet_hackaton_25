import { Router } from 'express';
import { PrismaClient, ProjectStatus, PriorityLevel } from '@prisma/client';
import { z } from 'zod';
import type { AuthRequest } from '../../middleware/auth.js';

const prisma = new PrismaClient();
const router = Router();
const idParam = z.string().uuid('Invalid uuid');

// List all projects for contractor
router.get('/', async (req: AuthRequest, res) => {
  const projects = await prisma.project.findMany({ where: { contractorId: req.user!.userId } });
  return res.json({ projects });
});

// Get single project details
router.get('/:id', async (req: AuthRequest, res) => {
  const idRes = idParam.safeParse(req.params.id);
  if (!idRes.success) return res.status(400).json({ message: idRes.error.message });

  const whereClause = req.user!.role === 'admin'
    ? { id: idRes.data }
    : { id: idRes.data, contractorId: req.user!.userId };

  const project = await prisma.project.findFirst({
    where: whereClause,
    include: {
      phases: true,
      tasks: true,
      orders: {
        include: { items: true, delivery: true }
      }
    }
  });

  if (!project) return res.status(404).json({ message: 'Project not found' });
  return res.json({ project });
});

// Schema definitions
const baseProjectSchema = z.object({
  title: z.string().min(3),
  description: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  priority: z.nativeEnum(PriorityLevel).optional().default('medium'),
  budget: z.number().positive().nullable().optional(),
  startDate: z.string().datetime({ offset: true }).nullable().optional(),
  deadline: z.string().datetime({ offset: true }).nullable().optional()
});

router.post('/', async (req: AuthRequest, res) => {
  const parse = baseProjectSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ errors: parse.error.flatten() });
  const data = parse.data;
  const project = await prisma.project.create({
    data: {
      contractorId: req.user!.userId,
      title: data.title,
      description: data.description ?? null,
      location: data.location ?? null,
      priority: data.priority,
      budget: data.budget ?? null,
      startDate: data.startDate ? new Date(data.startDate) : null,
      deadline: data.deadline ? new Date(data.deadline) : null,
      status: ProjectStatus.draft
    }
  });
  return res.status(201).json({ project });
});

const updateSchema = baseProjectSchema.partial().extend({ status: z.nativeEnum(ProjectStatus).optional() });

router.put('/:id', async (req: AuthRequest, res) => {
  const idRes = idParam.safeParse(req.params.id);
  if (!idRes.success) return res.status(400).json({ message: idRes.error.message });
  const parse = updateSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ errors: parse.error.flatten() });

  const project = await prisma.project.update({
    where: { id: idRes.data, contractorId: req.user!.userId },
    data: {
      ...parse.data,
      description: parse.data.description ?? null,
      location: parse.data.location ?? null,
      budget: parse.data.budget ?? null,
      startDate: parse.data.startDate ? new Date(parse.data.startDate) : null,
      deadline: parse.data.deadline ? new Date(parse.data.deadline) : null
    }
  }).catch(() => null);

  if (!project) return res.status(404).json({ message: 'Project not found' });
  return res.json({ project });
});

router.delete('/:id', async (req: AuthRequest, res) => {
  const idRes = idParam.safeParse(req.params.id);
  if (!idRes.success) return res.status(400).json({ message: idRes.error.message });
  await prisma.project.deleteMany({ where: { id: idRes.data, contractorId: req.user!.userId } });
  return res.status(204).end();
});

export default router;
