import { Router } from 'express';
import { PrismaClient, ProjectStatus } from '@prisma/client';
import { authenticate, authorize } from '../middleware/auth.js';

const prisma = new PrismaClient();
export const adminRouter = Router();

adminRouter.get('/stats', authenticate, authorize('admin'), async (_req, res) => {
  try {
    // compte utilisateurs par rôle
    const [contractorCount, supplierCount, adminCount] = await Promise.all([
      prisma.user.count({ where: { role: 'contractor' } }),
      prisma.user.count({ where: { role: 'supplier' } }),
      prisma.user.count({ where: { role: 'admin' } })
    ]);

    // chiffre d'affaires par mois (6 derniers mois)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    const monthlyRevenueRaw = await prisma.order.findMany({
      where: { orderDate: { gte: sixMonthsAgo } },
      select: {
        total: true,
        orderDate: true
      }
    });
    const monthlyMap: Record<string, number> = {};
    monthlyRevenueRaw.forEach(o => {
      if (!o.orderDate) return;
      const key = o.orderDate.toLocaleString('default', { month: 'short' });
      monthlyMap[key] = (monthlyMap[key] || 0) + Number(o.total);
    });
    const monthlyRevenue = Object.entries(monthlyMap).map(([month, revenue]) => ({ month, revenue }));

    const [totalUsers, activeUsers, pendingUsers, activeProjects, totalOrders, revenueAgg] = await Promise.all([
      // "Actif" peut être affiné (isActive, lastSeen, etc.). Ici on compte tous les utilisateurs vérifiés ou tous.
      prisma.user.count(),
      // Utilisateurs actifs (isVerified = true)
      prisma.user.count({ where: { isVerified: true } }),
      // Comptes en attente (isVerified = false)
      prisma.user.count({ where: { isVerified: false } }),

      // Projets dont le statut est en cours (in_progress)
      prisma.project.count({ where: { status: ProjectStatus.in_progress } }),

      // Nombre total de commandes
      prisma.order.count(),

      // Somme du chiffre d'affaires
      prisma.order.aggregate({ _sum: { total: true } })
    ]);

    return res.json({
      usersByRole: {
        contractors: contractorCount,
        suppliers: supplierCount,
        admins: adminCount
      },
      monthlyRevenue,
      totalUsers,
      activeUsers,
      pendingUsers,
      activeProjects,
      totalOrders,
      totalRevenue: revenueAgg._sum.total ?? 0
    });
  } catch (error) {
    console.error('Failed to load admin stats:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});
