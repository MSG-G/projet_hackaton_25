import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AdminProjectsOverview from "@/components/admin/AdminProjectsOverview";
import { useState, useEffect, useMemo } from "react";
import { 
  Plus, MapPin, Calendar, Users, TrendingUp, AlertTriangle, CheckCircle, Clock,
  Search, Filter, MoreHorizontal, Eye, Edit, Camera, FileText, 
  BarChart3, Target, Zap, DollarSign, Truck, Shield, Phone, MessageCircle,
  PieChart, LineChart, Activity, Settings, Download, Upload, Share2,
  Wrench, HardHat, Package, Clipboard, Timer, AlertCircle, Star,
  ChevronRight, ChevronDown, CalendarDays, PlayCircle, PauseCircle,
  Archive, RotateCcw, CheckCheck, XCircle, Info, MapPinIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger, 
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { useNotificationHelpers } from "@/hooks/useNotificationHelpers";
import api from "@/utils/api";

// Typage des données des projets (TypeScript)
interface Project {
  id: number;
  name: string;
  location: string;
  progress: number;
  status: string;
  priority: string;
  budget: { total: string; spent: string; remaining: string };
  team: { total: number; onSite: number; available: number };
  deadline: string;
  startDate: string;
  tasks: { total: number; completed: number; pending: number; blocked: number };
  alerts: { total: number; critical: number; warning: number; info: number };
  weather: { condition: string; temperature: string; humidity: string };
  safety: { score: number; incidents: number; daysWithoutIncident: number };
  quality: { score: number; inspections: number; issues: number };
  materials: { deliveryToday: number; stockLevel: string; criticalItems: number };
  image: string;
  coordinates: { lat: number; lng: number };
  supervisor: { name: string; phone: string; status: string };
  client: { name: string; contact: string; satisfaction: number };
  recentActivities: { time: string; action: string; user: string }[];
  phases: { name: string; progress: number; status: string }[];
}

// Fonction utilitaire pour parser les budgets
function parseBudget(budget: string): number {
  if (budget.endsWith('M')) {
    return parseFloat(budget.replace('M', '')) * 1_000_000;
  }
  if (budget.endsWith('K')) {
    return parseFloat(budget.replace('K', '')) * 1_000;
  }
  return parseFloat(budget) || 0;
}

// Hook pour récupérer les projets depuis une API
const useProjects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await api.get<Project[] | { projects: Project[] }>(
          '/contractor/projects'
        );
        // Some back-ends return an array directly while others wrap it in an
        // object { projects: [...] }. Support both.
        const data = response.data as unknown;
        const fetched: Project[] = Array.isArray(data)
          ? (data as Project[])
          : (data as { projects?: Project[] })?.projects ?? [];
        setProjects(fetched);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(String(err));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return { projects, loading, error };
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "En cours": return "bg-primary text-primary-foreground";
    case "Finalisation": return "bg-warning text-warning-foreground";
    case "Démarrage": return "bg-secondary text-secondary-foreground";
    case "Terminé": return "bg-success text-success-foreground";
    default: return "bg-muted text-muted-foreground";
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "Haute": return "bg-destructive text-destructive-foreground";
    case "Moyenne": return "bg-warning text-warning-foreground";
    case "Basse": return "bg-success text-success-foreground";
    default: return "bg-muted text-muted-foreground";
  }
};

