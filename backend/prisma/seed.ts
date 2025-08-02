import {
  PrismaClient,
  UserRole,
  ProjectStatus,
  PriorityLevel,
  TaskStatus,
  OrderStatus,
  DeliveryStatus,
  PhaseStatus
} from '@prisma/client';

const prisma = new PrismaClient();


const mockProjects = [
  {
    id: '1',
    name: 'Centre Commercial Plateau',
    description: "Construction d'un centre commercial moderne de 15 000 m²",
    location: 'Abidjan, Plateau',
    coordinates: { lat: 5.316667, lng: -4.033333 },
    progress: 75,
    status: 'En cours',
    priority: 'Haute',
    budget: 2_500_000,
    spent: 1_875_000,
    team: 12,
    deadline: '2024-03-15',
    startDate: '2023-08-01',
    client: 'SOGEMAP',
    contractor: 'BTP Plateau SARL',
    phases: [
      { name: 'Terrassement', progress: 100, status: 'Terminé' },
      { name: 'Fondations', progress: 100, status: 'Terminé' },
      { name: 'Structure', progress: 85, status: 'En cours' },
      { name: 'Couverture', progress: 60, status: 'En cours' },
      { name: 'Finitions', progress: 0, status: 'En attente' }
    ]
  },
  {
    id: '2',
    name: 'Résidence Les Palmiers',
    description: 'Complexe résidentiel de 45 logements avec piscine',
    location: 'Cocody, Abidjan',
    coordinates: { lat: 5.348056, lng: -3.987222 },
    progress: 45,
    status: 'En cours',
    priority: 'Moyenne',
    budget: 1_800_000,
    spent: 810_000,
    team: 8,
    deadline: '2024-05-20',
    startDate: '2023-11-01',
    client: 'SICOGI',
    contractor: 'Construction Moderne SARL',
    phases: [
      { name: 'Terrassement', progress: 100, status: 'Terminé' },
      { name: 'Fondations', progress: 90, status: 'En cours' },
      { name: 'Structure', progress: 30, status: 'En cours' },
      { name: 'Couverture', progress: 0, status: 'En attente' },
      { name: 'Finitions', progress: 0, status: 'En attente' }
    ]
  }
] as const;

const mockSuppliers = [
  {
    id: 'sup1',
    name: 'CIMAF Distribution',
    description: 'Leader africain dans la production et distribution de ciment',
    logo: '🏭',
    location: 'Zone Industrielle de Vridi, Abidjan',
    coordinates: { lat: 5.244444, lng: -3.966667 },
    rating: 4.8,
    reviews: 234,
    verified: true,
    since: '2015',
    categories: ['Ciment', 'Béton prêt', 'Granulats'],
    stats: { onTimeDelivery: 95, customerSatisfaction: 4.8, responseTime: 2 }
  },
  {
    id: 'sup2',
    name: 'SIDERCEM',
    description: "Spécialiste de l'acier pour construction et béton armé",
    logo: '⚡',
    location: 'Zone Portuaire, San Pedro',
    coordinates: { lat: 4.766667, lng: -6.633333 },
    rating: 4.9,
    reviews: 156,
    verified: true,
    since: '2012',
    categories: ['Fer à béton', 'Profilés', 'Tôles'],
    stats: { onTimeDelivery: 98, customerSatisfaction: 4.9, responseTime: 1 }
  }
] as const;

const mockProducts = [
  {
    id: '1',
    name: 'Ciment Portland CEM II 42.5',
    description: 'Ciment de haute qualité conforme aux normes EN 197-1',
    price: 8_500,
    image: '🏗️',
    category: 'Ciment',
    supplier: { name: 'CIMAF Distribution' },
    stockQuantity: 2500,
    inStock: true,
    discount: 10,
    features: ['Prise rapide', 'Haute résistance', 'Faible retrait'],
    specifications: { 'Résistance à 28 jours': '42.5 MPa' }
  },
  {
    id: '2',
    name: 'Fer à béton HA 12mm',
    description: "Barres d'armature haute adhérence qualité B500B",
    price: 650_000,
    image: '🔩',
    category: 'Fer à béton',
    supplier: { name: 'SIDERCEM' },
    stockQuantity: 50,
    inStock: true,
    discount: null,
    features: ['Haute adhérence', 'Résistant à la corrosion'],
    specifications: { Diamètre: '12 mm' }
  }
] as const;

const mockOrders = [
  {
    id: 'CMD-2024-001',
    client: { name: 'BTP Plateau SARL' },
    project: 'Centre Commercial Plateau',
    items: [
      { name: 'Ciment Portland CEM II 42.5', quantity: 200, unitPrice: 8500, total: 1_700_000 },
      { name: 'Fer à béton HA 12mm', quantity: 2, unitPrice: 650_000, total: 1_300_000 }
    ],
    subtotal: 3_000_000,
    tax: 540_000,
    shipping: 50_000,
    total: 3_590_000,
    status: 'Livré',
    paymentStatus: 'Payé',
    orderDate: '2024-01-20',
    deliveryDate: '2024-01-22',
    shippingAddress: { city: 'Abidjan' },
    trackingNumber: 'SC240120001',
    deliveryMethod: 'express'
  }
] as const;

