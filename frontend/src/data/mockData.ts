// Mock data for SmartChantier application

export const mockProjects = [
  {
    id: '1',
    name: 'Centre Commercial Plateau',
    description: 'Construction d\'un centre commercial moderne de 15 000 m²',
    location: 'Abidjan, Plateau',
    coordinates: { lat: 5.316667, lng: -4.033333 },
    progress: 75,
    status: 'En cours',
    priority: 'Haute',
    budget: 2500000,
    spent: 1875000,
    team: 12,
    deadline: '2024-03-15',
    startDate: '2023-08-01',
    client: 'SOGEMAP',
    contractor: 'BTP Plateau SARL',
    tasks: {
      total: 24,
      completed: 18,
      pending: 6,
      overdue: 2
    },
    alerts: 2,
    image: '🏢',
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
    budget: 1800000,
    spent: 810000,
    team: 8,
    deadline: '2024-05-20',
    startDate: '2023-11-01',
    client: 'SICOGI',
    contractor: 'Construction Moderne SARL',
    tasks: {
      total: 32,
      completed: 14,
      pending: 18,
      overdue: 0
    },
    alerts: 0,
    image: '🏘️',
    phases: [
      { name: 'Terrassement', progress: 100, status: 'Terminé' },
      { name: 'Fondations', progress: 90, status: 'En cours' },
      { name: 'Structure', progress: 30, status: 'En cours' },
      { name: 'Couverture', progress: 0, status: 'En attente' },
      { name: 'Finitions', progress: 0, status: 'En attente' }
    ]
  }
];

export const mockProducts = [
  {
    id: '1',
    name: 'Ciment Portland CEM II 42.5',
    description: 'Ciment de haute qualité conforme aux normes EN 197-1',
    price: 8500,
    originalPrice: 9500,
    unit: 'sac 50kg',
    image: '🏗️',
    category: 'Ciment',
    subcategory: 'Ciment Portland',
    supplier: {
      id: 'sup1',
      name: 'CIMAF',
      location: 'Abidjan',
      distance: 2.5,
      rating: 4.8,
      verified: true
    },
    rating: 4.8,
    reviews: 156,
    inStock: true,
    stockQuantity: 2500,
    minOrder: 10,
    discount: 10,
    features: ['Prise rapide', 'Haute résistance', 'Faible retrait'],
    specifications: {
      'Résistance à 28 jours': '42.5 MPa',
      'Temps de prise': '2-4 heures',
      'Finesse Blaine': '3200 cm²/g'
    },
    deliveryTime: '24-48h',
    warranty: '6 mois'
  },
  {
    id: '2',
    name: 'Fer à béton HA 12mm',
    description: 'Barres d\'armature haute adhérence qualité B500B',
    price: 650000,
    unit: 'tonne',
    image: '🔩',
    category: 'Fer à béton',
    subcategory: 'Barres HA',
    supplier: {
      id: 'sup2',
      name: 'SIDERCEM',
      location: 'San Pedro',
      distance: 4.2,
      rating: 4.9,
      verified: true
    },
    rating: 4.9,
    reviews: 89,
    inStock: true,
    stockQuantity: 50,
    minOrder: 1,
    discount: null,
    features: ['Haute adhérence', 'Résistant à la corrosion', 'Facile à façonner'],
    specifications: {
      'Limite élastique': '500 MPa',
      'Allongement': '≥ 12%',
      'Diamètre': '12 mm'
    },
    deliveryTime: '48-72h',
    warranty: '12 mois'
  }
];

export const mockOrders = [
  {
    id: 'CMD-2024-001',
    client: {
      id: '1',
      name: 'BTP Plateau SARL',
      contact: 'Kouassi ADJEI',
      phone: '+225 01 02 03 04 05'
    },
    project: 'Centre Commercial Plateau',
    items: [
      {
        productId: '1',
        name: 'Ciment Portland CEM II 42.5',
        quantity: 200,
        unitPrice: 8500,
        total: 1700000
      },
      {
        productId: '2',
        name: 'Fer à béton HA 12mm',
        quantity: 2,
        unitPrice: 650000,
        total: 1300000
      }
    ],
    subtotal: 3000000,
    tax: 540000,
    shipping: 50000,
    total: 3590000,
    status: 'Livré',
    paymentStatus: 'Payé',
    orderDate: '2024-01-20',
    deliveryDate: '2024-01-22',
    shippingAddress: {
      street: 'Boulevard de la République',
      city: 'Abidjan',
      district: 'Plateau',
      country: 'Côte d\'Ivoire'
    },
    trackingNumber: 'SC240120001',
    deliveryMethod: 'express'
  },
  {
    id: 'CMD-2024-002',
    client: {
      id: '2',
      name: 'Construction Moderne',
      contact: 'Marie KOFFI',
      phone: '+225 02 03 04 05 06'
    },
    project: 'Résidence Les Palmiers',
    items: [
      {
        productId: '3',
        name: 'Casque de sécurité blanc',
        quantity: 15,
        unitPrice: 15000,
        total: 225000
      }
    ],
    subtotal: 225000,
    tax: 40500,
    shipping: 15000,
    total: 280500,
    status: 'En transit',
    paymentStatus: 'Payé',
    orderDate: '2024-01-19',
    deliveryDate: '2024-01-24',
    shippingAddress: {
      street: 'Rue des Jardins',
      city: 'Abidjan',
      district: 'Cocody',
      country: 'Côte d\'Ivoire'
    },
    trackingNumber: 'SC240119002',
    deliveryMethod: 'standard'
  }
];

