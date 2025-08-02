import { useState } from "react";
import { 
  MoreHorizontal, Eye, Edit, Archive, AlertTriangle, CheckCircle, Clock,
  Search, Filter, MapPin, Calendar, Users, DollarSign, Target, Activity,
  TrendingUp, Pause, Play, RotateCcw, XCircle, Star, Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "react-router-dom";

const allProjects = [
  {
    id: 1,
    name: "Centre Commercial Plateau",
    contractor: "BTP Plateau SARL",
    location: "Abidjan, Plateau",
    progress: 75,
    status: "En cours",
    priority: "Haute",
    budget: { total: 2500000, spent: 1800000, remaining: 700000 },
    team: { total: 12, onSite: 8 },
    deadline: "2024-03-15",
    startDate: "2023-08-01",
    alerts: { total: 2, critical: 1, warning: 1 },
    safety: { score: 95, incidents: 0 },
    quality: { score: 92, inspections: 8 },
    efficiency: 87,
    category: "Commercial",
    lastUpdate: "2024-01-20",
    image: "🏢"
  },
  {
    id: 2,
    name: "Résidence Les Palmiers",
    contractor: "Construction Moderne",
    location: "Cocody, Riviera",
    progress: 45,
    status: "En cours",
    priority: "Moyenne",
    budget: { total: 1800000, spent: 810000, remaining: 990000 },
    team: { total: 8, onSite: 6 },
    deadline: "2024-05-20",
    startDate: "2023-10-15",
    alerts: { total: 1, critical: 0, warning: 1 },
    safety: { score: 88, incidents: 1 },
    quality: { score: 85, inspections: 5 },
    efficiency: 78,
    category: "Résidentiel",
    lastUpdate: "2024-01-19",
    image: "🏘️"
  },
  {
    id: 3,
    name: "École Primaire Treichville",
    contractor: "Éducation & Bâtiment",
    location: "Treichville",
    progress: 90,
    status: "Finalisation",
    priority: "Haute",
    budget: { total: 800000, spent: 720000, remaining: 80000 },
    team: { total: 6, onSite: 4 },
    deadline: "2024-02-28",
    startDate: "2023-06-01",
    alerts: { total: 0, critical: 0, warning: 0 },
    safety: { score: 98, incidents: 0 },
    quality: { score: 96, inspections: 12 },
    efficiency: 94,
    category: "Public",
    lastUpdate: "2024-01-20",
    image: "🏫"
  },
  {
    id: 4,
    name: "Complexe Industriel",
    contractor: "Industrie Pro",
    location: "Zone industrielle Yopougon",
    progress: 25,
    status: "En retard",
    priority: "Critique",
    budget: { total: 5000000, spent: 1250000, remaining: 3750000 },
    team: { total: 20, onSite: 12 },
    deadline: "2024-08-30",
    startDate: "2023-11-01",
    alerts: { total: 5, critical: 3, warning: 2 },
    safety: { score: 72, incidents: 3 },
    quality: { score: 68, inspections: 3 },
    efficiency: 58,
    category: "Industriel",
    lastUpdate: "2024-01-18",
    image: "🏭"
  },
  {
    id: 5,
    name: "Hôpital Régional",
    contractor: "Santé Construction",
    location: "Bouaké",
    progress: 60,
    status: "En cours",
    priority: "Haute",
    budget: { total: 3200000, spent: 1920000, remaining: 1280000 },
    team: { total: 15, onSite: 12 },
    deadline: "2024-06-15",
    startDate: "2023-09-01",
    alerts: { total: 1, critical: 0, warning: 1 },
    safety: { score: 91, incidents: 0 },
    quality: { score: 89, inspections: 7 },
    efficiency: 82,
    category: "Santé",
    lastUpdate: "2024-01-20",
    image: "🏥"
  }
];

const AdminProjectsOverview = () => {
  const [selectedView, setSelectedView] = useState<"grid" | "table">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedProject, setSelectedProject] = useState<any>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "En cours": return "bg-primary text-primary-foreground";
      case "Finalisation": return "bg-warning text-warning-foreground";
      case "En retard": return "bg-destructive text-destructive-foreground";
      case "Suspendu": return "bg-muted text-muted-foreground";
      case "Terminé": return "bg-success text-success-foreground";
      default: return "bg-secondary text-secondary-foreground";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critique": return "bg-destructive text-destructive-foreground";
      case "Haute": return "bg-warning text-warning-foreground";
      case "Moyenne": return "bg-secondary text-secondary-foreground";
      case "Basse": return "bg-muted text-muted-foreground";
      default: return "bg-secondary text-secondary-foreground";
    }
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 85) return "text-success";
    if (efficiency >= 70) return "text-warning";
    return "text-destructive";
  };

  const filteredProjects = allProjects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.contractor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || project.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getOverallStats = () => {
    const totalProjects = allProjects.length;
    const activeProjects = allProjects.filter(p => p.status === "En cours" || p.status === "Finalisation").length;
    const delayedProjects = allProjects.filter(p => p.status === "En retard").length;
    const criticalAlerts = allProjects.reduce((sum, p) => sum + p.alerts.critical, 0);
    const avgEfficiency = Math.round(allProjects.reduce((sum, p) => sum + p.efficiency, 0) / totalProjects);
    const totalBudget = allProjects.reduce((sum, p) => sum + p.budget.total, 0);
    const totalSpent = allProjects.reduce((sum, p) => sum + p.budget.spent, 0);

    return {
      totalProjects,
      activeProjects,
      delayedProjects,
      criticalAlerts,
      avgEfficiency,
      totalBudget,
      totalSpent,
      budgetUtilization: Math.round((totalSpent / totalBudget) * 100)
    };
  };

  const stats = getOverallStats();

  return (
    <div className="space-y-6">
      {/* Admin Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{stats.totalProjects}</p>
                <p className="text-sm text-muted-foreground">Projets totaux</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-8 w-8 text-success" />
              <div>
                <p className="text-2xl font-bold">{stats.activeProjects}</p>
                <p className="text-sm text-muted-foreground">Projets actifs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-8 w-8 text-destructive" />
              <div>
                <p className="text-2xl font-bold">{stats.criticalAlerts}</p>
                <p className="text-sm text-muted-foreground">Alertes critiques</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-warning" />
              <div>
                <p className="text-2xl font-bold">{stats.avgEfficiency}%</p>
                <p className="text-sm text-muted-foreground">Efficacité moyenne</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div>
              <CardTitle>Supervision des Projets</CardTitle>
              <p className="text-sm text-muted-foreground">
                Vue d'ensemble de tous les chantiers en cours
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant={selectedView === "grid" ? "default" : "outline"} 
                size="sm"
                onClick={() => setSelectedView("grid")}
              >
                Grille
              </Button>
              <Button 
                variant={selectedView === "table" ? "default" : "outline"} 
                size="sm"
                onClick={() => setSelectedView("table")}
              >
                Tableau
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom, entrepreneur, localisation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="En cours">En cours</SelectItem>
                <SelectItem value="Finalisation">Finalisation</SelectItem>
                <SelectItem value="En retard">En retard</SelectItem>
                <SelectItem value="Suspendu">Suspendu</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Priorité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes priorités</SelectItem>
                <SelectItem value="Critique">Critique</SelectItem>
                <SelectItem value="Haute">Haute</SelectItem>
                <SelectItem value="Moyenne">Moyenne</SelectItem>
                <SelectItem value="Basse">Basse</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Projects Display */}
      {selectedView === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{project.image}</div>
                    <div>
                      <h3 className="font-semibold text-sm">{project.name}</h3>
                      <p className="text-xs text-muted-foreground">{project.contractor}</p>
                    </div>
                  </div>
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
                      <DropdownMenuItem onClick={() => setSelectedProject(project)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Modifier statut
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Archive className="h-4 w-4 mr-2" />
                        Archiver
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge className={getStatusColor(project.status)}>
                    {project.status}
                  </Badge>
                  <Badge className={getPriorityColor(project.priority)}>
                    {project.priority}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Avancement</span>
                    <span className="font-semibold">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="text-muted-foreground">Budget</p>
                    <p className="font-semibold">{(project.budget.total / 1000000).toFixed(1)}M</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Efficacité</p>
                    <p className={`font-semibold ${getEfficiencyColor(project.efficiency)}`}>
                      {project.efficiency}%
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Équipe</p>
                    <p className="font-semibold">{project.team.onSite}/{project.team.total}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Alertes</p>
                    <p className="font-semibold text-destructive">{project.alerts.total}</p>
                  </div>
                </div>

                <div className="flex items-center text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3 mr-1" />
                  {project.location}
                </div>

                <div className="flex space-x-2">
                  <div className="flex items-center space-x-1">
                    <Shield className="h-3 w-3 text-success" />
                    <span className="text-xs">{project.safety.score}%</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3 text-warning" />
                    <span className="text-xs">{project.quality.score}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Projet</TableHead>
                <TableHead>Entrepreneur</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Priorité</TableHead>
                <TableHead>Avancement</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Efficacité</TableHead>
                <TableHead>Alertes</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="text-lg">{project.image}</div>
                      <div>
                        <p className="font-medium">{project.name}</p>
                        <p className="text-sm text-muted-foreground">{project.location}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {project.contractor.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{project.contractor}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(project.priority)}>
                      {project.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-1" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p className="font-medium">{(project.budget.total / 1000000).toFixed(1)}M</p>
                      <p className="text-muted-foreground">
                        {Math.round((project.budget.spent / project.budget.total) * 100)}% utilisé
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`font-medium ${getEfficiencyColor(project.efficiency)}`}>
                      {project.efficiency}%
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <span className="text-destructive font-medium">{project.alerts.critical}</span>
                      <span className="text-muted-foreground">/{project.alerts.total}</span>
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
                          Modifier statut
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Project Status Change Dialog */}
      {selectedProject && (
        <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Modifier le statut du projet</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">{selectedProject.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedProject.contractor}</p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Nouveau statut</label>
                <Select defaultValue={selectedProject.status}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="En cours">En cours</SelectItem>
                    <SelectItem value="Finalisation">Finalisation</SelectItem>
                    <SelectItem value="En retard">En retard</SelectItem>
                    <SelectItem value="Suspendu">Suspendu</SelectItem>
                    <SelectItem value="Terminé">Terminé</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setSelectedProject(null)}>
                  Annuler
                </Button>
                <Button onClick={() => setSelectedProject(null)}>
                  Modifier
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AdminProjectsOverview;