const mockTasks = [
  {
    id: '1',
    title: 'Coulage des fondations',
    projectId: '1',
    priority: 'Haute',
    status: 'En cours',
    dueDate: '2024-02-15',
    progress: 60,
    checklist: [
      { task: 'Préparation du ferraillage', completed: true },
      { task: 'Vérification des coffrages', completed: true },
      { task: 'Commande du béton', completed: false }
    ]
  }
] as const;

const mockNotifications = [
  {
    id: '1',
    type: 'order',
    title: 'Nouvelle commande reçue',
    message: 'Commande CMD-2024-003 de BTP Plateau SARL',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    read: false,
    priority: 'high'
  }
] as const;


// Additional mock data for remaining tables -------------------------------

const mockPayments = [
  {
    provider: 'manual',
    amount: 3_590_000,
    currency: 'XOF',
    status: 'succeeded'
  }
] as const;

const mockFileUploads = [
  {
    originalName: 'plan_phase1.pdf',
    mimeType: 'application/pdf',
    size: 2_560_000,
    path: '/uploads/plan_phase1.pdf'
  }
] as const;

const mockCartItems = [
  {
    productName: 'Ciment Portland CEM II 42.5',
    quantity: 20
  }
] as const;

const mockAuditLogs = [
  {
    action: 'USER_LOGIN',
    target: 'auth',
    beforeData: null,
    afterData: { ip: '192.168.1.100' }
  }
] as const;

const mockApiKeys = [
  {
    scopes: ['read', 'write']
  }
] as const;

const mockAnalyticsSnapshots = [
  {
    data: { activeUsers: 123, salesToday: 450000, orders: 12 }
  }
] as const;


const slug = (str: string) => str.toLowerCase().replace(/\s+/g, '_');


