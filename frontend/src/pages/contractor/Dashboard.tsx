import { 
  TrendingUp, Users, DollarSign, ShoppingCart,
  Package, AlertTriangle, CheckCircle, Clock,
  BarChart3, PieChart, Activity, Target
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { AIAssistant } from "@/components/ai/AIAssistant";
import { useAuth } from "@/contexts/AuthContext";
import { mockClientStats } from "@/data/mockData";
import QuickNav from "@/components/navigation/QuickNav";

const dashboardStats = [
  {
    title: "Chiffre d'affaires",
    value: "2.4M FCFA",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    description: "Ce mois"
  },
  {
    title: "Chantiers actifs",
    value: "8",
    change: "+2",
    trend: "up",
    icon: Target,
    description: "En cours"
  },
  {
    title: "Commandes traitées",
    value: "156",
    change: "+23%",
    trend: "up",
    icon: ShoppingCart,
    description: "Ce mois"
  },
  {
    title: "Utilisateurs actifs",
    value: "1,247",
    change: "+8.2%",
    trend: "up",
    icon: Users,
    description: "Cette semaine"
  }
];

const recentOrders = [
  {
    id: "CMD-2024-001",
    client: "BTP Plateau SARL",
    project: "Centre Commercial",
    amount: "450,000 FCFA",
    status: "Livré",
    date: "2024-01-20"
  },
  {
    id: "CMD-2024-002",
    client: "Construction Moderne",
    project: "Résidence Les Palmiers",
    amount: "280,000 FCFA",
    status: "En transit",
    date: "2024-01-19"
  },
  {
    id: "CMD-2024-003",
    client: "École Treichville",
    project: "Rénovation École",
    amount: "125,000 FCFA",
    status: "Préparation",
    date: "2024-01-18"
  }
];

const topProducts = [
  {
    name: "Ciment Portland CEM II",
    category: "Ciment",
    sales: 145,
    revenue: "1,232,500 FCFA",
    trend: "+15%"
  },
  {
    name: "Fer à béton HA 12mm",
    category: "Acier",
    sales: 89,
    revenue: "892,300 FCFA",
    trend: "+8%"
  },
  {
    name: "Carrelage 60x60",
    category: "Finition",
    sales: 67,
    revenue: "673,200 FCFA",
    trend: "+22%"
  },
  {
    name: "Casques de sécurité",
    category: "EPI",
    sales: 234,
    revenue: "351,000 FCFA",
    trend: "+31%"
  }
];

const projectsOverview = [
  {
    name: "Centre Commercial Plateau",
    progress: 75,
    budget: "2.5M",
    spent: "1.8M",
    status: "En cours",
    deadline: "2024-03-15"
  },
  {
    name: "Résidence Les Palmiers",
    progress: 45,
    budget: "1.8M",
    spent: "810K",
    status: "En cours",
    deadline: "2024-05-20"
  },
  {
    name: "École Primaire",
    progress: 90,
    budget: "800K",
    spent: "720K",
    status: "Finalisation",
    deadline: "2024-02-28"
  }
];

const alerts = [
  {
    type: "Stock faible",
    message: "Ciment Portland - Stock < 20 unités",
    severity: "warning",
    time: "Il y a 2h"
  },
  {
    type: "Retard livraison",
    message: "Commande CMD-001 - Retard de 2 jours",
    severity: "high",
    time: "Il y a 4h"
  },
  {
    type: "Sécurité",
    message: "Alerte sécurité - Zone non balisée",
    severity: "critical",
    time: "Il y a 6h"
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Livré": return "bg-success text-success-foreground";
    case "En transit": return "bg-warning text-warning-foreground";
    case "Préparation": return "bg-secondary text-secondary-foreground";
    case "En cours": return "bg-primary text-primary-foreground";
    case "Finalisation": return "bg-warning text-warning-foreground";
    default: return "bg-muted text-muted-foreground";
  }
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "critical": return "bg-destructive text-destructive-foreground";
    case "high": return "bg-warning text-warning-foreground";
    case "warning": return "bg-secondary text-secondary-foreground";
    default: return "bg-muted text-muted-foreground";
  }
};