export const mockSuppliers = [
  {
    id: 'sup1',
    name: 'CIMAF Distribution',
    description: 'Leader africain dans la production et distribution de ciment',
    logo: '🏭',
    location: 'Zone Industrielle de Vridi, Abidjan',
    coordinates: { lat: 5.244444, lng: -3.966667 },
    contact: {
      email: 'contact@cimaf.ci',
      phone: '+225 21 75 89 00',
      website: 'www.cimaf.ci'
    },
    rating: 4.8,
    reviews: 234,
    verified: true,
    since: '2015',
    categories: ['Ciment', 'Béton prêt', 'Granulats'],
    productsCount: 45,
    totalOrders: 1250,
    deliveryZones: ['Abidjan', 'Bouaké', 'San Pedro', 'Yamoussoukro'],
    certifications: ['ISO 9001', 'ISO 14001', 'OHSAS 18001'],
    stats: {
      onTimeDelivery: 95,
      customerSatisfaction: 4.8,
      responseTime: 2
    }
  },
  {
    id: 'sup2',
    name: 'SIDERCEM',
    description: 'Spécialiste de l\'acier pour construction et béton armé',
    logo: '⚡',
    location: 'Zone Portuaire, San Pedro',
    coordinates: { lat: 4.766667, lng: -6.633333 },
    contact: {
      email: 'info@sidercem.ci',
      phone: '+225 34 71 25 00',
      website: 'www.sidercem.ci'
    },
    rating: 4.9,
    reviews: 156,
    verified: true,
    since: '2012',
    categories: ['Fer à béton', 'Profilés', 'Tôles'],
    productsCount: 78,
    totalOrders: 890,
    deliveryZones: ['San Pedro', 'Abidjan', 'Gagnoa', 'Man'],
    certifications: ['ISO 9001', 'CE Marking'],
    stats: {
      onTimeDelivery: 98,
      customerSatisfaction: 4.9,
      responseTime: 1
    }
  }
];

export const mockAnalytics = {
  dashboard: {
    totalRevenue: 2400000,
    revenueGrowth: 12.5,
    activeProjects: 8,
    projectsGrowth: 2,
    ordersThisMonth: 156,
    ordersGrowth: 23,
    activeUsers: 1247,
    usersGrowth: 8.2
  },
  sales: {
    monthlyRevenue: [
      { month: 'Jan', revenue: 1800000 },
      { month: 'Fév', revenue: 2100000 },
      { month: 'Mar', revenue: 1950000 },
      { month: 'Avr', revenue: 2400000 },
      { month: 'Mai', revenue: 2200000 },
      { month: 'Jun', revenue: 2600000 }
    ],
    topProducts: [
      { name: 'Ciment Portland', sales: 145, revenue: 1232500, growth: 15 },
      { name: 'Fer à béton HA 12mm', sales: 89, revenue: 892300, growth: 8 },
      { name: 'Carrelage 60x60', sales: 67, revenue: 673200, growth: 22 },
      { name: 'Casques de sécurité', sales: 234, revenue: 351000, growth: 31 }
    ]
  },
  security: {
    complianceRate: 87,
    activeAlerts: 3,
    resolvedIncidents: 24,
    inspectionsThisMonth: 12,
    trends: {
      compliance: [85, 86, 84, 87, 89, 87],
      incidents: [8, 6, 7, 5, 4, 3],
      inspections: [10, 12, 15, 12, 14, 12]
    }
  }
};

export const mockNotifications = [
  {
    id: '1',
    type: 'order',
    title: 'Nouvelle commande reçue',
    message: 'Commande CMD-2024-003 de BTP Plateau SARL',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    read: false,
    priority: 'high'
  },
  {
    id: '2',
    type: 'security',
    title: 'Alerte sécurité',
    message: 'Zone non balisée détectée sur le chantier Plateau',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    read: false,
    priority: 'critical'
  },
  {
    id: '3',
    type: 'delivery',
    title: 'Livraison terminée',
    message: 'Commande CMD-2024-001 livrée avec succès',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    read: true,
    priority: 'normal'
  }
];