async function main() {
  for (const s of mockSuppliers) {
    await prisma.user.upsert({
      where: { email: slug(s.name) + '@example.com' },
      update: {},
      create: {
        email: slug(s.name) + '@example.com',
        role: UserRole.supplier,
        firstName: s.name.split(' ')[0] ?? null,
        lastName: s.name.split(' ').slice(1).join(' '),
        supplierProfile: {
          create: {
            logo: s.logo,
            description: s.description,
            location: s.location,
            coordinates: s.coordinates as any,
            rating: s.rating,
            reviews: s.reviews,
            verified: s.verified,
            since: s.since,
            categories: s.categories.join(','),
            stats: s.stats as any
          }
        }
      }
    });
  }

  for (const p of mockProjects) {
    await prisma.user.upsert({
      where: { email: slug(p.contractor) + '@example.com' },
      update: {},
      create: {
        email: slug(p.contractor) + '@example.com',
        role: UserRole.contractor,
        firstName: p.contractor.split(' ')[0] ?? null,
        lastName: p.contractor.split(' ').slice(1).join(' ')
      }
    });
  }

  const categoryCache: Record<string, string> = {};
  for (const pr of mockProducts) {
    let categoryId = categoryCache[pr.category];
    if (!categoryId) {
      const cat = await prisma.productCategory.create({ data: { name: pr.category } });
      categoryId = cat.id;
      categoryCache[pr.category] = cat.id;
    }

    const supplier = await prisma.user.findUnique({ where: { email: slug(pr.supplier.name) + '@example.com' } });
    if (!supplier) continue;

    await prisma.product.create({
      data: {
        name: pr.name,
        description: pr.description,
        price: pr.price,
        currency: 'XOF',
        stock: pr.stockQuantity ?? 0,
        images: [pr.image] as any,
        inStock: pr.inStock,
        discount: pr.discount as number | null,
        features: pr.features as any,
        specifications: pr.specifications as any,
        supplier: { connect: { id: supplier.id } },
        category: { connect: { id: categoryId } }
      }
    });
  }

  for (const proj of mockProjects) {
    const contractor = await prisma.user.findUnique({ where: { email: slug(proj.contractor) + '@example.com' } });
    if (!contractor) continue;

    const dbProj = await prisma.project.create({
      data: {
        title: proj.name,
        description: proj.description,
        location: proj.location,
        coordinates: proj.coordinates as any,
        status: ProjectStatus.in_progress,
        priority:
          proj.priority === 'Haute' ? PriorityLevel.high : proj.priority === 'Moyenne' ? PriorityLevel.medium : PriorityLevel.low,
        budget: proj.budget,
        spent: proj.spent,
        progress: proj.progress,
        team: proj.team,
        startDate: proj.startDate ? new Date(proj.startDate) : null,
        deadline: proj.deadline ? new Date(proj.deadline) : null,
        contractor: { connect: { id: contractor.id } }
      }
    });

    await prisma.phase.createMany({
      data: proj.phases.map((ph, idx) => ({
        projectId: dbProj.id,
        order: idx,
        name: ph.name,
        progress: ph.progress,
        status:
          ph.status === 'Terminé' ? PhaseStatus.completed : ph.status === 'En cours' ? PhaseStatus.in_progress : PhaseStatus.pending
      }))
    });
  }

  for (const t of mockTasks) {
    const project = await prisma.project.findFirst({ where: { id: t.projectId } });
    if (!project) continue;

    await prisma.task.create({
      data: {
        projectId: project.id,
        title: t.title,
        priority: t.priority === 'Haute' ? PriorityLevel.high : PriorityLevel.medium,
        status: t.status === 'En cours' ? TaskStatus.in_progress : TaskStatus.todo,
        dueDate: t.dueDate ? new Date(t.dueDate) : null,
        progress: t.progress,
        checklist: {
          createMany: {
            data: t.checklist.map(c => ({ title: c.task, completed: c.completed }))
          }
        }
      }
    });
  }

  for (const o of mockOrders) {
    const contractor = await prisma.user.findUnique({ where: { email: slug(o.client.name) + '@example.com' } });
    if (!contractor) continue;

    const supplierName = o.items[0].name.includes('Ciment') ? 'CIMAF Distribution' : 'SIDERCEM';
    const supplier = await prisma.user.findUnique({ where: { email: slug(supplierName) + '@example.com' } });

    const project = await prisma.project.findFirst({ where: { title: o.project } });

    const orderData: any = {
        total: o.total,
        subtotal: o.subtotal,
        tax: o.tax,
        shipping: o.shipping,
        currency: 'XOF',
        status: OrderStatus.delivered,
        paymentStatus: o.paymentStatus,
        orderDate: new Date(o.orderDate),
        deliveryDate: new Date(o.deliveryDate),
        shippingAddress: o.shippingAddress as any,
        trackingNumber: o.trackingNumber,
        deliveryMethod: o.deliveryMethod as any,
        contractor: { connect: { id: contractor.id } },
        ...(supplier ? { supplier: { connect: { id: supplier.id } } } : {}),
        ...(project ? { project: { connect: { id: project.id } } } : {})
      };

    const order = await prisma.order.create({ data: orderData });

    for (const it of o.items) {
      const prod = await prisma.product.findFirst({ where: { name: it.name } });
      if (!prod) continue;
      await prisma.orderItem.create({ data: { orderId: order.id, productId: prod.id, qty: it.quantity, unitPrice: it.unitPrice, subtotal: it.total } });
    }

    await prisma.delivery.create({
      data: { orderId: order.id, status: DeliveryStatus.delivered, trackingNumber: o.trackingNumber }
    });
  }

  const firstOrder = await prisma.order.findFirst();
  if (firstOrder) {
    for (const pay of mockPayments) {
      await prisma.payment.create({
        data: {
          orderId: firstOrder.id,
          provider: 'manual',
          amount: pay.amount,
          currency: pay.currency,
          status: pay.status
        }
      });
    }
  }


  const owner = await prisma.user.findFirst();
  if (owner) {
    for (const f of mockFileUploads) {
      await prisma.fileUpload.create({
        data: { ownerId: owner.id, ...f }
      });
    }
  }

  const firstContractor = await prisma.user.findFirst({ where: { role: 'contractor' } });
  const firstProduct = await prisma.product.findFirst();
  if (firstContractor && firstProduct) {
    await prisma.cartItem.create({
      data: {
        contractorId: firstContractor.id,
        productId: firstProduct.id,
        quantity: mockCartItems[0].quantity
      }
    });
  }

  if (owner) {
    await prisma.auditLog.create({
      data: {
        actorId: owner.id,
        action: mockAuditLogs[0].action,
        target: mockAuditLogs[0].target,
        beforeData: mockAuditLogs[0].beforeData as any,
        afterData: mockAuditLogs[0].afterData as any
      }
    });

    await prisma.apiKey.create({
      data: {
        userId: owner.id,
        key: 'demo-api-key',
        scopes: mockApiKeys[0].scopes as any
      }
    });
  }

  // Analytics snapshot
  await prisma.analyticsSnapshot.create({ data: { data: mockAnalyticsSnapshots[0].data } });

// 7. Notifications (attach to first contractor)
  const firstUser = await prisma.user.findFirst();
  if (firstUser) {
    await prisma.notification.createMany({
      data: mockNotifications.map(n => ({
        userId: firstUser.id,
        type: n.type as any,
        payload: { title: n.title, message: n.message } as any,
        priority: n.priority as any,
        isRead: n.read,
        createdAt: new Date(n.timestamp)
      }))
    });
  }

  console.log('Database seeded successfully');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });