import { useState, useEffect } from "react";
import { supplierApi, Summary } from "@/api/supplier";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  Clock, 
  DollarSign,
  Users,
  MessageCircle,
  AlertCircle,
  CheckCircle,
  Plus,
  Eye,
  Edit,
  Truck,
  BarChart3,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Award,
  Target,
  Zap,
  Settings,
  Download,
  Upload,
  Filter,
  Search
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { Link } from "react-router-dom";

export default function SupplierDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  // Récupération des métriques du backend
  const [summary, setSummary] = useState<Summary | null>(null);

  useEffect(() => {
    supplierApi.getSummary().then(setSummary).catch(console.error);
  }, []);

  const stats = summary
    ? [
        {
          title: "Produits actifs",
          value: summary.activeProducts.toString(),
          change: "",
          percentage: 0,
          icon: Package,
          color: "text-primary",
          bgColor: "bg-primary/10"
        },
        {
          title: "Commandes ce mois",
          value: summary.ordersThisMonth.toString(),
          change: "",
          percentage: 0,
          icon: ShoppingCart,
          color: "text-secondary",
          bgColor: "bg-secondary/10"
        },
        {
          title: "Chiffre d'affaires",
          value: `${(summary.revenueThisMonth / 1000).toFixed(0)}k FCFA`,
          change: "",
          percentage: 0,
          icon: DollarSign,
          color: "text-success",
          bgColor: "bg-success/10"
        }
      ]
    : [] as any;

  // Données enrichies pour analytics
  const revenueData = [
    { month: 'Jan', revenue: 2100000, orders: 89 },
    { month: 'Fév', revenue: 2400000, orders: 108 },
    { month: 'Mar', revenue: 2800000, orders: 124 },
    { month: 'Avr', revenue: 2600000, orders: 115 },
    { month: 'Mai', revenue: 3100000, orders: 142 },
    { month: 'Jun', revenue: 3200000, orders: 156 }
  ];

  const productCategories = [
    { name: 'Ciment & Béton', value: 35, color: 'hsl(var(--primary))' },
    { name: 'Acier & Fer', value: 28, color: 'hsl(var(--secondary))' },
    { name: 'Matériaux de finition', value: 22, color: 'hsl(var(--success))' },
    { name: 'Outils & Équipements', value: 15, color: 'hsl(var(--warning))' }
  ];

  const topProducts = [
    { name: 'Ciment Portland CEM II', sales: 245, revenue: 1850000, trend: '+15%', stock: 150 },
    { name: 'Fer à béton HA 12mm', sales: 189, revenue: 1420000, trend: '+8%', stock: 80 },
    { name: 'Gravier concassé 15/25', sales: 167, revenue: 950000, trend: '+22%', stock: 45 },
    { name: 'Sable fin lavé', sales: 134, revenue: 720000, trend: '+5%', stock: 90 }
  ];

  const recentOrders = [
    {
      id: "CMD-2024-156",
      client: "BTP Résidence Azure",
      clientType: "Entrepreneur",
      product: "Ciment Portland - 50 sacs",
      quantity: "50 sacs",
      amount: "375,000 FCFA",
      status: "Confirmée",
      priority: "Normal",
      date: "2024-01-20",
      deliveryDate: "2024-01-22",
      location: "Cocody, Abidjan"
    },
    {
      id: "CMD-2024-155", 
      client: "Construction Moderne SARL",
      clientType: "Entreprise",
      product: "Fer à béton HA 12mm - 2 tonnes",
      quantity: "2 tonnes",
      amount: "850,000 FCFA",
      status: "En préparation",
      priority: "Urgent",
      date: "2024-01-20",
      deliveryDate: "2024-01-21",
      location: "Plateau, Abidjan"
    },
    {
      id: "CMD-2024-154",
      client: "Chantier Palmiers",
      clientType: "Particulier",
      product: "Gravier concassé - 10m³",
      quantity: "10 m³",
      amount: "450,000 FCFA",
      status: "Nouvelle",
      priority: "Normal",
      date: "2024-01-19",
      deliveryDate: "2024-01-23",
      location: "Marcory, Abidjan"
    }
  ];

  const notifications = [
    {
      id: 1,
      type: "stock",
      title: "Stock critique",
      message: "Fer à béton HA 12mm : seulement 15 unités restantes",
      severity: "high",
      time: "Il y a 2h",
      action: "Réapprovisionner"
    },
    {
      id: 2,
      type: "order",
      title: "Nouvelle commande urgente",
      message: "BTP Azure demande livraison express de 100 sacs ciment",
      severity: "medium",
      time: "Il y a 4h",
      action: "Voir commande"
    },
    {
      id: 3,
      type: "review",
      title: "Nouvel avis client",
      message: "Construction Moderne a laissé un avis 5⭐ sur votre service",
      severity: "positive",
      time: "Il y a 1 jour",
      action: "Voir avis"
    },
    {
      id: 4,
      type: "payment",
      title: "Paiement reçu",
      message: "Paiement de 850,000 FCFA reçu pour CMD-2024-152",
      severity: "positive",
      time: "Il y a 1 jour",
      action: "Voir détails"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Nouvelle": return "bg-primary text-primary-foreground";
      case "Confirmée": return "bg-secondary text-secondary-foreground";
      case "En préparation": return "bg-warning text-warning-foreground";
      case "Expédiée": return "bg-info text-info-foreground";
      case "Livrée": return "bg-success text-success-foreground";
      case "Annulée": return "bg-destructive text-destructive-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Urgent": return "text-destructive";
      case "Élevée": return "text-warning";
      case "Normal": return "text-muted-foreground";
      case "Basse": return "text-success";
      default: return "text-muted-foreground";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "bg-destructive/10 border-destructive/20 text-destructive";
      case "medium": return "bg-warning/10 border-warning/20 text-warning";
      case "positive": return "bg-success/10 border-success/20 text-success";
      default: return "bg-muted/10 border-muted/20 text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-8">
        <div className="container mx-auto px-4 py-8">
          {/* En-tête Fournisseur enrichi */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-gradient-primary">
                  <Package className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Espace Fournisseur Premium</h1>
                  <p className="text-muted-foreground">Optimisez vos ventes de matériaux BTP</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Paramètres
                </Button>
                <Button asChild variant="construction">
                  <Link to="/supplier/products" className="flex items-center gap-1">
                    <Plus className="h-4 w-4 mr-2" />
                    Nouveau produit
                  </Link>
                </Button>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <Badge variant="secondary" className="text-sm">
              <CheckCircle className="h-4 w-4 mr-1" />
              Compte vérifié
            </Badge>
            <Badge variant="outline" className="text-sm">
              <Award className="h-4 w-4 mr-1" />
              Fournisseur Premium
            </Badge>
            
            <Badge variant="outline" className="text-sm">
              <Target className="h-4 w-4 mr-1" />
              {summary ? `${summary.ordersThisMonth} commandes ce mois` : '... commandes ce mois'}
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="shadow-card hover:shadow-construction transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{stat.change}</span>
                      <span className="font-semibold">{stat.percentage}%</span>
                    </div>
                    <Progress value={stat.percentage} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Contenu principal avec onglets enrichis */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="products">Mes Produits</TabsTrigger>
              <TabsTrigger value="orders">Commandes</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Commandes récentes enrichies */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <ShoppingCart className="h-5 w-5 text-primary" />
                        Commandes Récentes
                      </CardTitle>
                      <Button variant="outline" size="sm" asChild>
                        <Link to="/supplier/orders">
                          <Eye className="h-4 w-4 mr-2" />
                          Voir tout
                        </Link>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{order.id}</span>
                            <Badge className={getStatusColor(order.status)}>
                              {order.status}
                            </Badge>
                            <span className={`text-xs ${getPriorityColor(order.priority)}`}>
                              {order.priority}
                            </span>
                          </div>
                          <span className="text-sm font-bold text-primary">{order.amount}</span>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">{order.client}</span>
                            <Badge variant="outline" className="text-xs">
                              {order.clientType}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{order.product}</p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Livraison: {order.deliveryDate}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {order.location}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Notifications enrichies */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-warning" />
                      Notifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {notifications.map((notif) => (
                      <div key={notif.id} className={`p-3 rounded-lg border ${getSeverityColor(notif.severity)}`}>
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-sm">{notif.title}</h4>
                          <span className="text-xs opacity-70">{notif.time}</span>
                        </div>
                        <p className="text-xs opacity-80 mb-2">{notif.message}</p>
                        <Button variant="outline" size="sm" className="text-xs h-7">
                          {notif.action}
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Performance overview */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-primary" />
                      Évolution chiffre d'affaires
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
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

                <Card>
                  <CardHeader>
                    <CardTitle>Top produits</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {topProducts.map((product, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{product.name}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{product.sales} ventes</span>
                            <span className="text-success">{product.trend}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-sm">{(product.revenue / 1000).toFixed(0)}K</p>
                          <p className="text-xs text-muted-foreground">Stock: {product.stock}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Actions rapides enrichies */}
              <Card>
                <CardHeader>
                  <CardTitle>Actions Rapides</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                    <Button variant="outline" className="h-20 flex-col" asChild>
                      <Link to="/supplier/products">
                        <Package className="h-6 w-6 mb-2" />
                        <span className="text-xs">Ajouter Produit</span>
                      </Link>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <Clock className="h-6 w-6 mb-2" />
                      <span className="text-xs">Gérer Stock</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col" asChild>
                      <Link to="/supplier/orders">
                        <Truck className="h-6 w-6 mb-2" />
                        <span className="text-xs">Livraisons</span>
                      </Link>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <Users className="h-6 w-6 mb-2" />
                      <span className="text-xs">Messages</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <BarChart3 className="h-6 w-6 mb-2" />
                      <span className="text-xs">Rapports</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <Settings className="h-6 w-6 mb-2" />
                      <span className="text-xs">Paramètres</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="products" className="space-y-6">
              <Card>
                <CardContent>
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Catalogue de produits</h3>
                    <p className="text-muted-foreground mb-4">
                      Gérez votre inventaire, prix et disponibilité
                    </p>
                    <Button variant="construction">
                    <Link to="/supplier/products" className="flex items-center gap-1">
                      Commencer la gestion
                    </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orders" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Gestion des Commandes</CardTitle>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        Filtrer
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Exporter
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Centre de commandes</h3>
                    <p className="text-muted-foreground mb-4">
                      Suivez et gérez toutes vos commandes en temps réel
                    </p>
                    <Button variant="construction">
                      Voir toutes les commandes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Répartition par catégorie</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={productCategories}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          label={(entry) => `${entry.name}: ${entry.value}%`}
                        >
                          {productCategories.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Performance mensuelle</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="orders" fill="hsl(var(--secondary))" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Analyses détaillées</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Analytics avancés</h3>
                    <p className="text-muted-foreground mb-4">
                      Insights détaillés sur vos ventes, clients et tendances
                    </p>
                    <Button variant="construction">
                      Explorer les analytics
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}