// Données mockées pour les tâches
export const mockTasks = [
  {
    id: '1',
    title: 'Coulage des fondations',
    description: 'Coulage du béton pour les fondations du bâtiment principal',
    projectId: '1',
    assignee: 'Kouadio Jean',
    priority: 'Haute',
    status: 'En cours',
    dueDate: '2024-02-15',
    progress: 60,
    checklist: [
      { id: '1', task: 'Préparation du ferraillage', completed: true },
      { id: '2', task: 'Vérification des coffrages', completed: true },
      { id: '3', task: 'Commande du béton', completed: false },
      { id: '4', task: 'Coulage', completed: false }
    ],
    photos: ['photo1.jpg', 'photo2.jpg']
  },
  {
    id: '2',
    title: 'Installation électrique',
    description: 'Installation du réseau électrique principal',
    projectId: '1',
    assignee: 'Koné Marie',
    priority: 'Moyenne',
    status: 'En attente',
    dueDate: '2024-02-20',
    progress: 0,
    checklist: [
      { id: '1', task: 'Étude du plan électrique', completed: false },
      { id: '2', task: 'Commande des câbles', completed: false },
      { id: '3', task: 'Installation des gaines', completed: false }
    ],
    photos: []
  }
];

// Données mockées pour le panier
export const mockCart = [
  {
    id: '1',
    productId: '1',
    name: 'Ciment Portland CEM II 42.5',
    price: 8500,
    quantity: 50,
    unit: 'sac 50kg',
    image: '🏗️',
    supplier: 'CIMAF'
  },
  {
    id: '2',
    productId: '2',
    name: 'Fer à béton HA 12mm',
    price: 650000,
    quantity: 1,
    unit: 'tonne',
    image: '🔩',
    supplier: 'SIDERCEM'
  }
];

// Données mockées pour les livraisons
export const mockDeliveries = [
  {
    id: 'DEL-001',
    orderId: 'CMD-2024-001',
    status: 'En transit',
    driverName: 'Mamadou DIALLO',
    driverPhone: '+225 09 10 11 12 13',
    vehicleInfo: 'Camion Iveco - AB 123 CD',
    estimatedTime: '45 min',
    distance: '12.5 km',
    startLocation: { lat: 5.244444, lng: -3.966667, name: 'CIMAF Vridi' },
    destination: { lat: 5.316667, lng: -4.033333, name: 'Chantier Plateau' },
    trackingPoints: [
      { lat: 5.244444, lng: -3.966667, timestamp: '10:00', status: 'Départ' },
      { lat: 5.280000, lng: -3.950000, timestamp: '10:15', status: 'En route' },
      { lat: 5.300000, lng: -4.000000, timestamp: '10:30', status: 'En route' }
    ]
  }
];

// Données mockées pour l'administration
export const mockAdminStats = {
  totalUsers: 1247,
  activeProjects: 156,
  totalOrders: 3450,
  revenue: 85000000,
  usersByRole: {
    contractors: 856,
    suppliers: 234,
    admins: 12
  },
  securityAlerts: [
    {
      id: '1',
      projectId: '1',
      type: 'Équipement manquant',
      severity: 'Critique',
      description: 'Absence de casques sur zone active',
      location: 'Centre Commercial Plateau',
      timestamp: '2024-01-25 14:30'
    },
    {
      id: '2',
      projectId: '2',
      type: 'Zone non balisée',
      severity: 'Élevée',
      description: 'Périmètre de sécurité non délimité',
      location: 'Résidence Les Palmiers',
      timestamp: '2024-01-25 09:15'
    }
  ],
  systemLogs: [
    {
      id: '1',
      action: 'USER_LOGIN',
      userId: '1',
      details: 'Connexion réussie',
      timestamp: '2024-01-25 08:30',
      ip: '192.168.1.100'
    },
    {
      id: '2',
      action: 'ORDER_CREATED',
      userId: '3',
      details: 'Nouvelle commande CMD-2024-003',
      timestamp: '2024-01-25 10:45',
      ip: '192.168.1.101'
    }
  ]
};

// Données mockées pour les statistiques client
export const mockClientStats = {
  totalSpent: 5400000,
  ordersCount: 24,
  activeProjects: 3,
  completionRate: 87,
  monthlySpending: [
    { month: 'Oct', amount: 800000 },
    { month: 'Nov', amount: 1200000 },
    { month: 'Déc', amount: 950000 },
    { month: 'Jan', amount: 1450000 }
  ],
  materialDistribution: [
    { name: 'Ciment', value: 35, amount: 1890000 },
    { name: 'Fer à béton', value: 28, amount: 1512000 },
    { name: 'Carrelage', value: 18, amount: 972000 },
    { name: 'Peinture', value: 19, amount: 1026000 }
  ],
  securityScore: 94,
  averageDelay: 2.3
};