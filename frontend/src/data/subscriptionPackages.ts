// Données mockées pour les packages de souscription SmartChantier

export interface Package {
  id: string;
  name: string;
  type: 'contractor' | 'supplier';
  tier: 'starter' | 'pro' | 'enterprise' | 'essential' | 'business' | 'premium';
  price: number;
  billingPeriod: 'month' | 'year' | 'lifetime';
  currency: 'XOF' | 'USD';
  popular?: boolean;
  features: string[];
  limits: {
    projects?: number;
    products?: number;
    orders?: number;
    aiEnabled?: boolean;
    teamMembers?: number;
    storage?: string;
    support?: string;
  };
  badge?: string;
}

export interface Subscription {
  id: string;
  userId: string;
  packageId: string;
  status: 'active' | 'expired' | 'suspended' | 'pending';
  startDate: string;
  endDate?: string;
  renewalDate?: string;
  paymentMethod?: 'stripe' | 'orange_money' | 'wave' | 'bank_transfer';
  lastPaymentDate?: string;
  usage: {
    projects?: number;
    products?: number;
    orders?: number;
  };
}

// Packages pour les Chefs de chantier (Contractors)
export const contractorPackages: Package[] = [
  {
    id: 'contractor-starter',
    name: 'Starter',
    type: 'contractor',
    tier: 'starter',
    price: 0,
    billingPeriod: 'month',
    currency: 'XOF',
    badge: 'Gratuit',
    features: [
      '1 chantier actif maximum',
      '10 produits par commande',
      'Tableau de bord basique',
      'Support communautaire',
      'Accès marketplace'
    ],
    limits: {
      projects: 1,
      products: 10,
      orders: 3,
      aiEnabled: false,
      teamMembers: 1,
      storage: '500 MB',
      support: 'Communautaire'
    }
  },
  {
    id: 'contractor-pro',
    name: 'Pro',
    type: 'contractor',
    tier: 'pro',
    price: 25000,
    billingPeriod: 'month',
    currency: 'XOF',
    popular: true,
    badge: 'Populaire',
    features: [
      'Chantiers illimités',
      'Checklists IA activées',
      'Recommandations IA',
      'Suivi sécurité temps réel',
      'Statistiques détaillées',
      'Support prioritaire',
      'Notifications avancées'
    ],
    limits: {
      projects: -1, // illimité
      products: -1,
      orders: -1,
      aiEnabled: true,
      teamMembers: 5,
      storage: '10 GB',
      support: 'Prioritaire'
    }
  },
  {
    id: 'contractor-enterprise',
    name: 'Entreprise',
    type: 'contractor',
    tier: 'enterprise',
    price: 50000,
    billingPeriod: 'month',
    currency: 'XOF',
    badge: 'Premium',
    features: [
      'Toutes les fonctionnalités Pro',
      'Gestion d\'équipe multi-utilisateurs',
      'Historique illimité',
      'Export PDF/Excel rapports',
      'Support dédié 24/7',
      'Formation personnalisée',
      'API personnalisée'
    ],
    limits: {
      projects: -1,
      products: -1,
      orders: -1,
      aiEnabled: true,
      teamMembers: -1,
      storage: '100 GB',
      support: 'Dédié 24/7'
    }
  }
];

// Packages pour les Fournisseurs (Suppliers)
export const supplierPackages: Package[] = [
  {
    id: 'supplier-essential',
    name: 'Essentiel',
    type: 'supplier',
    tier: 'essential',
    price: 0,
    billingPeriod: 'month',
    currency: 'XOF',
    badge: 'Gratuit',
    features: [
      '5 produits actifs maximum',
      '3 commandes par mois',
      'Accès commandes basique',
      'Support communautaire'
    ],
    limits: {
      products: 5,
      orders: 3,
      aiEnabled: false,
      teamMembers: 1,
      storage: '200 MB',
      support: 'Communautaire'
    }
  },
  {
    id: 'supplier-business',
    name: 'Business',
    type: 'supplier',
    tier: 'business',
    price: 20000,
    billingPeriod: 'month',
    currency: 'XOF',
    popular: true,
    badge: 'Populaire',
    features: [
      'Produits illimités',
      'Commandes illimitées',
      'Statistiques de ventes',
      'Suggestions IA produits',
      'Mise en avant recherches',
      'Support prioritaire'
    ],
    limits: {
      products: -1,
      orders: -1,
      aiEnabled: true,
      teamMembers: 3,
      storage: '5 GB',
      support: 'Prioritaire'
    }
  },
  {
    id: 'supplier-premium',
    name: 'Premium Vendeur',
    type: 'supplier',
    tier: 'premium',
    price: 40000,
    billingPeriod: 'month',
    currency: 'XOF',
    badge: 'Premium',
    features: [
      'Toutes les fonctionnalités Business',
      'Page fournisseur personnalisée',
      'Badge vérifié',
      'Promotion dans recherches',
      'Suivi livraison IA',
      'Suggestions prix optimaux',
      'Support dédié'
    ],
    limits: {
      products: -1,
      orders: -1,
      aiEnabled: true,
      teamMembers: -1,
      storage: '50 GB',
      support: 'Dédié'
    }
  }
];

