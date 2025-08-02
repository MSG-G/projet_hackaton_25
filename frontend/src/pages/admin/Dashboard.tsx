import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/utils/api';
import {
  Users,
  Building2,
  ShoppingCart,
  DollarSign,
  UserCheck,
  Shield,
  ShieldCheck,
  AlertTriangle,
  Settings,
  TrendingUp,
  UserPlus,
  BarChart3,
  Globe
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { mockAdminStats } from '@/data/mockData';
import UserManagement from '@/components/admin/UserManagement';
import SystemMonitoring from '@/components/admin/SystemMonitoring';

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  pendingUsers: number;
  activeProjects: number;
  totalOrders: number;
  revenue: number;
  usersByRole: {
    contractors: number;
    suppliers: number;
    admins: number;
  };
  monthlyRevenue?: { month: string; revenue: number }[];
  securityAlerts: typeof mockAdminStats.securityAlerts;
  systemLogs: typeof mockAdminStats.systemLogs;
}

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Récupère les stats depuis le backend et garde les mocks comme fallback
  const { data } = useQuery<AdminStats>({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const { data } = await api.get<{
        totalUsers: number;
        activeUsers: number;
        pendingUsers: number;
        activeProjects: number;
        totalOrders: number;
        totalRevenue: number;
        usersByRole: {
          contractors: number;
          suppliers: number;
          admins: number;
        };
        monthlyRevenue: { month: string; revenue: number }[];
      }>('/admin/stats');

      const result: AdminStats = {
        totalUsers: data.totalUsers,
        activeUsers: data.activeUsers,
        pendingUsers: data.pendingUsers,
        activeProjects: data.activeProjects,
        totalOrders: data.totalOrders,
        revenue: data.totalRevenue,
        usersByRole: data.usersByRole ?? mockAdminStats.usersByRole,
        monthlyRevenue: data.monthlyRevenue,
        securityAlerts: mockAdminStats.securityAlerts,
        systemLogs: mockAdminStats.systemLogs
      };
      return result;
    }
  });

  const defaultStats: AdminStats = {
    totalUsers: 0,
    activeUsers: 0,
    pendingUsers: 0,
    activeProjects: 0,
    totalOrders: 0,
    revenue: 0,
    usersByRole: { contractors: 0, suppliers: 0, admins: 0 },
    monthlyRevenue: [],
    securityAlerts: [],
    systemLogs: []
  } as any;

  const stats: AdminStats = { ...defaultStats, ...(mockAdminStats as any), ...(data as any) };

  const revenueData =
    (stats.monthlyRevenue && stats.monthlyRevenue.length > 0
      ? stats.monthlyRevenue
      : mockAdminStats.monthlyRevenue) ?? [
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
      case 'Critique':
        return 'bg-destructive text-destructive-foreground';
      case 'Élevée':
        return 'bg-warning text-warning-foreground';
      case 'Moyenne':
        return 'bg-secondary text-secondary-foreground';
      default:
        return 'bg-muted text-muted-foreground';
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
            <p className="text-muted-foreground">
              Supervision et gestion complète de la plateforme BluidTechAfrica
            </p>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Total */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{(stats.totalUsers ?? 0).toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Total utilisateurs</p>
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
                  <p className="text-2xl font-bold">{(stats.totalOrders ?? 0).toLocaleString()}</p>
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
                  <p className="text-2xl font-bold">
                    {(((stats.revenue ?? 0) / 1000000).toFixed(1))}M
                  </p>
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
                      <Tooltip
                        formatter={(value) => [`${(Number(value) / 1000000).toFixed(1)}M FCFA`, 'Revenus']}
                      />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="hsl(var(--primary))"
                        strokeWidth={3}
                      />
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
          </TabsContent>

          {/* Gestion des utilisateurs */}
          <TabsContent value="users" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Total */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Users className="h-8 w-8 text-primary" />
                    <div>
                      <p className="text-2xl font-bold">{(stats.totalUsers ?? 0).toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">Total utilisateurs</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              {/* Actifs */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <UserCheck className="h-8 w-8 text-success" />
                    <div>
                      <p className="text-2xl font-bold">{(stats.activeUsers ?? 0).toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">Actifs</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              {/* Entrepreneurs */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="text-2xl font-bold">{(stats.usersByRole.contractors ?? 0).toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">Entrepreneurs</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              {/* Fournisseurs */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="text-2xl font-bold">{(stats.usersByRole.suppliers ?? 0).toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">Fournisseurs</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              {/* En attente */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-8 w-8 text-warning" />
                    <div>
                      <p className="text-2xl font-bold">{(stats.pendingUsers ?? 0).toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">En attente</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
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
                          <Badge className={getSeverityColor(alert.severity)}>{alert.severity}</Badge>
                        </div>
                        <p className="text-sm mb-2">{alert.description}</p>
                        <p className="text-xs text-muted-foreground">{alert.timestamp}</p>
                        <div className="flex space-x-2 mt-3">
                          <Button size="sm" variant="outline">
                            Traiter
                          </Button>
                          <Button size="sm" variant="outline">
                            Voir détails
                          </Button>
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
                      <span className="text-sm font-medium">Uptime</span>
                      <span className="text-sm text-muted-foreground">99.9%</span>
                    </div>
                    <Progress value={99.9} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Requêtes sécurisées</span>
                      <span className="text-sm text-muted-foreground">98%</span>
                    </div>
                    <Progress value={98} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Incidents résolus</span>
                      <span className="text-sm text-muted-foreground">92%</span>
                    </div>
                    <Progress value={92} />
                  </div>
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