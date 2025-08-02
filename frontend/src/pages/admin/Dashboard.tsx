import { useState } from 'react';
import { Users, Building2, ShoppingCart, DollarSign, Shield, AlertTriangle, Activity, Settings, MapPin, TrendingUp, UserPlus, BarChart3, Globe } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { mockAdminStats, mockProjects, mockSuppliers } from '@/data/mockData';
import UserManagement from '@/components/admin/UserManagement';
import SystemMonitoring from '@/components/admin/SystemMonitoring';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = mockAdminStats;
  
  const revenueData = [
    { month: 'Jan', revenue: 65000000 },
    { month: 'Fév', revenue: 72000000 },
    { month: 'Mar', revenue: 68000000 },
    { month: 'Avr', revenue: 81000000 },
    { month: 'Mai', revenue: 75000000 },
    { month: 'Jun', revenue: 85000000 }
  ];

  const userDistribution = [
    { name: 'Entrepreneurs', value: stats.usersByRole.contractors, color: 'hsl(var(--secondary))' },
    { name: 'Fournisseurs', value: stats.usersByRole.suppliers, color: 'hsl(var(--primary))' },
    { name: 'Admins', value: stats.usersByRole.admins, color: 'hsl(var(--warning))' }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critique': return 'bg-destructive text-destructive-foreground';
      case 'Élevée': return 'bg-warning text-warning-foreground';
      case 'Moyenne': return 'bg-secondary text-secondary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Console d'Administration</h1>
            <p className="text-muted-foreground">Supervision et gestion complète de la plateforme SmartChantier</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Configuration système
            </Button>
            <Button className="bg-primary hover:bg-primary-light text-primary-foreground">
              <UserPlus className="h-4 w-4 mr-2" />
              Créer administrateur
            </Button>
          </div>
        </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Utilisateurs actifs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Building2 className="h-8 w-8 text-secondary" />
              <div>
                <p className="text-2xl font-bold">{stats.activeProjects}</p>
                <p className="text-sm text-muted-foreground">Chantiers actifs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="h-8 w-8 text-success" />
              <div>
                <p className="text-2xl font-bold">{stats.totalOrders.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Commandes totales</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-8 w-8 text-warning" />
              <div>
                <p className="text-2xl font-bold">{(stats.revenue / 1000000).toFixed(1)}M</p>
                <p className="text-sm text-muted-foreground">Chiffre d'affaires</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Onglets principaux */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
        </TabsList>

        {/* Vue d'ensemble */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Graphique des revenus */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Évolution du chiffre d'affaires</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${(Number(value) / 1000000).toFixed(1)}M FCFA`, 'Revenus']} />
                    <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Répartition des utilisateurs */}
            <Card>
              <CardHeader>
                <CardTitle>Répartition des utilisateurs</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={userDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={(entry) => `${entry.name}: ${entry.value}`}
                    >
                      {userDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Carte interactive des chantiers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Localisation des chantiers actifs</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative h-64 bg-accent rounded-lg overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10"></div>
                
                {mockProjects.map((project, index) => (
                  <div
                    key={project.id}
                    className="absolute bg-secondary text-secondary-foreground p-2 rounded-full transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform"
                    style={{
                      left: `${30 + index * 25}%`,
                      top: `${40 + index * 15}%`
                    }}
                    title={project.name}
                  >
                    <Building2 className="h-4 w-4" />
                  </div>
                ))}
                
                <div className="absolute bottom-4 left-4 bg-background/90 p-2 rounded text-xs">
                  <p className="font-medium">Légende:</p>
                  <p>🔴 Chantiers actifs</p>
                  <p>🟢 Chantiers terminés</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Gestion des utilisateurs */}
        <TabsContent value="users">
          <UserManagement />
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Croissance des utilisateurs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">Graphique de croissance</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Revenus par mois</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">Graphique des revenus</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Répartition géographique</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Globe className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">Carte interactive</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top catégories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Matériaux de construction</span>
                    <div className="flex items-center gap-2">
                      <Progress value={85} className="w-20" />
                      <span className="text-sm">85%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Équipements de sécurité</span>
                    <div className="flex items-center gap-2">
                      <Progress value={65} className="w-20" />
                      <span className="text-sm">65%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Outils de construction</span>
                    <div className="flex items-center gap-2">
                      <Progress value={45} className="w-20" />
                      <span className="text-sm">45%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Monitoring */}
        <TabsContent value="monitoring">
          <SystemMonitoring />
        </TabsContent>

        {/* Sécurité */}
        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  <span>Alertes de sécurité actives</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.securityAlerts.map((alert) => (
                    <div key={alert.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium">{alert.type}</p>
                          <p className="text-sm text-muted-foreground">{alert.location}</p>
                        </div>
                        <Badge className={getSeverityColor(alert.severity)}>
                          {alert.severity}
                        </Badge>
                      </div>
                      <p className="text-sm mb-2">{alert.description}</p>
                      <p className="text-xs text-muted-foreground">{alert.timestamp}</p>
                      <div className="flex space-x-2 mt-3">
                        <Button size="sm" variant="outline">Traiter</Button>
                        <Button size="sm" variant="outline">Voir détails</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Métriques de sécurité</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Taux de conformité global</span>
                    <span className="text-sm font-medium">87%</span>
                  </div>
                  <Progress value={87} className="h-3" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Incidents résolus ce mois</span>
                    <span className="text-sm font-medium">24/27</span>
                  </div>
                  <Progress value={89} className="h-3" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Temps moyen de résolution</span>
                    <span className="text-sm font-medium">2.3h</span>
                  </div>
                  <Progress value={75} className="h-3" />
                </div>

                <Button className="w-full">
                  Configurer les règles IA
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      </div>
      
      <Footer />
    </div>
  );
};

export default AdminDashboard;