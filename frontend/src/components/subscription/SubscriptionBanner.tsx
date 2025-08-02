import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Crown, TrendingUp, X } from 'lucide-react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { Link } from 'react-router-dom';
import { useState } from 'react';

interface SubscriptionBannerProps {
  limitType?: 'projects' | 'products' | 'orders';
  feature?: string;
  className?: string;
}

export const SubscriptionBanner = ({ 
  limitType, 
  feature, 
  className = '' 
}: SubscriptionBannerProps) => {
  const { currentPackage, hasReachedLimit, canAccess } = useSubscription();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  // Check if user has reached a specific limit
  if (limitType && hasReachedLimit(limitType)) {
    return (
      <Alert className={`border-orange-200 bg-orange-50 ${className}`}>
        <AlertTriangle className="h-4 w-4 text-orange-600" />
        <div className="flex items-center justify-between w-full">
          <div className="flex-1">
            <AlertDescription className="text-orange-800">
              <strong>Limite atteinte !</strong> Vous avez atteint la limite de{' '}
              {limitType === 'projects' ? 'projets' : 
               limitType === 'products' ? 'produits' : 'commandes'} de votre plan{' '}
              <Badge variant="outline" className="mx-1">
                {currentPackage?.name}
              </Badge>
              . Passez à un plan supérieur pour continuer.
            </AlertDescription>
          </div>
          <div className="flex items-center space-x-2 ml-4">
            <Button asChild size="sm" variant="outline">
              <Link to="/subscription">
                <TrendingUp className="h-4 w-4 mr-1" />
                Mettre à niveau
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDismissed(true)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Alert>
    );
  }

  // Check if user cannot access a specific feature
  if (feature && !canAccess(feature)) {
    return (
      <Alert className={`border-purple-200 bg-purple-50 ${className}`}>
        <Crown className="h-4 w-4 text-purple-600" />
        <div className="flex items-center justify-between w-full">
          <div className="flex-1">
            <AlertDescription className="text-purple-800">
              <strong>Fonctionnalité Premium</strong> Cette fonctionnalité nécessite un abonnement{' '}
              <Badge variant="outline" className="mx-1">Pro</Badge> ou supérieur.
            </AlertDescription>
          </div>
          <div className="flex items-center space-x-2 ml-4">
            <Button asChild size="sm">
              <Link to="/subscription">
                <Crown className="h-4 w-4 mr-1" />
                Débloquer
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDismissed(true)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Alert>
    );
  }

  // Show upgrade suggestion for free tier users
  if (currentPackage && currentPackage.price === 0) {
    return (
      <Alert className={`border-blue-200 bg-blue-50 ${className}`}>
        <TrendingUp className="h-4 w-4 text-blue-600" />
        <div className="flex items-center justify-between w-full">
          <div className="flex-1">
            <AlertDescription className="text-blue-800">
              <strong>Débloquez plus de fonctionnalités !</strong> Passez au plan{' '}
              <Badge variant="outline" className="mx-1">Pro</Badge>{' '}
              pour accéder à l'IA, des projets illimités et plus encore.
            </AlertDescription>
          </div>
          <div className="flex items-center space-x-2 ml-4">
            <Button asChild size="sm">
              <Link to="/subscription">
                <Crown className="h-4 w-4 mr-1" />
                Découvrir Pro
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDismissed(true)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Alert>
    );
  }

  return null;
};