import { PrismaClient, OrderStatus } from '@prisma/client';
import type { Request, Response } from 'express';

const prisma = new PrismaClient();

/**
 * GET /supplier/orders
 * Liste les commandes du fournisseur connecté
 */
export async function listOrders(req: Request, res: Response) {
  // @ts-expect-error ajouté par middleware auth
  const supplierId: string = req.user!.userId;
  const orders = await prisma.order.findMany({
    where: { supplierId },
    include: {
      items: { include: { product: true } },
      project: true
    },
    orderBy: { createdAt: 'desc' }
  });
  res.json(orders);
}

/**
 * PUT /supplier/orders/:id
 * Mise à jour du statut d'une commande (shipped, delivered, etc.)
 */
export async function updateOrderStatus(req: Request, res: Response) {
  // @ts-expect-error ajouté par middleware auth
  const supplierId: string = req.user!.userId;
  const orderId = req.params.id;
  const { status } = req.body as { status?: OrderStatus };
  if (!status || !(Object.values(OrderStatus) as string[]).includes(status)) {
    return res.status(400).json({ message: 'Statut invalide' });
  }

  // vérifier ownership
  const order = await prisma.order.findFirst({ where: { id: orderId!, supplierId } });
  if (!order) return res.status(404).json({ message: 'Commande introuvable' });

  const updated = await prisma.order.update({ where: { id: orderId! }, data: { status } });
  res.json(updated);
}