const Dashboard = () => {
  const { user } = useAuth();
  
  // Affichage conditionnel selon le rôle
  const getDashboardStats = () => {
    if (user?.role === 'contractor') {
      return [
        {
          title: "Dépenses totales",
          value: `${(mockClientStats.totalSpent / 1000000).toFixed(1)}M FCFA`,
          change: "+12.5%",
          trend: "up",
          icon: DollarSign,
          description: "Ce mois"
        },
        {
          title: "Chantiers actifs",
          value: mockClientStats.activeProjects.toString(),
          change: "+1",
          trend: "up",
          icon: Target,
          description: "En cours"
        },
        {
          title: "Commandes passées",
          value: mockClientStats.ordersCount.toString(),
          change: "+5",
          trend: "up",
          icon: ShoppingCart,
          description: "Ce mois"
        },
        {
          title: "Taux de réussite",
          value: `${mockClientStats.completionRate}%`,
          change: "+3%",
          trend: "up",
          icon: CheckCircle,
          description: "Projets terminés"
        }
      ];
    }
    
    return dashboardStats;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <AIAssistant />
      
      {/* Page Header */}
      <div className="bg-gradient-primary">
        <div className="container py-16">
          <div className="text-white">
            <h1 className="text-4xl font-bold mb-4">
              {user?.role === 'contractor' ? 'Mon Tableau de bord' : 'Tableau de bord'}
            </h1>
            <p className="text-xl text-white/90">
              {user?.role === 'contractor' 
                ? 'Gérez vos chantiers et suivez vos performances'
                : 'Vue d\'ensemble de votre activité SmartChantier'
              }
            </p>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {/* Key Metrics */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {getDashboardStats().map((stat, index) => (
            <Card key={index} className="hover:shadow-construction transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <div className="flex items-center space-x-2">
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <Badge variant="outline" className="text-xs">
                        {stat.change}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{stat.description}</p>
                  </div>
                  <stat.icon className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Client-specific content */}
        {user?.role === 'contractor' && (
          <div className="grid gap-6 lg:grid-cols-2 mb-8">
            {/* Répartition des matériaux */}
            <Card>
              <CardHeader>
                <CardTitle>Répartition des dépenses matériaux</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockClientStats.materialDistribution.map((material, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{material.name}</span>
                        <span className="font-medium">{material.amount.toLocaleString()} FCFA</span>
                      </div>
                      <Progress value={material.value} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Score de sécurité */}
            <Card>
              <CardHeader>
                <CardTitle>Performance sécurité</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-success mb-2">
                    {mockClientStats.securityScore}%
                  </div>
                  <p className="text-sm text-muted-foreground">Score de conformité</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Retard moyen</span>
                    <span className="font-medium">{mockClientStats.averageDelay} jours</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Taux de réussite</span>
                    <span className="font-medium">{mockClientStats.completionRate}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Navigation rapide */}
        <QuickNav />

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="projects">Projets</TabsTrigger>
            <TabsTrigger value="sales">Ventes</TabsTrigger>
            <TabsTrigger value="inventory">Stock</TabsTrigger>
            <TabsTrigger value="alerts">Alertes</TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview" className="grid gap-6 lg:grid-cols-3">
            {/* Recent Orders */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Commandes récentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <p className="font-semibold text-sm">{order.id}</p>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{order.client}</p>
                        <p className="text-xs text-muted-foreground">{order.project}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{order.amount}</p>
                        <p className="text-xs text-muted-foreground">{order.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {user?.role === 'contractor' && (
                  <>
                    <Button className="w-full" variant="construction" asChild>
                      <Link to="/projects/new">
                        <Target className="h-4 w-4 mr-2" />
                        Nouveau chantier
                      </Link>
                    </Button>
                    <Button className="w-full" variant="outline" asChild>
                      <Link to="/tasks/new">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Nouvelle tâche
                      </Link>
                    </Button>
                  </>
                )}
                {user?.role === 'supplier' && (
                  <>
                    <Button className="w-full" variant="construction" asChild>
                      <Link to="/supplier/products">
                        <Package className="h-4 w-4 mr-2" />
                        Gérer produits
                      </Link>
                    </Button>
                    <Button className="w-full" variant="outline" asChild>
                      <Link to="/supplier/orders">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Voir commandes
                      </Link>
                    </Button>
                  </>
                )}
                {user?.role === 'admin' && (
                  <>
                    <Button className="w-full" variant="construction" asChild>
                      <Link to="/admin">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Console admin
                      </Link>
                    </Button>
                    <Button className="w-full" variant="outline" asChild>
                      <Link to="/security">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Sécurité
                      </Link>
                    </Button>
                  </>
                )}
                {user?.role !== 'admin' && (
                  <Button className="w-full" variant="outline" asChild>
                    <Link to="/marketplace">
                      <Package className="h-4 w-4 mr-2" />
                      Commander matériaux
                    </Link>
                  </Button>
                )}
                <Button className="w-full" variant="outline">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Générer un rapport
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Projects */}
          <TabsContent value="projects" className="space-y-6">
            <div className="grid gap-6">
              {projectsOverview.map((project, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{project.name}</h3>
                        <Badge className={getStatusColor(project.status)}>
                          {project.status}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Échéance</p>
                        <p className="font-semibold">{new Date(project.deadline).toLocaleDateString('fr-FR')}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Avancement</span>
                        <span className="font-semibold">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Budget total</p>
                          <p className="font-semibold">{project.budget} FCFA</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Dépensé</p>
                          <p className="font-semibold">{project.spent} FCFA</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Sales */}
          <TabsContent value="sales" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Top Products */}
              <Card>
                <CardHeader>
                  <CardTitle>Produits les plus vendus</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topProducts.map((product, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                        <div className="space-y-1">
                          <p className="font-semibold text-sm">{product.name}</p>
                          <Badge variant="outline" className="text-xs">
                            {product.category}
                          </Badge>
                          <p className="text-xs text-muted-foreground">
                            {product.sales} ventes
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{product.revenue}</p>
                          <Badge variant="outline" className="text-xs">
                            {product.trend}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Sales Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Évolution des ventes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground mt-4 text-center">
                    Graphique des ventes sur les 6 derniers mois
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Inventory */}
          <TabsContent value="inventory" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Stock total</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-primary">2,847</p>
                    <p className="text-sm text-muted-foreground">Articles en stock</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Alertes stock</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-warning">12</p>
                    <p className="text-sm text-muted-foreground">Stocks faibles</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Valeur stock</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-success">15.2M</p>
                    <p className="text-sm text-muted-foreground">FCFA</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Alerts */}
          <TabsContent value="alerts" className="space-y-6">
            <div className="space-y-4">
              {alerts.map((alert, index) => (
                <Card key={index} className={`border-l-4 ${
                  alert.severity === 'critical' ? 'border-l-destructive' :
                  alert.severity === 'high' ? 'border-l-warning' : 'border-l-secondary'
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Badge className={getSeverityColor(alert.severity)}>
                            {alert.type}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{alert.time}</span>
                        </div>
                        <p className="font-semibold">{alert.message}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Traiter
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;