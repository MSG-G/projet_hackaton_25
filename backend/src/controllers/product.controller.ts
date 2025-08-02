import { PrismaClient, OrderStatus } from '@prisma/client';
import type { Request, Response } from 'express';
import path from 'path';
import { z } from 'zod';

const prisma = new PrismaClient();

const productSchema = z.object({
  name: z.string().min(2),
  description: z.string().nullable().optional(),
  price: z.coerce.number().positive(),
  stock: z.coerce.number().int().nonnegative(),
  categoryId: z.string().uuid().optional(),
  images: z.array(z.string()).optional()
});
const updateProductSchema = productSchema.partial();

/* ----------------------------------------------------------------------- */
export async function getSummary(req: Request, res: Response) {
  // @ts-expect-error added in auth middleware
  const supplierId: string = req.user!.userId;
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);

  const [activeProducts, ordersThisMonth, revenueAgg] = await Promise.all([
    prisma.product.count({ where: { supplierId, stock: { gt: 0 } } }),
    prisma.order.count({
      where: {
        supplierId,
        createdAt: { gte: firstDay }
      }
    }),
    prisma.order.aggregate({
      _sum: { total: true },
      where: {
        supplierId,
        createdAt: { gte: firstDay },
        status: { in: [OrderStatus.paid, OrderStatus.shipped, OrderStatus.delivered] }
      }
    })
  ]);

  return res.json({ activeProducts, ordersThisMonth, revenueThisMonth: revenueAgg._sum.total ?? 0 });
}

export async function getCategories(_req: Request, res: Response) {
  const categories = await prisma.productCategory.findMany({ select: { id: true, name: true } });
  return res.json(categories);
}

export async function getProducts(req: Request, res: Response) {
  // @ts-expect-error added in auth middleware
  const supplierId: string = req.user!.userId;
  const products = await prisma.product.findMany({ where: { supplierId } });
  return res.json(products);
}

export async function createProduct(req: Request, res: Response) {
  // @ts-expect-error added in auth middleware
  const supplierId: string = req.user!.userId;

  const files = (req as any).files as Express.Multer.File[] ?? [];
  const images = files.map(f => `/uploads/${path.basename(f.path)}`);

  const parse = productSchema.safeParse({ ...req.body, images });
  if (!parse.success) return res.status(400).json({ errors: parse.error.flatten() });

  const data = parse.data;
  const product = await prisma.product.create({
    data: {
      ...data,
      description: data.description ?? null,
      supplierId,
      images: data.images as any,
      categoryId: data.categoryId ?? null
    }
  });
  return res.status(201).json(product);
}

export async function updateProduct(req: Request, res: Response) {
  // @ts-expect-error added in auth middleware
  const supplierId: string = req.user!.userId;
  const productId = req.params.id;
  if (!productId) return res.status(400).json({ message: 'ID manquant' });

  const existing = await prisma.product.findFirst({ where: { id: productId, supplierId } });
  if (!existing) return res.status(404).json({ message: 'Produit introuvable' });

  const files = (req as any).files as Express.Multer.File[] ?? [];
  const newImages = files.map(f => `/uploads/${path.basename(f.path)}`);

  const parse = updateProductSchema.safeParse({ ...req.body, images: newImages.length ? newImages : undefined });
  if (!parse.success) return res.status(400).json({ errors: parse.error.flatten() });

  const data: any = parse.data;
  if (data.images === undefined) delete data.images;
  if (data.categoryId === undefined) delete data.categoryId;

  const updated = await prisma.product.update({ where: { id: productId }, data });
  return res.json(updated);
}

export async function deleteProduct(req: Request, res: Response) {
  // @ts-expect-error added in auth middleware
  const supplierId: string = req.user!.userId;
  const productId = req.params.id;
  if (!productId) return res.status(400).json({ message: 'ID manquant' });

  const existing = await prisma.product.findFirst({ where: { id: productId, supplierId } });
  if (!existing) return res.status(404).json({ message: 'Produit introuvable' });

  await prisma.product.delete({ where: { id: productId } });
  return res.status(204).send();
}
