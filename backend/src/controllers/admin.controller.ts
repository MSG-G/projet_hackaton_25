import { Request, Response } from 'express';
import prisma from '../lib/prisma.js';
import { authorize } from '../middleware/auth.js';
import { ProjectStatus } from '@prisma/client';

export const getStats = async (_req: Request, res: Response) => {
  try {
    const [contractorCount, supplierCount, adminCount] = await Promise.all([
      prisma.user.count({ where: { role: 'contractor' } }),
      prisma.user.count({ where: { role: 'supplier' } }),
      prisma.user.count({ where: { role: 'admin' } }),
    ]);

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);

    const monthlyRevenueRaw = await prisma.order.findMany({
      where: { orderDate: { gte: sixMonthsAgo } },
      select: {
        total: true,
        orderDate: true,
      },
    });

    const monthlyMap: Record<string, number> = {};
    monthlyRevenueRaw.forEach((o) => {
      if (!o.orderDate) return;
      const key = o.orderDate.toLocaleString('default', { month: 'short' });
      monthlyMap[key] = (monthlyMap[key] || 0) + Number(o.total);
    });
    const monthlyRevenue = Object.entries(monthlyMap).map(([month, revenue]) => ({
      month,
      revenue,
    }));

    const [totalUsers, activeUsers, pendingUsers, activeProjects, totalOrders, revenueAgg] =
      await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { isVerified: true } }),
        prisma.user.count({ where: { isVerified: false } }),
        prisma.project.count({ where: { status: ProjectStatus.in_progress } }),
        prisma.order.count(),
        prisma.order.aggregate({ _sum: { total: true } }),
      ]);

    return res.json({
      usersByRole: {
        contractors: contractorCount,
        suppliers: supplierCount,
        admins: adminCount,
      },
      monthlyRevenue,
      totalUsers,
      activeUsers,
      pendingUsers,
      activeProjects,
      totalOrders,
      totalRevenue: revenueAgg._sum.total ?? 0,
    });
  } catch (err) {
    console.error('Failed to load admin stats:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