const Projects = () => {
  const { user } = useAuth();
  const { notifyProjectUpdate } = useNotificationHelpers();
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list" | "kanban">("grid");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const { projects, loading, error } = useProjects();

  const filteredProjects = useMemo(() => projects.filter(project => {
    const matchesTab = 
      activeTab === "all" || 
      (activeTab === "active" && project.status === "En cours") ||
      (activeTab === "completed" && project.status === "Terminé") ||
      (activeTab === "alerts" && project.alerts?.total > 0) ||
      (activeTab === "delayed" && new Date(project.deadline ?? '') < new Date()) ||
      (activeTab === "finishing" && project.status === "Finalisation");

    const matchesSearch =
      (project.name ?? "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (project.location ?? "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (project.supervisor?.name ?? "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || project.priority === priorityFilter;
    
    return matchesTab && matchesSearch && matchesStatus && matchesPriority;
  }), [projects, activeTab, searchTerm, statusFilter, priorityFilter]);

  const stats = useMemo(() => ({
    total: projects.length,
    active: projects.filter(p => p.status === "En cours").length,
    completed: projects.filter(p => p.status === "Terminé").length,
    delayed: projects.filter(p => new Date(p.deadline ?? '').getTime() < new Date().getTime() && p.status !== "Terminé").length,
    totalBudget: projects.reduce((sum, p) => sum + parseBudget(p.budget?.total ?? '0'), 0),
    totalTeam: projects.reduce((sum, p) => sum + (p.team?.total ?? 0), 0),
    totalTasks: projects.reduce((sum, p) => sum + (p.tasks?.total ?? 0), 0),
    completedTasks: projects.reduce((sum, p) => sum + (p.tasks?.completed ?? 0), 0),
    totalAlerts: projects.reduce((sum, p) => sum + (p.alerts?.total ?? 0), 0),
    avgSafety: projects.length > 0 ? Math.round(projects.reduce((sum, p) => sum + (p.safety?.score ?? 0), 0) / projects.length) : 0,
    avgQuality: projects.length > 0 ? Math.round(projects.reduce((sum, p) => sum + (p.quality?.score ?? 0), 0) / projects.length) : 0
}), [projects]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-8">
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-6xl mb-4">🏗️</div>
              <h3 className="text-xl font-semibold mb-2">Chargement des projets...</h3>
              <p className="text-muted-foreground">Veuillez patienter pendant la récupération des données.</p>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-8">
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-xl font-semibold mb-2">Erreur lors du chargement</h3>
              <p className="text-muted-foreground">{error}</p>
              <Button variant="outline" onClick={() => window.location.reload()} className="mt-4">
                Réessayer
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Page Header */}
      <div className="bg-gradient-primary">
        <div className="container py-16">
          <div className="flex items-center justify-between text-white">
            <div>
              <h1 className="text-4xl font-bold mb-4">Chantiers</h1>
              <p className="text-xl text-white/90">
                Vue d'ensemble de tous les projets de construction
              </p>
            </div>
            <Button asChild size="lg" variant="secondary">
              <Link to="/projects/new">
                <Plus className="h-5 w-5 mr-2" />
                Nouveau chantier
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {/* Enhanced Dashboard Stats */}
        <div className="grid gap-6 md:grid-cols-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-blue-800">{stats.active}</p>
                  <p className="text-sm text-blue-600">Chantiers actifs</p>
                </div>
                <Activity className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-green-800">{stats.completedTasks}</p>
                  <p className="text-sm text-green-600">Tâches terminées</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-purple-800">{stats.totalTeam}</p>
                  <p className="text-sm text-purple-600">Équipiers</p>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-yellow-800">{stats.totalAlerts}</p>
                  <p className="text-sm text-yellow-600">Alertes actives</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-emerald-800">{stats.avgSafety}%</p>
                  <p className="text-sm text-emerald-600">Sécurité moy.</p>
                </div>
                <Shield className="h-8 w-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-indigo-50 to-indigo-100 border-indigo-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-indigo-800">{stats.avgQuality}%</p>
                  <p className="text-sm text-indigo-600">Qualité moy.</p>
                </div>
                <Star className="h-8 w-8 text-indigo-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Advanced Filters and Controls */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex flex-1 gap-4 items-center">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher chantiers, superviseurs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="En cours">En cours</SelectItem>
                    <SelectItem value="Finalisation">Finalisation</SelectItem>
                    <SelectItem value="Démarrage">Démarrage</SelectItem>
                    <SelectItem value="Terminé">Terminé</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Priorité" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes priorités</SelectItem>
                    <SelectItem value="Haute">Haute</SelectItem>
                    <SelectItem value="Moyenne">Moyenne</SelectItem>
                    <SelectItem value="Basse">Basse</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Button 
                  variant={viewMode === "grid" ? "default" : "outline"} 
                  size="sm"
                  aria-label="Vue grille"
                  onClick={() => setViewMode("grid")}
                >
                  <BarChart3 className="h-4 w-4" />
                </Button>
                <Button 
                  variant={viewMode === "list" ? "default" : "outline"} 
                  size="sm"
                  aria-label="Vue liste"
                  onClick={() => setViewMode("list")}
                >
                  <Clipboard className="h-4 w-4" />
                </Button>
                <Button 
                  variant={viewMode === "kanban" ? "default" : "outline"} 
                  size="sm"
                  aria-label="Vue kanban"
                  onClick={() => setViewMode("kanban")}
                >
                  <Target className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="all">Tous ({stats.total})</TabsTrigger>
            <TabsTrigger value="active">Actifs ({stats.active})</TabsTrigger>
            <TabsTrigger value="finishing">Finalisation ({projects.filter(p => p.status === "Finalisation").length})</TabsTrigger>
            <TabsTrigger value="delayed">En retard ({stats.delayed})</TabsTrigger>
            <TabsTrigger value="alerts">Alertes ({stats.totalAlerts})</TabsTrigger>
            <TabsTrigger value="completed">Terminés ({stats.completed})</TabsTrigger>
          </TabsList>
        </Tabs>

        {viewMode === "grid" && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="group hover:shadow-construction transition-all duration-300 hover:scale-105 cursor-pointer border-l-4 border-l-primary">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-3xl">{project.image}</div>
                      <div className="flex-1">
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {project.name}
                        </CardTitle>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <MapPinIcon className="h-3 w-3 mr-1" />
                          {project.location}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      {project.alerts?.total > 0 && (
                        <Badge variant="destructive" className="animate-pulse text-xs">
                          {project.alerts.total} alertes
                        </Badge>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link to={`/projects/${project.id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              Voir détails
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Camera className="h-4 w-4 mr-2" />
                            Photos chantier
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileText className="h-4 w-4 mr-2" />
                            Rapport
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Phone className="h-4 w-4 mr-2" />
                            Appeler superviseur
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge className={getStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                    <Badge className={getPriorityColor(project.priority)}>
                      {project.priority}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      <Timer className="h-3 w-3 mr-1" />
                      {Math.ceil((new Date(project.deadline ?? '').getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}j
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Avancement global</span>
                      <span className="text-sm font-bold text-primary">{project.progress ?? 0}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="space-y-1">
                      <p className="text-muted-foreground flex items-center">
                        <DollarSign className="h-3 w-3 mr-1" />
                        Budget
                      </p>
                      <p className="font-semibold">{parseBudget(project.budget?.spent ?? '0')}/{parseBudget(project.budget?.total ?? '0')}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        Équipe
                      </p>
                      <p className="font-semibold">{project.team?.onSite ?? 0}/{project.team?.total ?? 0} sur site</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground flex items-center">
                        <Shield className="h-3 w-3 mr-1" />
                        Sécurité
                      </p>
                      <p className="font-semibold text-green-600">{project.safety?.score ?? 0}%</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground flex items-center">
                        <Star className="h-3 w-3 mr-1" />
                        Qualité
                      </p>
                      <p className="font-semibold text-blue-600">{project.quality?.score ?? 0}%</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Tâches</p>
                    <div className="flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        <span>{project.tasks?.completed ?? 0} terminées</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-yellow-600" />
                        <span>{project.tasks?.pending ?? 0} en cours</span>
                      </div>
                      {project.tasks?.blocked > 0 && (
                        <div className="flex items-center gap-1">
                          <XCircle className="h-3 w-3 text-red-600" />
                          <span>{project.tasks?.blocked ?? 0} bloquées</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs bg-muted/50 rounded p-2">
                    <div className="flex items-center gap-1">
                      <div className="text-base">
                        {project.weather?.condition === "Ensoleillé" ? "☀️" : 
                         project.weather?.condition === "Nuageux" ? "☁️" : "🌧️"}
                      </div>
                      <span>{project.weather?.temperature ?? 'N/A'}</span>
                    </div>
                    <div className="text-muted-foreground">
                      Humidité: {project.weather?.humidity ?? 'N/A'}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2 bg-accent/50 rounded">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {project.supervisor?.name ? project.supervisor.name.split(' ').map(n => n[0]).join('') : 'N/A'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-xs font-medium">{project.supervisor?.name ?? 'N/A'}</p>
                        <p className="text-xs text-muted-foreground">Superviseur</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Badge variant={project.supervisor?.status === 'on-site' ? 'default' : 'secondary'} className="text-xs">
                        {project.supervisor?.status === 'on-site' ? 'Sur site' : 'Hors site'}
                      </Badge>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Phone className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button asChild variant="outline" size="sm" className="flex-1">
                      <Link to={`/projects/${project.id}`}>
                        <Eye className="h-3 w-3 mr-1" />
                        Détails
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm">
                      <Camera className="h-3 w-3" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageCircle className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {viewMode === "list" && (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Projet</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Avancement</TableHead>
                    <TableHead>Superviseur</TableHead>
                    <TableHead>Échéance</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Sécurité</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProjects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{project.image}</div>
                          <div>
                            <p className="font-medium">{project.name}</p>
                            <p className="text-sm text-muted-foreground">{project.location}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Badge className={getStatusColor(project.status)}>
                            {project.status}
                          </Badge>
                          {project.alerts?.total > 0 && (
                            <Badge variant="destructive" className="block w-fit">
                              {project.alerts.total} alertes
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">{project.progress ?? 0}%</span>
                          </div>
                          <Progress value={project.progress} className="h-2 w-20" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {project.supervisor?.name ? project.supervisor.name.split(' ').map(n => n[0]).join('') : 'N/A'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{project.supervisor?.name ?? 'N/A'}</p>
                            <Badge variant={project.supervisor?.status === 'on-site' ? 'default' : 'secondary'} className="text-xs">
                              {project.supervisor?.status === 'on-site' ? 'Sur site' : 'Hors site'}
                            </Badge>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>{new Date(project.deadline ?? '').toLocaleDateString('fr-FR')}</p>
                          <p className="text-muted-foreground">
                            {Math.ceil((new Date(project.deadline ?? '').getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} jours
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p className="font-medium">{parseBudget(project.budget?.spent ?? '0')}/{parseBudget(project.budget?.total ?? '0')}</p>
                          <p className="text-muted-foreground">
                            {Math.round((parseFloat(project.budget.spent.replace('M', '').replace('K', '0')) / 
                             parseFloat(project.budget.total.replace('M', '').replace('K', '0'))) * 100)}% utilisé
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Shield className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium">{project.safety?.score ?? 0}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link to={`/projects/${project.id}`}>
                                <Eye className="h-4 w-4 mr-2" />
                                Voir détails
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileText className="h-4 w-4 mr-2" />
                              Rapport
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {viewMode === "kanban" && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {["Démarrage", "En cours", "Finalisation", "Terminé"].map((status) => {
              const statusProjects = filteredProjects.filter(p => p.status === status);
              return (
                <Card key={status} className="min-h-[500px]">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center justify-between">
                      {status}
                      <Badge variant="secondary">{statusProjects.length}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {statusProjects.map((project) => (
                      <Card key={project.id} className="p-3 hover:shadow-md transition-shadow cursor-pointer">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-sm">{project.name}</span>
                            {project.alerts.total > 0 && (
                              <Badge variant="destructive" className="text-xs">
                                {project.alerts.total}
                              </Badge>
                            )}
                          </div>
                          <Progress value={project.progress} className="h-1" />
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{project.progress ?? 0}%</span>
                            <span>{project.supervisor?.name ?? 'N/A'}</span>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {filteredProjects.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-6xl mb-4">🏗️</div>
              <h3 className="text-xl font-semibold mb-2">
                {searchTerm || statusFilter !== "all" || priorityFilter !== "all"
                  ? "Aucun chantier trouvé"
                  : "Aucun chantier dans cette catégorie"
                }
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || statusFilter !== "all" || priorityFilter !== "all"
                  ? "Essayez de modifier vos critères de recherche."
                  : activeTab === "all" 
                    ? "Vous n'avez pas encore de chantiers. Créez votre premier projet !"
                    : "Aucun chantier ne correspond aux filtres sélectionnés."
                }
              </p>
              {(activeTab === "all" && !searchTerm && statusFilter === "all" && priorityFilter === "all") && (
                <Button asChild variant="construction">
                  <Link to="/projects/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Créer mon premier chantier
                  </Link>
                </Button>
              )}
              {(searchTerm || statusFilter !== "all" || priorityFilter !== "all") && (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                    setPriorityFilter("all");
                  }}
                >
                  Réinitialiser les filtres
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Projects;