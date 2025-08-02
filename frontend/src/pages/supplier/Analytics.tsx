import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from "recharts";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Star,
  Calendar,
  Download,
  Filter,
  Eye,
  Target,
  Clock
} from "lucide-react";

export default function SupplierAnalytics() {
  const [timePeriod, setTimePeriod] = useState("30d");
  const [selectedMetric, setSelectedMetric] = useState("revenue");

  // Données de revenus par mois
  const revenueData = [
    { month: 'Jan', revenue: 2100000, orders: 89, customers: 67 },
    { month: 'Fév', revenue: 2400000, orders: 108, customers: 82 },
    { month: 'Mar', revenue: 2800000, orders: 124, customers: 95 },
    { month: 'Avr', revenue: 2650000, orders: 118, customers: 91 },
    { month: 'Mai', revenue: 3200000, orders: 142, customers: 108 },
    { month: 'Jun', revenue: 3450000, orders: 156, customers: 119 },
  ];

  // Données de performance par produit
  const productPerformance = [
    { name: 'Ciment Portland', sales: 450000, quantity: 180, margin: 18.5 },
    { name: 'Fer à béton', sales: 380000, quantity: 95, margin: 22.3 },
    { name: 'Gravier concassé', sales: 320000, quantity: 240, margin: 15.8 },
    { name: 'Casques sécurité', sales: 85000, quantity: 340, margin: 35.2 },
    { name: 'Outils électriques', sales: 150000, quantity: 45, margin: 28.7 },
  ];

  // Répartition des ventes par catégorie
  const categoryData = [
    { name: 'Matériaux de construction', value: 65, color: '#8884d8' },
    { name: 'Équipements de sécurité', value: 20, color: '#82ca9d' },
    { name: 'Outils et machines', value: 15, color: '#ffc658' },
  ];

  // Données de satisfaction client
  const customerSatisfaction = [
    { period: 'Jan', rating: 4.2, reviews: 34 },
    { period: 'Fév', rating: 4.3, reviews: 42 },
    { period: 'Mar', rating: 4.5, reviews: 38 },
    { period: 'Avr', rating: 4.4, reviews: 45 },
    { period: 'Mai', rating: 4.6, reviews: 52 },
    { period: 'Jun', rating: 4.7, reviews: 48 },
  ];

  // Métriques principales
  const mainMetrics = [
    {
      title: "Chiffre d'affaires",
      value: "18.5M CFA",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      color: "text-success"
    },
    {
      title: "Commandes totales",
      value: "833",
      change: "+8.3%",
      trend: "up",
      icon: ShoppingCart,
      color: "text-primary"
    },
    {
      title: "Clients actifs",
      value: "562",
      change: "+15.2%",
      trend: "up",
      icon: Users,
      color: "text-secondary"
    },
    {
      title: "Taux de satisfaction",
      value: "4.7/5",
      change: "+0.3",
      trend: "up",
      icon: Star,
      color: "text-warning"
    }
  ];

  // Objectifs mensuels
  const monthlyGoals = [
    { name: 'Chiffre d\'affaires', current: 3450000, target: 4000000, progress: 86 },
    { name: 'Nouvelles commandes', current: 156, target: 180, progress: 87 },
    { name: 'Nouveaux clients', current: 25, target: 30, progress: 83 },
    { name: 'Taux de rétention', current: 92, target: 95, progress: 97 },
  ];

  // Top clients
  const topCustomers = [
    { name: 'Chantier Résidence Azure', orders: 45, revenue: 850000, growth: '+12%' },
    { name: 'Construction Villa Moderne', orders: 38, revenue: 720000, growth: '+8%' },
    { name: 'Projet Centre Commercial', orders: 32, revenue: 650000, growth: '+15%' },
    { name: 'Résidence Bella', orders: 28, revenue: 480000, growth: '+5%' },
    { name: 'Complexe Industriel', orders: 24, revenue: 420000, growth: '+18%' },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'decimal',
      minimumFractionDigits: 0,
    }).format(value) + ' CFA';
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        <div className="container mx-auto px-4 py-8">
          {/* En-tête */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-gradient-to-r from-primary to-primary-light">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
                <p className="text-muted-foreground">Analysez vos performances et optimisez vos ventes</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Select value={timePeriod} onValueChange={setTimePeriod}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">7 jours</SelectItem>
                  <SelectItem value="30d">30 jours</SelectItem>
                  <SelectItem value="90d">3 mois</SelectItem>
                  <SelectItem value="1y">1 an</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
            </div>
          </div>

          {/* Métriques principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {mainMetrics.map((metric, index) => (
              <Card key={index} className="shadow-card hover:shadow-construction transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{metric.title}</p>
                      <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                      <div className={`flex items-center gap-1 text-sm ${metric.color}`}>
                        {metric.trend === "up" ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                        <span>{metric.change}</span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-lg bg-primary/10`}>
                      <metric.icon className={`h-6 w-6 ${metric.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="sales">Ventes</TabsTrigger>
              <TabsTrigger value="products">Produits</TabsTrigger>
              <TabsTrigger value="customers">Clients</TabsTrigger>
              <TabsTrigger value="goals">Objectifs</TabsTrigger>
            </TabsList>

            {/* Vue d'ensemble */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Évolution du chiffre d'affaires */}
                <Card className="col-span-1 lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Évolution du chiffre d'affaires
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis tickFormatter={(value) => `${value/1000}K`} />
                        <Tooltip 
                          formatter={(value: number) => [formatCurrency(value), 'Revenus']}
                          labelStyle={{ color: 'var(--foreground)' }}
                          contentStyle={{ backgroundColor: 'var(--background)', border: '1px solid var(--border)' }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="revenue" 
                          stroke="hsl(var(--primary))" 
                          fill="hsl(var(--primary))" 
                          fillOpacity={0.1}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Répartition par catégorie */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Ventes par catégorie
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-2 mt-4">
                      {categoryData.map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                            <span className="text-sm">{item.name}</span>
                          </div>
                          <span className="text-sm font-medium">{item.value}%</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Satisfaction client */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5" />
                      Satisfaction client
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={customerSatisfaction}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="period" />
                        <YAxis domain={[4, 5]} />
                        <Tooltip 
                          formatter={(value: number) => [`${value}/5`, 'Note moyenne']}
                          labelStyle={{ color: 'var(--foreground)' }}
                          contentStyle={{ backgroundColor: 'var(--background)', border: '1px solid var(--border)' }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="rating" 
                          stroke="hsl(var(--warning))" 
                          strokeWidth={3}
                          dot={{ fill: 'hsl(var(--warning))' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Onglet Ventes */}
            <TabsContent value="sales" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="col-span-1 lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Performance des ventes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={350}>
                      <BarChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis tickFormatter={(value) => `${value/1000}K`} />
                        <Tooltip 
                          formatter={(value: number) => [formatCurrency(value), 'Revenus']}
                          labelStyle={{ color: 'var(--foreground)' }}
                          contentStyle={{ backgroundColor: 'var(--background)', border: '1px solid var(--border)' }}
                        />
                        <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Tendances mensuelles</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Revenus moyens/commande</span>
                        <span className="font-semibold">22,115 CFA</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Commandes/jour</span>
                        <span className="font-semibold">5.2</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Taux de conversion</span>
                        <span className="font-semibold">68%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Top 5 jours de vente</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { date: '15 Jun', revenue: 185000, orders: 8 },
                      { date: '22 Jun', revenue: 172000, orders: 7 },
                      { date: '08 Jun', revenue: 158000, orders: 6 },
                      { date: '29 Mai', revenue: 145000, orders: 6 },
                      { date: '12 Jun', revenue: 138000, orders: 5 },
                    ].map((day, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                        <div>
                          <p className="font-medium">{day.date}</p>
                          <p className="text-sm text-muted-foreground">{day.orders} commandes</p>
                        </div>
                        <span className="font-bold text-secondary">{formatCurrency(day.revenue)}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Onglet Produits */}
            <TabsContent value="products" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance par produit</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {productPerformance.map((product, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-semibold">{product.name}</h4>
                          <p className="text-sm text-muted-foreground">{product.quantity} unités vendues</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-secondary">{formatCurrency(product.sales)}</p>
                          <p className="text-sm text-success">Marge: {product.margin}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Onglet Clients */}
            <TabsContent value="customers" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top clients</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topCustomers.map((customer, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-semibold">{customer.name}</h4>
                          <p className="text-sm text-muted-foreground">{customer.orders} commandes</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-secondary">{formatCurrency(customer.revenue)}</p>
                          <Badge variant="secondary" className="text-success">
                            {customer.growth}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Onglet Objectifs */}
            <TabsContent value="goals" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Objectifs du mois
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {monthlyGoals.map((goal, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{goal.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {goal.progress}% atteint
                          </span>
                        </div>
                        <Progress value={goal.progress} className="h-2" />
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>
                            {goal.name.includes('Taux') ? `${goal.current}%` : 
                             goal.name.includes('affaires') ? formatCurrency(goal.current) : 
                             goal.current}
                          </span>
                          <span>
                            Objectif: {goal.name.includes('Taux') ? `${goal.target}%` : 
                                     goal.name.includes('affaires') ? formatCurrency(goal.target) : 
                                     goal.target}
                          </span>
                        </div>
                      </div>
                    ))}
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