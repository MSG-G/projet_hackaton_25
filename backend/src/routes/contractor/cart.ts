import { Router } from 'express';
import { PrismaClient, OrderStatus } from '@prisma/client';
import { z } from 'zod';
import type { AuthRequest } from '../../middleware/auth.js';

const prisma = new PrismaClient();
const router = Router();
const idParam = z.string().uuid('Invalid uuid');

// View cart
router.get('/', async (req: AuthRequest, res) => {
  const items = await prisma.cartItem.findMany({ where: { contractorId: req.user!.userId }, include: { product: true } });
  return res.json({ items });
});

// Add item
const itemSchema = z.object({ productId: idParam, quantity: z.number().int().positive() });
router.post('/items', async (req: AuthRequest, res) => {
  const parse = itemSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ errors: parse.error.flatten() });
  const existing = await prisma.cartItem.findFirst({ where: { contractorId: req.user!.userId, productId: parse.data.productId } });
  const item = existing
    ? await prisma.cartItem.update({ where: { id: existing.id }, data: { quantity: existing.quantity + parse.data.quantity } })
    : await prisma.cartItem.create({ data: { contractorId: req.user!.userId, ...parse.data } });
  return res.status(201).json({ item });
});

// Update quantity
const qtySchema = z.object({ quantity: z.number().int().positive() });
router.patch('/items/:itemId', async (req: AuthRequest, res) => {
  const itemRes = idParam.safeParse(req.params.itemId);
  if (!itemRes.success) return res.status(400).json({ message: itemRes.error.message });
  const parse = qtySchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ errors: parse.error.flatten() });
  const item = await prisma.cartItem.findUnique({ where: { id: itemRes.data } });
  if (!item || item.contractorId !== req.user!.userId) return res.status(404).json({ message: 'Item not found' });
  const updated = await prisma.cartItem.update({ where: { id: item.id }, data: { quantity: parse.data.quantity } });
  return res.json({ item: updated });
});

// Delete
router.delete('/items/:itemId', async (req: AuthRequest, res) => {
  const itemRes = idParam.safeParse(req.params.itemId);
  if (!itemRes.success) return res.status(400).json({ message: itemRes.error.message });
  await prisma.cartItem.deleteMany({ where: { id: itemRes.data, contractorId: req.user!.userId } });
  return res.status(204).end();
});

// Checkout
const checkoutSchema = z.object({ supplierId: idParam.optional(), deliveryMethod: z.string().optional() });
router.post('/checkout', async (req: AuthRequest, res) => {
  const parse = checkoutSchema.safeParse(req.body ?? {});
  if (!parse.success) return res.status(400).json({ errors: parse.error.flatten() });

  const cartItems = await prisma.cartItem.findMany({ where: { contractorId: req.user!.userId }, include: { product: true } });
  if (!cartItems.length) return res.status(400).json({ message: 'Cart is empty' });

  const firstItem = cartItems[0]!;
  const supplierId = parse.data.supplierId ?? firstItem.product!.supplierId;
  const subtotal = cartItems.reduce((acc, i) => acc + Number(i.product!.price) * i.quantity, 0);
  const tax = subtotal * 0.18;
  const shipping = 0;
  const total = subtotal + tax + shipping;

  const order = await prisma.$transaction(async tx => {
    const newOrder = await tx.order.create({
      data: { contractorId: req.user!.userId, supplierId, total, subtotal, tax, shipping, status: OrderStatus.pending }
    });
    for (const item of cartItems) {
      await tx.orderItem.create({
        data: {
          orderId: newOrder.id,
          productId: item.productId,
          qty: item.quantity,
          unitPrice: item.product.price,
          subtotal: Number(item.product.price) * item.quantity
        }
      });
    }
    await tx.cartItem.deleteMany({ where: { contractorId: req.user!.userId } });
    return newOrder;
  });

  return res.status(201).json({ order });
});

export default router;
