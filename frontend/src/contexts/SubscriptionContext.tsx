import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { 
  Package, 
  Subscription, 
  getUserSubscription, 
  getPackageById, 
  hasReachedLimit,
  canUserAccess,
  mockSubscriptions
} from '@/data/subscriptionPackages';

interface SubscriptionContextType {
  currentSubscription: Subscription | null;
  currentPackage: Package | null;
  isLoading: boolean;
  hasReachedLimit: (limitType: 'projects' | 'products' | 'orders') => boolean;
  canAccess: (feature: string) => boolean;
  upgradePackage: (packageId: string) => Promise<boolean>;
  refreshSubscription: () => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);
  const [currentPackage, setCurrentPackage] = useState<Package | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSubscription = () => {
    if (!user) {
      setCurrentSubscription(null);
      setCurrentPackage(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const subscription = getUserSubscription(user.id);
      setCurrentSubscription(subscription || null);
      
      if (subscription) {
        const package_ = getPackageById(subscription.packageId);
        setCurrentPackage(package_ || null);
      } else {
        // User has no subscription, assign free tier
        const freePackageId = user.role === 'contractor' ? 'contractor-starter' : 'supplier-essential';
        const freePackage = getPackageById(freePackageId);
        setCurrentPackage(freePackage || null);
      }
      
      setIsLoading(false);
    }, 500);
  };

  useEffect(() => {
    refreshSubscription();
  }, [user]);

  const checkLimit = (limitType: 'projects' | 'products' | 'orders'): boolean => {
    if (!user) return false;
    return hasReachedLimit(user.id, limitType);
  };

  const checkAccess = (feature: string): boolean => {
    if (!user) return false;
    return canUserAccess(user.id, feature);
  };

  const upgradePackage = async (packageId: string): Promise<boolean> => {
    if (!user) return false;
    
    // Simulate payment process
    setIsLoading(true);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate successful payment
        const newSubscription: Subscription = {
          id: `sub-${Date.now()}`,
          userId: user.id,
          packageId,
          status: 'active',
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          paymentMethod: 'stripe',
          lastPaymentDate: new Date().toISOString().split('T')[0],
          usage: {
            projects: 0,
            products: 0,
            orders: 0
          }
        };

        // Update mock data
        const existingIndex = mockSubscriptions.findIndex(sub => sub.userId === user.id);
        if (existingIndex >= 0) {
          mockSubscriptions[existingIndex] = newSubscription;
        } else {
          mockSubscriptions.push(newSubscription);
        }

        setCurrentSubscription(newSubscription);
        const package_ = getPackageById(packageId);
        setCurrentPackage(package_ || null);
        setIsLoading(false);
        resolve(true);
      }, 2000);
    });
  };

  return (
    <SubscriptionContext.Provider
      value={{
        currentSubscription,
        currentPackage,
        isLoading,
        hasReachedLimit: checkLimit,
        canAccess: checkAccess,
        upgradePackage,
        refreshSubscription
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};