// Données mockées des souscriptions actuelles
export const mockSubscriptions: Subscription[] = [
  {
    id: 'sub-001',
    userId: '1', // Kouassi ADJEI (contractor)
    packageId: 'contractor-pro',
    status: 'active',
    startDate: '2024-01-01',
    endDate: '2024-02-01',
    renewalDate: '2024-02-01',
    paymentMethod: 'orange_money',
    lastPaymentDate: '2024-01-01',
    usage: {
      projects: 3,
      orders: 12
    }
  },
  {
    id: 'sub-002',
    userId: '3', // Supplier user
    packageId: 'supplier-business',
    status: 'active',
    startDate: '2024-01-15',
    endDate: '2024-02-15',
    renewalDate: '2024-02-15',
    paymentMethod: 'wave',
    lastPaymentDate: '2024-01-15',
    usage: {
      products: 45,
      orders: 8
    }
  }
];

// Données mockées des revenus par package (pour admin)
export const mockPackageRevenue = {
  monthly: {
    'contractor-pro': { subscribers: 156, revenue: 3900000 },
    'contractor-enterprise': { subscribers: 34, revenue: 1700000 },
    'supplier-business': { subscribers: 89, revenue: 1780000 },
    'supplier-premium': { subscribers: 23, revenue: 920000 }
  },
  totalRevenue: 8300000,
  conversions: {
    'contractor-starter-to-pro': 23,
    'contractor-pro-to-enterprise': 8,
    'supplier-essential-to-business': 15,
    'supplier-business-to-premium': 5
  }
};

// Helper functions
export const getAllPackages = (): Package[] => [...contractorPackages, ...supplierPackages];

export const getPackagesByType = (type: 'contractor' | 'supplier'): Package[] => {
  return type === 'contractor' ? contractorPackages : supplierPackages;
};

export const getPackageById = (id: string): Package | undefined => {
  return getAllPackages().find(pkg => pkg.id === id);
};

export const getUserSubscription = (userId: string): Subscription | undefined => {
  return mockSubscriptions.find(sub => sub.userId === userId);
};

export const formatPrice = (price: number, currency: 'XOF' | 'USD' = 'XOF'): string => {
  if (price === 0) return 'Gratuit';
  
  const formatter = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0
  });
  
  return formatter.format(price);
};

export const canUserAccess = (userId: string, feature: string): boolean => {
  const subscription = getUserSubscription(userId);
  if (!subscription || subscription.status !== 'active') {
    // User has no active subscription, check starter limits
    return true; // Basic access for now
  }
  
  const package_ = getPackageById(subscription.packageId);
  if (!package_) return false;
  
  // Add feature checking logic here
  switch (feature) {
    case 'ai':
      return package_.limits.aiEnabled || false;
    case 'unlimited_projects':
      return package_.limits.projects === -1;
    case 'unlimited_products':
      return package_.limits.products === -1;
    default:
      return true;
  }
};

export const hasReachedLimit = (userId: string, limitType: 'projects' | 'products' | 'orders'): boolean => {
  const subscription = getUserSubscription(userId);
  if (!subscription) return false;
  
  const package_ = getPackageById(subscription.packageId);
  if (!package_) return false;
  
  const limit = package_.limits[limitType];
  const usage = subscription.usage[limitType] || 0;
  
  if (limit === -1) return false; // Unlimited
  return usage >= (limit || 0);
};