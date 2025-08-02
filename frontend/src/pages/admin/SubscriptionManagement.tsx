import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle, 
  Search,
  Plus,
  Edit,
  Trash2,
  Crown,
  BarChart3
} from 'lucide-react';
import { 
  getAllPackages, 
  mockSubscriptions, 
  mockPackageRevenue,
  formatPrice 
} from '@/data/subscriptionPackages';
import { toast } from 'sonner';

const SubscriptionManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const allPackages = getAllPackages();
  const filteredSubscriptions = mockSubscriptions.filter(sub => {
    const matchesSearch = sub.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sub.userId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || 
                       allPackages.find(pkg => pkg.id === sub.packageId)?.type === selectedRole;
    return matchesSearch && matchesRole;
  });

  const handleSuspendSubscription = (subscriptionId: string) => {
    toast.success('Abonnement suspendu', {
      description: `L'abonnement ${subscriptionId} a été suspendu.`
    });
  };

  const handleSendReminder = (subscriptionId: string) => {
    toast.success('Relance envoyée', {
      description: `Une relance de paiement a été envoyée pour ${subscriptionId}.`
    });
  };

  const totalActiveSubscriptions = mockSubscriptions.filter(sub => sub.status === 'active').length;
  const totalRevenue = mockPackageRevenue.totalRevenue;
  const conversionRate = (mockPackageRevenue.conversions['contractor-starter-to-pro'] + 
                         mockPackageRevenue.conversions['supplier-essential-to-business']) / 100;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Abonnements</h1>
          <p className="text-muted-foreground">
            Supervisez les packages et abonnements utilisateurs
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Package
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Abonnements Actifs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalActiveSubscriptions}</div>
            <p className="text-xs text-muted-foreground">
              +12% par rapport au mois dernier
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Revenus Mensuels</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              +23% par rapport au mois dernier
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Taux de Conversion</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(conversionRate * 100).toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Freemium → Premium
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Alertes</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Paiements échoués
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="subscriptions" className="space-y-6">
        <TabsList>
          <TabsTrigger value="subscriptions">Abonnements</TabsTrigger>
          <TabsTrigger value="packages">Packages</TabsTrigger>
          <TabsTrigger value="revenue">Revenus</TabsTrigger>
        </TabsList>

        <TabsContent value="subscriptions" className="space-y-6">
          {/* Filters */}
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par ID ou utilisateur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrer par rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les rôles</SelectItem>
                <SelectItem value="contractor">Chefs de chantier</SelectItem>
                <SelectItem value="supplier">Fournisseurs</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Subscriptions Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID Abonnement</TableHead>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Package</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Date début</TableHead>
                    <TableHead>Renouvellement</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubscriptions.map((sub) => {
                    const package_ = allPackages.find(pkg => pkg.id === sub.packageId);
                    return (
                      <TableRow key={sub.id}>
                        <TableCell className="font-mono text-sm">{sub.id}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">User {sub.userId}</div>
                            <div className="text-sm text-muted-foreground">
                              {package_?.type === 'contractor' ? '👷‍♂️ Chef de chantier' : '🏭 Fournisseur'}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Crown className="h-4 w-4 text-purple-500" />
                            <span>{package_?.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={sub.status === 'active' ? 'default' : 
                                   sub.status === 'expired' ? 'destructive' : 'secondary'}
                          >
                            {sub.status === 'active' ? 'Actif' : 
                             sub.status === 'expired' ? 'Expiré' : 
                             sub.status === 'suspended' ? 'Suspendu' : 'En attente'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(sub.startDate).toLocaleDateString('fr-FR')}
                        </TableCell>
                        <TableCell>
                          {sub.renewalDate ? 
                            new Date(sub.renewalDate).toLocaleDateString('fr-FR') : 
                            'N/A'
                          }
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSuspendSubscription(sub.id)}
                            >
                              Suspendre
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSendReminder(sub.id)}
                            >
                              Relancer
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="packages" className="space-y-6">
          {/* Packages Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allPackages.map((pkg) => (
              <Card key={pkg.id} className="relative">
                {pkg.popular && (
                  <Badge className="absolute -top-2 -right-2 bg-gradient-primary">
                    Populaire
                  </Badge>
                )}
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{pkg.name}</span>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardTitle>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold">
                      {formatPrice(pkg.price, pkg.currency)}
                    </div>
                    <Badge variant="outline">
                      {pkg.type === 'contractor' ? '👷‍♂️ Chef de chantier' : '🏭 Fournisseur'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm">
                      <strong>Limites:</strong>
                      <ul className="mt-1 space-y-1 text-xs text-muted-foreground">
                        {pkg.limits.projects !== undefined && (
                          <li>Projets: {pkg.limits.projects === -1 ? 'Illimité' : pkg.limits.projects}</li>
                        )}
                        {pkg.limits.products !== undefined && (
                          <li>Produits: {pkg.limits.products === -1 ? 'Illimité' : pkg.limits.products}</li>
                        )}
                        {pkg.limits.orders !== undefined && (
                          <li>Commandes: {pkg.limits.orders === -1 ? 'Illimité' : pkg.limits.orders}/mois</li>
                        )}
                      </ul>
                    </div>
                    
                    {mockPackageRevenue.monthly[pkg.id] && (
                      <div className="pt-3 border-t">
                        <div className="text-sm font-medium">Performance:</div>
                        <div className="text-xs text-muted-foreground">
                          {mockPackageRevenue.monthly[pkg.id].subscribers} abonnés • {' '}
                          {formatPrice(mockPackageRevenue.monthly[pkg.id].revenue)} revenus
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          {/* Revenue Overview */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Revenus par Package
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(mockPackageRevenue.monthly).map(([packageId, data]) => {
                    const package_ = allPackages.find(pkg => pkg.id === packageId);
                    return (
                      <div key={packageId} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{package_?.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {data.subscribers} abonnés
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{formatPrice(data.revenue)}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Conversions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(mockPackageRevenue.conversions).map(([conversionType, count]) => (
                    <div key={conversionType} className="flex items-center justify-between">
                      <div className="text-sm">
                        {conversionType.includes('contractor') ? 
                          (conversionType.includes('starter-to-pro') ? 'Starter → Pro' : 'Pro → Entreprise') :
                          (conversionType.includes('essential-to-business') ? 'Essentiel → Business' : 'Business → Premium')
                        }
                      </div>
                      <Badge variant="outline">{count} conversions</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Package Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Créer un nouveau package</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="package-name">Nom du package</Label>
              <Input id="package-name" placeholder="Ex: Pro Plus" />
            </div>
            <div>
              <Label htmlFor="package-type">Type d'utilisateur</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="contractor">Chef de chantier</SelectItem>
                  <SelectItem value="supplier">Fournisseur</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="package-price">Prix (XOF)</Label>
              <Input id="package-price" type="number" placeholder="25000" />
            </div>
            <Button className="w-full">
              Créer le package
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubscriptionManagement;