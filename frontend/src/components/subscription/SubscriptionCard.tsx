import { Package } from '@/data/subscriptionPackages';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Star, Zap } from 'lucide-react';
import { formatPrice } from '@/data/subscriptionPackages';

interface SubscriptionCardProps {
  package_: Package;
  isCurrentPlan?: boolean;
  onSubscribe?: (packageId: string) => void;
  loading?: boolean;
}

export const SubscriptionCard = ({ 
  package_, 
  isCurrentPlan = false, 
  onSubscribe, 
  loading = false 
}: SubscriptionCardProps) => {
  const getIconForTier = (tier: string) => {
    switch (tier) {
      case 'starter':
      case 'essential':
        return <Zap className="h-5 w-5 text-blue-500" />;
      case 'pro':
      case 'business':
        return <Star className="h-5 w-5 text-orange-500" />;
      case 'enterprise':
      case 'premium':
        return <Crown className="h-5 w-5 text-purple-500" />;
      default:
        return <Zap className="h-5 w-5 text-gray-500" />;
    }
  };

  const getCardVariant = () => {
    if (isCurrentPlan) return 'outline';
    if (package_.popular) return 'default';
    return 'outline';
  };

  const getBorderColor = () => {
    if (isCurrentPlan) return 'border-green-500';
    if (package_.popular) return 'border-primary';
    return '';
  };

  return (
    <Card className={`relative ${getBorderColor()} transition-all hover:shadow-lg`}>
      {package_.popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-gradient-primary text-white px-4 py-1">
            {package_.badge}
          </Badge>
        </div>
      )}
      
      {isCurrentPlan && (
        <div className="absolute -top-3 right-4">
          <Badge variant="outline" className="bg-green-500 text-white border-green-500">
            Plan actuel
          </Badge>
        </div>
      )}

      <CardHeader className="text-center pb-4">
        <div className="flex items-center justify-center mb-2">
          {getIconForTier(package_.tier)}
        </div>
        <h3 className="text-2xl font-bold">{package_.name}</h3>
        <div className="space-y-1">
          <div className="text-3xl font-bold">
            {formatPrice(package_.price, package_.currency)}
          </div>
          {package_.price > 0 && (
            <p className="text-sm text-muted-foreground">
              par {package_.billingPeriod === 'month' ? 'mois' : 'an'}
            </p>
          )}
        </div>
        {package_.badge && !package_.popular && (
          <Badge variant="outline" className="w-fit mx-auto">
            {package_.badge}
          </Badge>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-3">
          {package_.features.map((feature, index) => (
            <div key={index} className="flex items-start space-x-3">
              <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t space-y-2">
          <h4 className="font-semibold text-sm">Limites incluses :</h4>
          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
            {package_.limits.projects !== undefined && (
              <div>
                Projets: {package_.limits.projects === -1 ? 'Illimité' : package_.limits.projects}
              </div>
            )}
            {package_.limits.products !== undefined && (
              <div>
                Produits: {package_.limits.products === -1 ? 'Illimité' : package_.limits.products}
              </div>
            )}
            {package_.limits.orders !== undefined && (
              <div>
                Commandes: {package_.limits.orders === -1 ? 'Illimité' : `${package_.limits.orders}/mois`}
              </div>
            )}
            {package_.limits.teamMembers !== undefined && (
              <div>
                Équipe: {package_.limits.teamMembers === -1 ? 'Illimité' : package_.limits.teamMembers}
              </div>
            )}
            {package_.limits.storage && (
              <div>Stockage: {package_.limits.storage}</div>
            )}
            {package_.limits.support && (
              <div>Support: {package_.limits.support}</div>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter>
        {isCurrentPlan ? (
          <Button variant="outline" className="w-full" disabled>
            Plan actuel
          </Button>
        ) : (
          <Button
            className="w-full"
            variant={package_.popular ? "default" : "outline"}
            onClick={() => onSubscribe?.(package_.id)}
            disabled={loading}
          >
            {loading ? 'Traitement...' : 
             package_.price === 0 ? 'Commencer' : 'Choisir ce plan'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};