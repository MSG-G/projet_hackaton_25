import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { getPackagesByType } from '@/data/subscriptionPackages';
import { SubscriptionCard } from '@/components/subscription/SubscriptionCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Calendar, CreditCard, CheckCircle, Crown } from 'lucide-react';
import { toast } from 'sonner';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const Subscription = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentSubscription, currentPackage, upgradePackage, isLoading } = useSubscription();
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
  const [isUpgrading, setIsUpgrading] = useState(false);

  const contractorPackages = getPackagesByType('contractor');
  const supplierPackages = getPackagesByType('supplier');

  const handleSubscribe = async (packageId: string) => {
    // Rediriger vers l'authentification si l'utilisateur n'est pas connecté
    if (!user) {
      navigate('/auth', { state: { from: '/subscription', selectedPackage: packageId } });
      return;
    }

    setSelectedPackageId(packageId);
    setIsUpgrading(true);

    try {
      const success = await upgradePackage(packageId);
      if (success) {
        toast.success('Souscription réussie !', {
          description: 'Votre nouveau plan a été activé avec succès.'
        });
      } else {
        toast.error('Erreur de souscription', {
          description: 'Une erreur est survenue lors du traitement de votre paiement.'
        });
      }
    } catch (error) {
      toast.error('Erreur de souscription', {
        description: 'Une erreur technique est survenue.'
      });
    } finally {
      setIsUpgrading(false);
      setSelectedPackageId(null);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container py-12">
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Plans d'abonnement SmartChantier</h1>
            <p className="text-muted-foreground">
              Choisissez le plan qui correspond à vos besoins
            </p>
          </div>
        </div>

        {/* Guest User Welcome Banner */}
        {!user && (
          <Card className="mb-8 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-800">
                <Crown className="h-5 w-5 mr-2" />
                Découvrez nos plans d'abonnement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-700 mb-4">
                Choisissez le plan qui correspond à vos besoins professionnels. 
                Vous pourrez souscrire après avoir créé votre compte.
              </p>
              <div className="flex gap-4">
                <Button asChild variant="default">
                  <Link to="/auth/register">
                    Créer un compte gratuit
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/auth">
                    Se connecter
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Current Subscription Info - Only show if user is logged in */}
        {user && currentSubscription && (
          <Card className="mb-8 border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center text-green-800">
                <CheckCircle className="h-5 w-5 mr-2" />
                Votre abonnement actuel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-green-600">Plan actuel</p>
                  <p className="font-semibold text-green-800 flex items-center">
                    <Crown className="h-4 w-4 mr-1" />
                    {currentPackage?.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-green-600">Date de renouvellement</p>
                  <p className="font-semibold text-green-800 flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {currentSubscription.renewalDate ? formatDate(currentSubscription.renewalDate) : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-green-600">Statut</p>
                  <Badge 
                    variant={currentSubscription.status === 'active' ? 'default' : 'destructive'}
                    className="flex items-center w-fit"
                  >
                    {currentSubscription.status === 'active' ? 'Actif' : 'Inactif'}
                  </Badge>
                </div>
              </div>
              
              {currentSubscription.usage && (
                <div className="mt-4 pt-4 border-t border-green-200">
                  <p className="text-sm text-green-600 mb-2">Utilisation ce mois-ci :</p>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    {currentSubscription.usage.projects !== undefined && (
                      <div>
                        <span className="text-green-600">Projets: </span>
                        <span className="font-semibold text-green-800">
                          {currentSubscription.usage.projects}
                          {currentPackage?.limits.projects !== -1 && 
                            ` / ${currentPackage?.limits.projects}`
                          }
                        </span>
                      </div>
                    )}
                    {currentSubscription.usage.products !== undefined && (
                      <div>
                        <span className="text-green-600">Produits: </span>
                        <span className="font-semibold text-green-800">
                          {currentSubscription.usage.products}
                          {currentPackage?.limits.products !== -1 && 
                            ` / ${currentPackage?.limits.products}`
                          }
                        </span>
                      </div>
                    )}
                    {currentSubscription.usage.orders !== undefined && (
                      <div>
                        <span className="text-green-600">Commandes: </span>
                        <span className="font-semibold text-green-800">
                          {currentSubscription.usage.orders}
                          {currentPackage?.limits.orders !== -1 && 
                            ` / ${currentPackage?.limits.orders}`
                          }
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Package Selection */}
        <div className="space-y-8">
          {!user || user.role === 'admin' ? (
            <Tabs defaultValue="contractor" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="contractor">👷‍♂️ Chefs de chantier</TabsTrigger>
                <TabsTrigger value="supplier">🏭 Fournisseurs</TabsTrigger>
              </TabsList>
              
              <TabsContent value="contractor" className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-2">Plans pour Chefs de chantier</h2>
                  <p className="text-muted-foreground">
                    Gérez vos chantiers avec plus d'efficacité
                  </p>
                </div>
                <div className="grid lg:grid-cols-3 gap-6">
                  {contractorPackages.map((pkg) => (
                    <SubscriptionCard
                      key={pkg.id}
                      package_={pkg}
                      isCurrentPlan={user && currentPackage?.id === pkg.id}
                      onSubscribe={handleSubscribe}
                      loading={isUpgrading && selectedPackageId === pkg.id}
                    />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="supplier" className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-2">Plans pour Fournisseurs</h2>
                  <p className="text-muted-foreground">
                    Développez votre activité commerciale
                  </p>
                </div>
                <div className="grid lg:grid-cols-3 gap-6">
                  {supplierPackages.map((pkg) => (
                    <SubscriptionCard
                      key={pkg.id}
                      package_={pkg}
                      isCurrentPlan={user && currentPackage?.id === pkg.id}
                      onSubscribe={handleSubscribe}
                      loading={isUpgrading && selectedPackageId === pkg.id}
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">
                  Plans pour {user.role === 'contractor' ? 'Chefs de chantier' : 'Fournisseurs'}
                </h2>
                <p className="text-muted-foreground">
                  {user.role === 'contractor' 
                    ? 'Gérez vos chantiers avec plus d\'efficacité'
                    : 'Développez votre activité commerciale'
                  }
                </p>
              </div>
              <div className="grid lg:grid-cols-3 gap-6">
                {(user.role === 'contractor' ? contractorPackages : supplierPackages).map((pkg) => (
                  <SubscriptionCard
                    key={pkg.id}
                    package_={pkg}
                    isCurrentPlan={currentPackage?.id === pkg.id}
                    onSubscribe={handleSubscribe}
                    loading={isUpgrading && selectedPackageId === pkg.id}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Payment Methods Info */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              Moyens de paiement acceptés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4 text-center">
              <div className="p-4 border rounded-lg">
                <div className="text-2xl mb-2">💳</div>
                <p className="font-semibold">Stripe</p>
                <p className="text-sm text-muted-foreground">Carte bancaire</p>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="text-2xl mb-2">📱</div>
                <p className="font-semibold">Orange Money</p>
                <p className="text-sm text-muted-foreground">Mobile payment</p>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="text-2xl mb-2">🌊</div>
                <p className="font-semibold">Wave</p>
                <p className="text-sm text-muted-foreground">Portefeuille digital</p>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="text-2xl mb-2">🏦</div>
                <p className="font-semibold">Virement</p>
                <p className="text-sm text-muted-foreground">Transfert bancaire</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default Subscription;