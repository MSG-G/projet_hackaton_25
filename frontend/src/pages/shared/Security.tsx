import { useState, useEffect } from "react";
import { 
  Shield, AlertTriangle, CheckCircle, Clock, 
  Plus, Bell, Users, TrendingUp, Activity,
  HardHat, Eye, Zap, FileCheck, Search,
  Filter, Download, RefreshCw, Settings,
  Lock, Unlock, UserX, Ban, AlertCircle,
  Camera, Wifi, Server, Database, Globe,
  BarChart3, PieChart, LineChart, Monitor
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// Interfaces pour le typage
interface SecurityAlert {
  id: string;
  type: string;
  title: string;
  location: string;
  time: string;
  priority: "critical" | "high" | "medium" | "low";
  status: "active" | "investigating" | "resolved";
  category: "intrusion" | "malware" | "access" | "data" | "network";
  details: string;
  assignedTo?: string;
}

interface SecurityIncident {
  id: string;
  title: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  category: string;
  status: "Open" | "Investigating" | "Resolved" | "Closed";
  date: string;
  description: string;
  affectedSystems: string[];
  responseTime: string;
  resolutionTime?: string;
}

interface SecurityMetric {
  name: string;
  value: number;
  unit: string;
  trend: "up" | "down" | "stable";
  status: "good" | "warning" | "critical";
}

const securityStats = [
  {
    title: "Niveau de sécurité global",
    value: "94%",
    icon: Shield,
    color: "text-success",
    trend: "+2%",
    status: "excellent"
  },
  {
    title: "Alertes critiques actives",
    value: "2",
    icon: AlertTriangle,
    color: "text-destructive",
    trend: "-1",
    status: "attention"
  },
  {
    title: "Incidents résolus (24h)",
    value: "12",
    icon: CheckCircle,
    color: "text-success",
    trend: "+5",
    status: "good"
  },
  {
    title: "Temps de réponse moyen",
    value: "8min",
    icon: Clock,
    color: "text-primary",
    trend: "-2min",
    status: "excellent"
  },
  {
    title: "Connexions suspectes bloquées",
    value: "47",
    icon: Ban,
    color: "text-warning",
    trend: "+12",
    status: "active"
  },
  {
    title: "Conformité réglementaire",
    value: "98%",
    icon: FileCheck,
    color: "text-success",
    trend: "+1%",
    status: "excellent"
  }
];

const activeAlerts: SecurityAlert[] = [
  {
    id: "ALT-001",
    type: "Intrusion",
    title: "Tentative d'accès non autorisé détectée",
    location: "Serveur principal - Base de données",
    time: "Il y a 5 min",
    priority: "critical",
    status: "active",
    category: "intrusion",
    details: "Multiple failed login attempts from IP 192.168.1.100",
    assignedTo: "Équipe SOC"
  },
  {
    id: "ALT-002",
    type: "Malware",
    title: "Activité suspecte détectée",
    location: "Poste utilisateur #24",
    time: "Il y a 15 min",
    priority: "high",
    status: "investigating",
    category: "malware",
    details: "Suspicious process execution detected",
    assignedTo: "Admin Système"
  },
  {
    id: "ALT-003",
    type: "Accès",
    title: "Connexion hors horaires",
    location: "Dashboard Admin",
    time: "Il y a 1h",
    priority: "medium",
    status: "investigating",
    category: "access",
    details: "User login outside business hours",
    assignedTo: "Responsable sécurité"
  },
  {
    id: "ALT-004",
    type: "Réseau",
    title: "Trafic anormal détecté",
    location: "Gateway principal",
    time: "Il y a 2h",
    priority: "medium",
    status: "investigating",
    category: "network",
    details: "Unusual network traffic pattern detected"
  }
];

const securityIncidents: SecurityIncident[] = [
  {
    id: "INC-2024-001",
    title: "Tentative de phishing ciblé",
    severity: "High",
    category: "Social Engineering",
    status: "Resolved",
    date: "2024-01-20",
    description: "Email de phishing reçu par 5 utilisateurs, aucun n'a cliqué",
    affectedSystems: ["Email Server", "User Workstations"],
    responseTime: "15 min",
    resolutionTime: "2h 30min"
  },
  {
    id: "INC-2024-002",
    title: "Vulnérabilité système critique",
    severity: "Critical",
    category: "Vulnerability",
    status: "Investigating",
    date: "2024-01-19",
    description: "CVE-2024-0001 détectée sur les serveurs web",
    affectedSystems: ["Web Servers", "Load Balancer"],
    responseTime: "5 min"
  },
  {
    id: "INC-2024-003",
    title: "Accès non autorisé base de données",
    severity: "Critical",
    category: "Data Breach",
    status: "Closed",
    date: "2024-01-18",
    description: "Tentative d'accès non autorisé bloquée par les pare-feux",
    affectedSystems: ["Database Server"],
    responseTime: "3 min",
    resolutionTime: "45 min"
  }
];

const securityMetrics: SecurityMetric[] = [
  { name: "Firewall Efficiency", value: 99.2, unit: "%", trend: "up", status: "good" },
  { name: "Antivirus Detection", value: 98.7, unit: "%", trend: "stable", status: "good" },
  { name: "Intrusion Prevention", value: 96.5, unit: "%", trend: "up", status: "good" },
  { name: "Data Encryption", value: 100, unit: "%", trend: "stable", status: "good" },
  { name: "User Compliance", value: 94.2, unit: "%", trend: "up", status: "good" },
  { name: "Incident Response Time", value: 8.5, unit: "min", trend: "down", status: "good" }
];

const Security = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedPriority, setSelectedPriority] = useState<string>("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLastUpdate(new Date());
    setIsRefreshing(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-red-100 text-red-800 border-red-200";
      case "high": return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "intrusion": return <Shield className="h-4 w-4" />;
      case "malware": return <AlertTriangle className="h-4 w-4" />;
      case "access": return <Lock className="h-4 w-4" />;
      case "data": return <Database className="h-4 w-4" />;
      case "network": return <Wifi className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-red-100 text-red-800";
      case "investigating": return "bg-yellow-100 text-yellow-800";
      case "resolved": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical": return "bg-red-100 text-red-800";
      case "High": return "bg-orange-100 text-orange-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredAlerts = activeAlerts.filter(alert => {
    const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || alert.category === selectedCategory;
    const matchesPriority = selectedPriority === "all" || alert.priority === selectedPriority;
    
    return matchesSearch && matchesCategory && matchesPriority;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Page Header */}
      <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800">
        <div className="container py-16">
          <div className="flex items-center justify-between text-white">
            <div>
              <h1 className="text-4xl font-bold mb-4">Centre de Sécurité</h1>
              <p className="text-xl text-white/90">
                Surveillance et gestion de la sécurité informatique en temps réel
              </p>
              <div className="flex items-center gap-4 mt-4">
                <Badge className="bg-white/20 text-white border-white/30">
                  <Clock className="h-4 w-4 mr-1" />
                  Dernière MàJ: {lastUpdate.toLocaleTimeString('fr-FR')}
                </Badge>
                <Badge className="bg-green-500/20 text-green-100 border-green-300/30">
                  <Shield className="h-4 w-4 mr-1" />
                  Système sécurisé
                </Badge>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={handleRefresh} disabled={isRefreshing}>
                <RefreshCw className={`h-5 w-5 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Actualiser
              </Button>
              <Button size="lg" variant="secondary" className="group">
                <Bell className="h-5 w-5 mr-2 group-hover:animate-pulse" />
                Centre d'alertes
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {/* Security Stats Dashboard */}
        <div className="grid gap-6 md:grid-cols-6 mb-8">
          {securityStats.map((stat, index) => (
            <Card key={index} className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <Badge variant="outline" className="text-xs">
                        {stat.trend}
                      </Badge>
                    </div>
                  </div>
                  <div className="relative">
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                    {stat.status === "attention" && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="dashboard">Tableau de bord</TabsTrigger>
            <TabsTrigger value="alerts">Alertes actives</TabsTrigger>
            <TabsTrigger value="incidents">Incidents</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Paramètres</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Threat Level */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Niveau de menace global
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-green-600 mb-2">FAIBLE</div>
                      <Progress value={25} className="h-3 mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Aucune menace critique détectée
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="font-bold text-green-600">98.5%</div>
                        <div className="text-muted-foreground">Systèmes sains</div>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="font-bold text-blue-600">24/7</div>
                        <div className="text-muted-foreground">Surveillance</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Real-time Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Activité en temps réel
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Connexion sécurisée</span>
                      </div>
                      <span className="text-xs text-muted-foreground">Il y a 2s</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">Firewall mis à jour</span>
                      </div>
                      <span className="text-xs text-muted-foreground">Il y a 1min</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm">Scan automatique</span>
                      </div>
                      <span className="text-xs text-muted-foreground">Il y a 5min</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Security Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Métriques de sécurité</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {securityMetrics.map((metric, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{metric.name}</span>
                        <Badge className={
                          metric.status === "good" ? "bg-green-100 text-green-800" :
                          metric.status === "warning" ? "bg-yellow-100 text-yellow-800" :
                          "bg-red-100 text-red-800"
                        }>
                          {metric.status.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold">{metric.value}{metric.unit}</span>
                        <div className="flex items-center">
                          {metric.trend === "up" && <TrendingUp className="h-4 w-4 text-green-500" />}
                          {metric.trend === "down" && <TrendingUp className="h-4 w-4 text-red-500 transform rotate-180" />}
                          {metric.trend === "stable" && <Activity className="h-4 w-4 text-blue-500" />}
                        </div>
                      </div>
                      <Progress value={metric.value} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Alerts Tab */}
          <TabsContent value="alerts" className="space-y-6">
            {/* Filters and Search */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher dans les alertes..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes catégories</SelectItem>
                      <SelectItem value="intrusion">Intrusion</SelectItem>
                      <SelectItem value="malware">Malware</SelectItem>
                      <SelectItem value="access">Accès</SelectItem>
                      <SelectItem value="data">Données</SelectItem>
                      <SelectItem value="network">Réseau</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Priorité" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes priorités</SelectItem>
                      <SelectItem value="critical">Critique</SelectItem>
                      <SelectItem value="high">Élevée</SelectItem>
                      <SelectItem value="medium">Moyenne</SelectItem>
                      <SelectItem value="low">Faible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Active Alerts List */}
            <div className="space-y-4">
              {filteredAlerts.map((alert) => (
                <Card key={alert.id} className="border-l-4 border-l-red-500">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          {getCategoryIcon(alert.category)}
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Badge className={getPriorityColor(alert.priority)}>
                                {alert.priority.toUpperCase()}
                              </Badge>
                              <Badge className={getStatusColor(alert.status)}>
                                {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
                              </Badge>
                              <span className="font-semibold text-lg">{alert.title}</span>
                            </div>
                            <p className="text-sm text-muted-foreground flex items-center gap-2">
                              <Monitor className="h-4 w-4" />
                              {alert.location} • {alert.time}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm">{alert.details}</p>
                        {alert.assignedTo && (
                          <p className="text-sm text-muted-foreground">
                            <strong>Assigné à:</strong> {alert.assignedTo}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Détails
                        </Button>
                        <Button variant="outline" size="sm">
                          Traiter
                        </Button>
                        <Button variant="destructive" size="sm">
                          Fermer
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Incidents Tab */}
          <TabsContent value="incidents" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Gestion des incidents</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Créer un incident
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Titre</TableHead>
                      <TableHead>Sévérité</TableHead>
                      <TableHead>Catégorie</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Temps de réponse</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {securityIncidents.map((incident) => (
                      <TableRow key={incident.id}>
                        <TableCell className="font-medium">{incident.id}</TableCell>
                        <TableCell>{incident.title}</TableCell>
                        <TableCell>
                          <Badge className={getSeverityColor(incident.severity)}>
                            {incident.severity}
                          </Badge>
                        </TableCell>
                        <TableCell>{incident.category}</TableCell>
                        <TableCell>
                          <Badge variant={incident.status === 'Resolved' ? 'default' : 'secondary'}>
                            {incident.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{incident.date}</TableCell>
                        <TableCell>{incident.responseTime}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Settings className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Monitoring Tab */}
          <TabsContent value="monitoring" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Server className="h-5 w-5" />
                    Surveillance des serveurs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "Web Server", status: "online", load: 45 },
                      { name: "Database Server", status: "online", load: 67 },
                      { name: "API Gateway", status: "warning", load: 89 },
                      { name: "File Server", status: "online", load: 23 }
                    ].map((server, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${
                            server.status === 'online' ? 'bg-green-500' : 
                            server.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                          }`} />
                          <span className="font-medium">{server.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm">Charge: {server.load}%</div>
                          <Progress value={server.load} className="w-20 h-2" />
                        </div>
                      </div>
                    ))}
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
                      <LineChart className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">Graphique en temps réel</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Tendances des menaces</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">Analyse des tendances</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Répartition des incidents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <PieChart className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">Répartition par type</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres de sécurité</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Alertes automatiques</h4>
                      <p className="text-sm text-muted-foreground">Notifications pour les événements critiques</p>
                    </div>
                    <Checkbox defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Scan automatique</h4>
                      <p className="text-sm text-muted-foreground">Analyse automatique des vulnérabilités</p>
                    </div>
                    <Checkbox defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Blocage automatique</h4>
                      <p className="text-sm text-muted-foreground">Blocage des IP suspectes</p>
                    </div>
                    <Checkbox defaultChecked />
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <Button>Sauvegarder</Button>
                  <Button variant="outline">Réinitialiser</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default Security;