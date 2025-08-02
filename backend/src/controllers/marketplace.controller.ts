import { PrismaClient } from '@prisma/client';
import type { Request, Response } from 'express';

const prisma = new PrismaClient();

export async function listProducts(req: Request, res: Response) {
  const {
    category,
    q,
    minPrice,
    maxPrice,
    sort = 'popularity',
    page = '1',
    limit = '40',
  } = req.query as Record<string, string | undefined>;

  const take = Math.min(parseInt(limit, 10) || 40, 100);
  const skip = (parseInt(page, 10) - 1) * take;

  const where: any = { inStock: true };
  if (category) where.category = { name: category };
  if (q) where.name = { contains: q, mode: 'insensitive' };
  if (minPrice) where.price = { gte: Number(minPrice) };
  if (maxPrice) where.price = { ...(where.price || {}), lte: Number(maxPrice) };

  const orderBy: any = {};
  switch (sort) {
    case 'price-asc':
      orderBy.price = 'asc';
      break;
    case 'price-desc':
      orderBy.price = 'desc';
      break;
    case 'newest':
      orderBy.createdAt = 'desc';
      break;
    default:
      orderBy.createdAt = 'desc';
  }

  const products = await prisma.product.findMany({
    where,
    include: {
      category: { select: { name: true } },
      supplier: {
        select: {
          firstName: true,
          lastName: true,
          supplierProfile: { select: { rating: true, reviews: true } },
        },
      }
    },
    orderBy,
    take,
    skip,
  });

  const mapped = products.map((p) => ({
    id: p.id,
    name: p.name,
    price: Number(p.price),
    unit: 'pièce',
    image: Array.isArray(p.images) && p.images.length ? p.images[0] : null,
    category: p.category?.name ?? 'Autre',
    supplier: `${p.supplier?.firstName ?? ''} ${p.supplier?.lastName ?? ''}`.trim() || 'Fournisseur',
    rating: (p.supplier?.supplierProfile as any)?.rating ?? 5,
    reviews: (p.supplier?.supplierProfile as any)?.reviews ?? 0,
    inStock: p.stock > 0,
    discount: p.discount,
  }));

  return res.json(mapped);
}
