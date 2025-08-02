import { Link } from 'react-router-dom';
import { 
  Building2, 
  Users, 
  ShoppingCart, 
  Truck, 
  CheckSquare, 
  BarChart3,
  Shield,
  Settings
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';

const QuickNav = () => {
  const { user } = useAuth();

  if (!user) return null;

  const getNavigationCards = () => {
    if (user.role === 'contractor') {
      return [
        {
          title: 'Mes Chantiers',
          description: 'Gérez vos projets de construction',
          icon: Building2,
          href: '/projects',
          color: 'text-primary',
          badge: '3 actifs'
        },
        {
          title: 'Mes Tâches',
          description: 'Organisez vos tâches quotidiennes',
          icon: CheckSquare,
          href: '/tasks',
          color: 'text-secondary',
          badge: '6 en cours'
        },
        {
          title: 'Marketplace',
          description: 'Commandez vos matériaux',
          icon: ShoppingCart,
          href: '/marketplace',
          color: 'text-success',
          badge: 'Nouveau'
        },
        {
          title: 'Mon Panier',
          description: 'Finalisez vos commandes',
          icon: ShoppingCart,
          href: '/cart',
          color: 'text-warning',
          badge: '3 articles'
        },
        {
          title: 'Livraisons',
          description: 'Suivez vos livraisons',
          icon: Truck,
          href: '/delivery',
          color: 'text-primary',
          badge: '1 en cours'
        },
        {
          title: 'Nouveau Projet',
          description: 'Créez un nouveau chantier',
          icon: Building2,
          href: '/projects/new',
          color: 'text-secondary',
          badge: 'Créer'
        }
      ];
    } else if (user.role === 'supplier') {
      return [
        {
          title: 'Mes Produits',
          description: 'Gérez votre catalogue',
          icon: ShoppingCart,
          href: '/supplier/products',
          color: 'text-success',
          badge: '45 produits'
        },
        {
          title: 'Commandes',
          description: 'Traitez les commandes clients',
          icon: CheckSquare,
          href: '/supplier/orders',
          color: 'text-warning',
          badge: '12 nouvelles'
        },
        {
          title: 'Livraisons',
          description: 'Organisez vos livraisons',
          icon: Truck,
          href: '/delivery',
          color: 'text-primary',
          badge: '5 en cours'
        },
        {
          title: 'Tableau de bord',
          description: 'Vos statistiques de vente',
          icon: BarChart3,
          href: '/supplier',
          color: 'text-secondary',
          badge: 'Analytics'
        }
      ];
    } else if (user.role === 'admin') {
      return [
        {
          title: 'Administration',
          description: 'Vue globale de la plateforme',
          icon: Settings,
          href: '/admin',
          color: 'text-primary',
          badge: 'Contrôle'
        },
        {
          title: 'Sécurité',
          description: 'Alertes et conformité',
          icon: Shield,
          href: '/security',
          color: 'text-destructive',
          badge: '3 alertes'
        },
        {
          title: 'Projets',
          description: 'Tous les chantiers actifs',
          icon: Building2,
          href: '/projects',
          color: 'text-success',
          badge: '156 actifs'
        },
        {
          title: 'Utilisateurs',
          description: 'Gestion des comptes',
          icon: Users,
          href: '/admin',
          color: 'text-warning',
          badge: '1247 users'
        }
      ];
    }
    return [];
  };

  const navigationCards = getNavigationCards();

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">
          Bienvenue, {user.firstName} {user.lastName}
        </h2>
        <p className="text-muted-foreground">
          Accédez rapidement à vos fonctionnalités SmartChantier
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {navigationCards.map((card, index) => (
          <Card key={index} className="hover:shadow-construction transition-all duration-300 hover:scale-105">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <card.icon className={`h-8 w-8 ${card.color}`} />
                <Badge variant="outline">{card.badge}</Badge>
              </div>
              <CardTitle className="text-lg">{card.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {card.description}
              </p>
              <Button asChild className="w-full" variant="construction">
                <Link to={card.href}>
                  Accéder
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Actions rapides */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Actions rapides</h3>
        <div className="flex flex-wrap gap-3">
          {user.role === 'contractor' && (
            <>
              <Button asChild variant="outline">
                <Link to="/projects/new">Nouveau Chantier</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/tasks/new">Nouvelle Tâche</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/marketplace">Commander Matériaux</Link>
              </Button>
            </>
          )}
          {user.role === 'supplier' && (
            <>
              <Button asChild variant="outline">
                <Link to="/supplier/products">Ajouter Produit</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/supplier/orders">Voir Commandes</Link>
              </Button>
            </>
          )}
          {user.role === 'admin' && (
            <>
              <Button asChild variant="outline">
                <Link to="/admin">Tableau Global</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/security">Alertes Sécurité</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuickNav;