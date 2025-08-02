import { Router } from 'express';
import { PrismaClient, PhaseStatus } from '@prisma/client';
import { z } from 'zod';
import type { AuthRequest } from '../../middleware/auth.js';

const prisma = new PrismaClient();
const router = Router();
const idParam = z.string().uuid('Invalid uuid');

// Add phase to a project (expects /projects/:id/phases when mounted under /projects)
const createPhaseSchema = z.object({
  name: z.string().min(2),
  order: z.number().int().nullable().optional(),
  progress: z.number().int().min(0).max(100).default(0),
  status: z.nativeEnum(PhaseStatus).optional()
});

router.post('/:projectId/phases', async (req: AuthRequest, res) => {
  const projRes = idParam.safeParse(req.params.projectId);
  if (!projRes.success) return res.status(400).json({ message: projRes.error.message });
  const parse = createPhaseSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ errors: parse.error.flatten() });

  const project = await prisma.project.findFirst({ where: { id: projRes.data, contractorId: req.user!.userId } });
  if (!project) return res.status(404).json({ message: 'Project not found' });

  const phase = await prisma.phase.create({ data: { ...parse.data, order: parse.data.order ?? null, status: parse.data.status ?? PhaseStatus.pending, projectId: project.id } });
  return res.status(201).json({ phase });
});

// Update phase (mounted under /phases)
const updateSchema = createPhaseSchema.partial();
router.patch('/:phaseId', async (req: AuthRequest, res) => {
  const phaseRes = idParam.safeParse(req.params.phaseId);
  if (!phaseRes.success) return res.status(400).json({ message: phaseRes.error.message });
  const parse = updateSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ errors: parse.error.flatten() });

  const phase = await prisma.phase.findUnique({ where: { id: phaseRes.data }, include: { project: true } });
  if (!phase || phase.project.contractorId !== req.user!.userId) return res.status(404).json({ message: 'Phase not found' });

  const updated = await prisma.phase.update({ where: { id: phase.id }, data: { ...parse.data, order: parse.data.order ?? null } });
  return res.json({ phase: updated });
});

export default router;
