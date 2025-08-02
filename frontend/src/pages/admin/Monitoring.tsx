import { useState } from 'react';
import { Activity, BarChart3, Shield, Users, AlertTriangle, CheckCircle, TrendingUp, Eye, Settings } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminMonitoring = () => {
  const [selectedMetric, setSelectedMetric] = useState('performance');

  // Données de monitoring en temps réel
  const systemMetrics = {
    serverHealth: 98,
    databasePerformance: 95,
    apiResponseTime: 145, // ms
    activeUsers: 1247,
    systemLoad: 67,
    memoryUsage: 72,
    diskUsage: 45,
    networkLatency: 23 // ms
  };

  const performanceData = [
    { time: '00:00', cpu: 45, memory: 62, network: 23 },
    { time: '04:00', cpu: 52, memory: 68, network: 25 },
    { time: '08:00', cpu: 78, memory: 82, network: 45 },
    { time: '12:00', cpu: 65, memory: 75, network: 32 },
    { time: '16:00', cpu: 88, memory: 89, network: 67 },
    { time: '20:00', cpu: 42, memory: 58, network: 28 },
  ];

  const recentEvents = [
    {
      id: 1,
      type: 'System',
      severity: 'info',
      message: 'Sauvegarde automatique des données terminée',
      timestamp: '2024-01-20 14:30:25',
      details: 'Backup de 2.3GB créé avec succès'
    },
    {
      id: 2,
      type: 'Security',
      severity: 'warning',
      message: 'Tentative de connexion suspecte détectée',
      timestamp: '2024-01-20 14:25:10',
      details: 'IP: 192.168.1.45 - Multiples tentatives échouées'
    },
    {
      id: 3,
      type: 'Performance',
      severity: 'critical',
      message: 'Pic d\'utilisation CPU détecté',
      timestamp: '2024-01-20 14:20:15',
      details: 'CPU à 95% pendant 5 minutes'
    },
    {
      id: 4,
      type: 'Database',
      severity: 'info',
      message: 'Optimisation des requêtes terminée',
      timestamp: '2024-01-20 14:15:30',
      details: 'Performance améliorée de 15%'
    },
    {
      id: 5,
      type: 'Network',
      severity: 'warning',
      message: 'Latence réseau élevée détectée',
      timestamp: '2024-01-20 14:10:45',
      details: 'Latence moyenne: 180ms'
    }
  ];

  const getHealthColor = (value: number) => {
    if (value >= 95) return "text-success";
    if (value >= 85) return "text-warning";
    return "text-destructive";
  };

  const getHealthStatus = (value: number) => {
    if (value >= 95) return "Excellent";
    if (value >= 85) return "Bon";
    if (value >= 70) return "Moyen";
    return "Critique";
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-destructive text-destructive-foreground';
      case 'warning': return 'bg-warning text-warning-foreground';
      case 'info': return 'bg-primary text-primary-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'info': return <CheckCircle className="h-4 w-4" />;
      default: return <Eye className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Monitoring Système</h1>
            <p className="text-muted-foreground">Surveillance en temps réel de la plateforme SmartChantier</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Configurer alertes
            </Button>
            <Button className="bg-primary hover:bg-primary-light text-primary-foreground">
              <BarChart3 className="h-4 w-4 mr-2" />
              Rapport détaillé
            </Button>
          </div>
        </div>

        {/* Métriques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Shield className="h-8 w-8 text-success" />
                <div>
                  <p className={`text-2xl font-bold ${getHealthColor(systemMetrics.serverHealth)}`}>
                    {systemMetrics.serverHealth}%
                  </p>
                  <p className="text-sm text-muted-foreground">Santé serveur</p>
                  <p className="text-xs text-muted-foreground">
                    {getHealthStatus(systemMetrics.serverHealth)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Activity className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{systemMetrics.activeUsers.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Utilisateurs actifs</p>
                  <p className="text-xs text-success">+12% vs hier</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-8 w-8 text-warning" />
                <div>
                  <p className="text-2xl font-bold">{systemMetrics.apiResponseTime}ms</p>
                  <p className="text-sm text-muted-foreground">Temps de réponse API</p>
                  <p className="text-xs text-warning">+5ms vs moyenne</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-8 w-8 text-secondary" />
                <div>
                  <p className={`text-2xl font-bold ${getHealthColor(systemMetrics.databasePerformance)}`}>
                    {systemMetrics.databasePerformance}%
                  </p>
                  <p className="text-sm text-muted-foreground">Performance BDD</p>
                  <p className="text-xs text-success">Optimale</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Graphique de performance */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Performance système (24h)</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="cpu" stroke="hsl(var(--primary))" strokeWidth={2} name="CPU %" />
                  <Line type="monotone" dataKey="memory" stroke="hsl(var(--warning))" strokeWidth={2} name="Mémoire %" />
                  <Line type="monotone" dataKey="network" stroke="hsl(var(--success))" strokeWidth={2} name="Réseau ms" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Métriques détaillées */}
          <Card>
            <CardHeader>
              <CardTitle>Utilisation ressources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Charge système</span>
                  <span className="font-semibold">{systemMetrics.systemLoad}%</span>
                </div>
                <Progress value={systemMetrics.systemLoad} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Mémoire utilisée</span>
                  <span className="font-semibold">{systemMetrics.memoryUsage}%</span>
                </div>
                <Progress value={systemMetrics.memoryUsage} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Espace disque</span>
                  <span className="font-semibold">{systemMetrics.diskUsage}%</span>
                </div>
                <Progress value={systemMetrics.diskUsage} className="h-2" />
              </div>

              <Separator />
              
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span>Latence réseau</span>
                  <span className="font-semibold">{systemMetrics.networkLatency}ms</span>
                </div>
                <div className="flex justify-between">
                  <span>Uptime</span>
                  <span className="font-semibold text-success">99.97%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Événements récents */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Événements système récents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {recentEvents.map((event) => (
                  <div key={event.id} className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Badge className={getSeverityColor(event.severity)}>
                          {getSeverityIcon(event.severity)}
                          <span className="ml-1 capitalize">{event.severity}</span>
                        </Badge>
                        <Badge variant="outline">{event.type}</Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">{event.timestamp}</span>
                    </div>
                    <p className="text-sm font-medium mb-1">{event.message}</p>
                    <p className="text-xs text-muted-foreground">{event.details}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alertes actives */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              <span>Alertes système actives</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  <span className="font-semibold text-sm">Charge CPU élevée</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Serveur principal à 85% depuis 30 min
                </p>
              </div>
              
              <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-sm">Maintenance programmée</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Mise à jour prévue demain à 02:00
                </p>
              </div>
              
              <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="font-semibold text-sm">Backup réussi</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Dernière sauvegarde: 14:30 (2.3GB)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default AdminMonitoring;