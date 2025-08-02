import { useState } from "react";
import { 
  Activity, Server, Database, Globe, AlertTriangle, 
  CheckCircle, Clock, TrendingUp, Download, RefreshCw,
  Cpu, HardDrive, Wifi, Shield
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SystemMetric {
  name: string;
  value: number;
  unit: string;
  status: "healthy" | "warning" | "critical";
  trend: "up" | "down" | "stable";
}

interface SystemLog {
  id: string;
  timestamp: string;
  level: "info" | "warning" | "error";
  service: string;
  message: string;
}

export default function SystemMonitoring() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const systemMetrics: SystemMetric[] = [
    { name: "CPU", value: 67, unit: "%", status: "healthy", trend: "stable" },
    { name: "Mémoire", value: 78, unit: "%", status: "warning", trend: "up" },
    { name: "Stockage", value: 45, unit: "%", status: "healthy", trend: "stable" },
    { name: "Réseau", value: 89, unit: "Mbps", status: "healthy", trend: "up" },
    { name: "Base de données", value: 92, unit: "%", status: "critical", trend: "up" },
    { name: "API Response", value: 234, unit: "ms", status: "healthy", trend: "down" }
  ];

  const serverStatus = [
    { name: "Web Server", status: "healthy", uptime: "99.9%", lastCheck: "Il y a 2 min" },
    { name: "Database", status: "healthy", uptime: "99.8%", lastCheck: "Il y a 1 min" },
    { name: "API Gateway", status: "warning", uptime: "98.5%", lastCheck: "Il y a 3 min" },
    { name: "File Storage", status: "healthy", uptime: "99.9%", lastCheck: "Il y a 1 min" },
    { name: "Cache Server", status: "healthy", uptime: "99.7%", lastCheck: "Il y a 2 min" }
  ];

  const systemLogs: SystemLog[] = [
    {
      id: "1",
      timestamp: "2024-01-20 14:32:15",
      level: "error",
      service: "Database",
      message: "Connection timeout dépassé pour l'utilisateur admin"
    },
    {
      id: "2", 
      timestamp: "2024-01-20 14:30:45",
      level: "warning",
      service: "API Gateway",
      message: "Limite de taux dépassée pour l'endpoint /api/products"
    },
    {
      id: "3",
      timestamp: "2024-01-20 14:28:12",
      level: "info",
      service: "Web Server",
      message: "Déploiement réussi de la version 2.1.4"
    },
    {
      id: "4",
      timestamp: "2024-01-20 14:25:33",
      level: "info",
      service: "Cache Server",
      message: "Cache invalidé pour les données produits"
    },
    {
      id: "5",
      timestamp: "2024-01-20 14:22:18",
      level: "warning",
      service: "File Storage",
      message: "Espace de stockage à 85% de capacité"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy": return "bg-green-100 text-green-800";
      case "warning": return "bg-yellow-100 text-yellow-800";
      case "critical": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy": return <CheckCircle className="h-4 w-4" />;
      case "warning": return <AlertTriangle className="h-4 w-4" />;
      case "critical": return <AlertTriangle className="h-4 w-4" />;
      default: return null;
    }
  };

  const getLogLevelColor = (level: string) => {
    switch (level) {
      case "info": return "bg-blue-100 text-blue-800";
      case "warning": return "bg-yellow-100 text-yellow-800";
      case "error": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return <TrendingUp className="h-4 w-4 text-red-500" />;
      case "down": return <TrendingUp className="h-4 w-4 text-green-500 transform rotate-180" />;
      case "stable": return <Activity className="h-4 w-4 text-blue-500" />;
      default: return null;
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRefreshing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header with refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Surveillance système</h2>
          <p className="text-muted-foreground">Monitoring en temps réel de la plateforme</p>
        </div>
        <Button onClick={handleRefresh} disabled={isRefreshing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Actualiser
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="logs">Logs système</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* System Health Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  État général
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Santé du système</span>
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Opérationnel
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold text-green-600">98.7%</div>
                  <div className="text-sm text-muted-foreground">
                    Disponibilité sur 30 jours
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Globe className="h-5 w-5 text-blue-600" />
                  Trafic
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Utilisateurs actifs</span>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="text-2xl font-bold">2,847</div>
                  <div className="text-sm text-muted-foreground">
                    +12% vs hier
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Server className="h-5 w-5 text-purple-600" />
                  Performances
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Temps de réponse</span>
                    <TrendingUp className="h-4 w-4 text-green-500 transform rotate-180" />
                  </div>
                  <div className="text-2xl font-bold">234ms</div>
                  <div className="text-sm text-muted-foreground">
                    -15ms vs moyenne
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* System Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Métriques système</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {systemMetrics.map((metric, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{metric.name}</span>
                      <div className="flex items-center gap-2">
                        {getTrendIcon(metric.trend)}
                        <Badge className={getStatusColor(metric.status)}>
                          {getStatusIcon(metric.status)}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold">
                          {metric.value}{metric.unit}
                        </span>
                      </div>
                      <Progress 
                        value={metric.value} 
                        className={`h-2 ${
                          metric.status === "critical" ? "bg-red-100" :
                          metric.status === "warning" ? "bg-yellow-100" : "bg-green-100"
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Server Status */}
          <Card>
            <CardHeader>
              <CardTitle>État des serveurs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {serverStatus.map((server, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Server className="h-5 w-5 text-primary" />
                        <span className="font-medium">{server.name}</span>
                      </div>
                      <Badge className={getStatusColor(server.status)}>
                        {getStatusIcon(server.status)}
                        <span className="ml-1">
                          {server.status === "healthy" ? "Opérationnel" : "Attention"}
                        </span>
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{server.uptime}</div>
                      <div className="text-xs text-muted-foreground">{server.lastCheck}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cpu className="h-5 w-5" />
                  Utilisation CPU
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">Graphique en temps réel</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HardDrive className="h-5 w-5" />
                  Utilisation mémoire
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">Graphique en temps réel</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wifi className="h-5 w-5" />
                  Trafic réseau
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">Graphique en temps réel</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Performance base de données
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">Graphique en temps réel</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Journaux système</CardTitle>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {systemLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Badge className={getLogLevelColor(log.level)}>
                        {log.level.toUpperCase()}
                      </Badge>
                      <div>
                        <div className="font-medium">{log.service}</div>
                        <div className="text-sm text-muted-foreground">{log.message}</div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">{log.timestamp}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Alertes de sécurité
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <span className="font-medium text-red-800">Tentative d'intrusion</span>
                    </div>
                    <p className="text-sm text-red-700">
                      3 tentatives de connexion échouées depuis 192.168.1.100
                    </p>
                  </div>
                  
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <span className="font-medium text-yellow-800">Certificat SSL</span>
                    </div>
                    <p className="text-sm text-yellow-700">
                      Le certificat SSL expire dans 30 jours
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Métriques de sécurité</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Connexions sécurisées</span>
                    <span className="font-bold text-green-600">100%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Firewall actif</span>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Dernière mise à jour</span>
                    <span className="text-sm text-muted-foreground">Il y a 2 jours</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Vulnérabilités détectées</span>
                    <span className="font-bold">0</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}