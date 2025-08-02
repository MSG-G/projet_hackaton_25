import { useState, useEffect } from 'react';
import api from '@/utils/api';
import { Task } from '@/types';
import { 
  Plus, Search, Filter, Calendar, Users, Clock, 
  CheckCircle2, AlertTriangle, Camera, FileText,
  Edit3, Trash2, ArrowRight, MoreHorizontal,
  Target, Timer, User, Building
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

// Local extension with optional fields to satisfy existing UI without breaking strict typing
type TaskExt = Task & {
  phase?: string;
  team?: string;
  estimatedHours?: number;
  actualHours?: number;
  materials?: { name: string; quantity: number; unit: string; status: string }[];
  notes?: { id: string; content: string; author: string; date: string }[];
  startDate?: string;
};

// include optional extras on checklist
type ChecklistItemExt = import('@/types').ChecklistItem & {
  completedBy?: string;
  completedAt?: string;
};



// Helpers for label mapping
const statusLabel = (s: Task['status']) => {
  switch (s) {
    case 'todo': return 'En attente';
    case 'in_progress': return 'En cours';
    case 'done': return 'Terminé';
    default: return s;
  }
};

const priorityLabel = (p: Task['priority']) => {
  switch (p) {
    case 'high': return 'Haute';
    case 'medium': return 'Moyenne';
    case 'low': return 'Basse';
    default: return p;
  }
};

interface Props { projectId?: string }

const TaskManagement = ({ projectId }: Props) => {
  const [tasks, setTasks] = useState<TaskExt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const url = projectId ? `/contractor/tasks?projectId=${projectId}` : '/contractor/tasks';
        const { data } = await api.get<{ tasks: TaskExt[] }>(url);
        setTasks(data.tasks);
      } catch {
        setError('Erreur de chargement des tâches');
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [projectId]);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPhase, setFilterPhase] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  if (loading) return <div className="p-4">Chargement...</div>;
  if (error) return <div className="p-4 text-destructive">{error}</div>;

  // Filtrage des tâches
  const filteredTasks = tasks.filter((task) => {
    const desc = task.description ?? '';
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         desc.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || 
      (activeTab === 'active' && task.status === 'in_progress') ||
      (activeTab === 'pending' && task.status === 'todo') ||
      (activeTab === 'completed' && task.status === 'done');
    const matchesPhase = filterPhase === 'all' || task.phase === filterPhase;
    const matchesPriority = filterPriority === 'all' || priorityLabel(task.priority) === filterPriority;
    
    return matchesSearch && matchesTab && matchesPhase && matchesPriority;
  });

  // Statistiques
  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'done').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    pending: tasks.filter(t => t.status === 'todo').length,
    overdue: tasks.filter(t => t.dueDate ? new Date(t.dueDate) < new Date() && t.status !== 'done' : false).length
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'En cours': return 'bg-secondary text-secondary-foreground';
      case 'Terminé': return 'bg-success text-success-foreground';
      case 'En attente': return 'bg-warning text-warning-foreground';
      case 'En pause': return 'bg-muted text-muted-foreground';
      case 'Annulé': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critique': return 'text-destructive font-bold';
      case 'Haute': return 'text-destructive';
      case 'Moyenne': return 'text-warning';
      case 'Basse': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  const toggleChecklistItem = (taskId: string, checklistId: string) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const updatedChecklist = task.checklist.map(item => {
          if (item.id === checklistId) {
            return {
              ...item,
              completed: !item.completed,
              completedBy: !item.completed ? 'Utilisateur actuel' : undefined,
              completedAt: !item.completed ? new Date().toISOString().split('T')[0] : undefined
            };
          }
          return item;
        });
        
        // Recalculer le progrès
        const completedItems = updatedChecklist.filter(item => item.completed).length;
        const newProgress = Math.round((completedItems / updatedChecklist.length) * 100);
        
        return {
          ...task,
          checklist: updatedChecklist,
          progress: newProgress
        };
      }
      return task;
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header et statistiques */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Gestion des Tâches</h2>
          <Dialog open={isNewTaskOpen} onOpenChange={setIsNewTaskOpen}>
            <DialogTrigger asChild>
              <Button variant="construction">
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle tâche
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Créer une nouvelle tâche</DialogTitle>
              </DialogHeader>
              <NewTaskForm onClose={() => setIsNewTaskOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Target className="h-6 w-6 text-primary" />
                <div>
                  <p className="text-xl font-bold">{stats.total}</p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-6 w-6 text-secondary" />
                <div>
                  <p className="text-xl font-bold">{stats.inProgress}</p>
                  <p className="text-xs text-muted-foreground">En cours</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Timer className="h-6 w-6 text-warning" />
                <div>
                  <p className="text-xl font-bold">{stats.pending}</p>
                  <p className="text-xs text-muted-foreground">En attente</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-6 w-6 text-success" />
                <div>
                  <p className="text-xl font-bold">{stats.completed}</p>
                  <p className="text-xs text-muted-foreground">Terminées</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-6 w-6 text-destructive" />
                <div>
                  <p className="text-xl font-bold">{stats.overdue}</p>
                  <p className="text-xs text-muted-foreground">En retard</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Rechercher une tâche..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={filterPhase} onValueChange={setFilterPhase}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Phase" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes phases</SelectItem>
            <SelectItem value="Fondations">Fondations</SelectItem>
            <SelectItem value="Structure">Structure</SelectItem>
            <SelectItem value="Gros œuvre">Gros œuvre</SelectItem>
            <SelectItem value="Second œuvre">Second œuvre</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={filterPriority} onValueChange={setFilterPriority}>
          <SelectTrigger className="w-40">
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

      {/* Onglets */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">Toutes ({stats.total})</TabsTrigger>
          <TabsTrigger value="active">En cours ({stats.inProgress})</TabsTrigger>
          <TabsTrigger value="pending">En attente ({stats.pending})</TabsTrigger>
          <TabsTrigger value="completed">Terminées ({stats.completed})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredTasks.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">Aucune tâche trouvée</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredTasks.map((task) => (
                <Card key={task.id} className="hover:shadow-card transition-all duration-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center space-x-3">
                          <CardTitle className="text-lg">{task.title}</CardTitle>
                          <Badge variant="outline" className="text-xs">
                            {task.phase}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground pr-4">{task.description}</p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(task.status)}>
                          {task.status}
                        </Badge>
                        <span className={`text-sm font-medium ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setSelectedTask(task)}>
                              <Edit3 className="h-4 w-4 mr-2" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Informations principales */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{task.assignee}</p>
                          <p className="text-xs text-muted-foreground">{task.team}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{task.dueDate ? new Date(task.dueDate).toLocaleDateString('fr-FR') : new Date().toLocaleDateString('fr-FR')}</p>
                          <p className="text-xs text-muted-foreground">Échéance</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <div>
                          {(task.actualHours ?? task.estimatedHours) && (
  <p className="font-medium">{task.actualHours ?? '-'}h / {task.estimatedHours ?? '-'}h</p>
)}
                          <p className="text-xs text-muted-foreground">Temps</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Camera className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{(task.photos?.length ?? 0)} photos</p>
                          <p className="text-xs text-muted-foreground">{(task.notes?.length ?? 0)} notes</p>
                        </div>
                      </div>
                    </div>

                    {/* Progression */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progression</span>
                        <span className="font-medium">{task.progress}%</span>
                      </div>
                      <Progress value={task.progress} className="h-2" />
                    </div>

                    {/* Checklist condensée */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium text-sm">Checklist ({task.checklist.filter(i => i.completed).length}/{task.checklist.length})</h4>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setSelectedTask(task)}
                        >
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-1">
                        {task.checklist.slice(0, 3).map((item: ChecklistItemExt) => (
                          <div key={item.id} className="flex items-center space-x-2">
                            <Checkbox 
                              checked={item.completed} 
                              onCheckedChange={() => toggleChecklistItem(task.id, item.id)}
                              className="data-[state=checked]:bg-success data-[state=checked]:border-success"
                            />
                            <span className={`text-sm ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                              {item.task}
                            </span>
                          </div>
                        ))}
                        {task.checklist.length > 3 && (
                          <p className="text-xs text-muted-foreground">
                            +{task.checklist.length - 3} autres éléments...
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Matériaux */}
                    {(task.materials?.length ?? 0) > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Matériaux requis</h4>
                        <div className="flex flex-wrap gap-2">
                          {(task.materials ?? []).map((material, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {material.name} ({material.quantity} {material.unit})
                              <span className={`ml-1 ${
                                material.status === 'Livré' ? 'text-success' :
                                material.status === 'Commandé' ? 'text-warning' : 'text-destructive'
                              }`}>
                                • {material.status}
                              </span>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Dialog pour les détails de la tâche */}
      {selectedTask && (
        <TaskDetailDialog 
          task={selectedTask as TaskExt} 
          onClose={() => setSelectedTask(null)}
          onUpdateTask={(updatedTask) => {
            setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
            setSelectedTask(null);
          }}
        />
      )}
    </div>
  );
};

// Composant pour le formulaire de nouvelle tâche
const NewTaskForm = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Titre de la tâche</Label>
          <Input id="title" placeholder="Nom de la tâche" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phase">Phase</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une phase" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="foundations">Fondations</SelectItem>
              <SelectItem value="structure">Structure</SelectItem>
              <SelectItem value="gros-oeuvre">Gros œuvre</SelectItem>
              <SelectItem value="second-oeuvre">Second œuvre</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" placeholder="Description détaillée de la tâche" />
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="priority">Priorité</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Priorité" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="basse">Basse</SelectItem>
              <SelectItem value="moyenne">Moyenne</SelectItem>
              <SelectItem value="haute">Haute</SelectItem>
              <SelectItem value="critique">Critique</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="assignee">Assigné à</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Responsable" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="jean">Jean Kouassi</SelectItem>
              <SelectItem value="marie">Marie Diallo</SelectItem>
              <SelectItem value="pierre">Pierre Yao</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="due-date">Date d'échéance</Label>
          <Input id="due-date" type="date" />
        </div>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onClose}>Annuler</Button>
        <Button variant="construction">Créer la tâche</Button>
      </div>
    </div>
  );
};

// Composant pour les détails de la tâche
const TaskDetailDialog = ({ 
  task, 
  onClose, 
  onUpdateTask 
}: { 
  task: TaskExt; 
  onClose: () => void; 
  onUpdateTask: (task: TaskExt) => void; 
}) => {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            {task.title}
            <Badge className={getStatusColor(task.status)}>
              {task.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Informations principales */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Description</Label>
                <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Assigné à</Label>
                  <p className="text-sm">{task.assignee}</p>
                  {task.team && <p className="text-xs text-muted-foreground">{task.team}</p>}
                </div>
                <div>
                  <Label className="text-sm font-medium">Phase</Label>
                  {task.phase && <p className="text-sm">{task.phase}</p>}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Date de début</Label>
                  <p className="text-sm">{task.startDate ? new Date(task.startDate).toLocaleDateString('fr-FR') : '—'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Échéance</Label>
                  <p className="text-sm">{task.dueDate ? new Date(task.dueDate).toLocaleDateString('fr-FR') : '—'}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Progression</Label>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Avancement</span>
                    <span className="font-medium">{task.progress}%</span>
                  </div>
                  <Progress value={task.progress} className="h-2" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Temps estimé</Label>
                  {task.estimatedHours !== undefined && <p className="text-sm">{task.estimatedHours}h</p>}
                </div>
                <div>
                  <Label className="text-sm font-medium">Temps réel</Label>
                  {task.actualHours !== undefined && <p className="text-sm">{task.actualHours}h</p>}
                </div>
              </div>
            </div>
          </div>
          
          {/* Checklist détaillée */}
          <div className="space-y-4">
            <Label className="text-lg font-medium">Checklist de progression</Label>
            <div className="space-y-3">
              {task.checklist.map((item: ChecklistItemExt) => (
                <div key={item.id} className="flex items-start space-x-3 p-3 rounded-lg border">
                  <Checkbox 
                    checked={item.completed} 
                    className="mt-1 data-[state=checked]:bg-success data-[state=checked]:border-success"
                  />
                  <div className="flex-1">
                    <p className={`text-sm ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                      {item.task}
                    </p>
                    {item.completed && item.completedBy && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Terminé par {item.completedBy}{item.completedAt && ` le ${item.completedAt}`}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Matériaux */}
          {(task.materials?.length ?? 0) > 0 && (
            <div className="space-y-4">
              <Label className="text-lg font-medium">Matériaux requis</Label>
              <div className="space-y-2">
                {(task.materials ?? []).map((material, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="font-medium">{material.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Quantité: {material.quantity} {material.unit}
                      </p>
                    </div>
                    <Badge variant="outline" className={
                      material.status === 'Livré' ? 'text-success border-success' :
                      material.status === 'Commandé' ? 'text-warning border-warning' : 'text-destructive border-destructive'
                    }>
                      {material.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Notes */}
          <div className="space-y-4">
            <Label className="text-lg font-medium">Notes et commentaires</Label>
            <div className="space-y-3">
              {(task.notes ?? []).map((note) => (
                <div key={note.id} className="p-3 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-sm">{note.author}</p>
                    <p className="text-xs text-muted-foreground">{note.date}</p>
                  </div>
                  <p className="text-sm">{note.content}</p>
                </div>
              ))}
              
              <div className="p-3 rounded-lg border border-dashed">
                <Textarea placeholder="Ajouter une note..." className="border-0 p-0 resize-none" />
                <div className="flex justify-end mt-2">
                  <Button size="sm" variant="construction">Ajouter</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>Fermer</Button>
          <Button variant="construction">Sauvegarder</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};


const getStatusColor = (status: string) => {
  switch (status) {
    case 'En cours': return 'bg-secondary text-secondary-foreground';
    case 'Terminé': return 'bg-success text-success-foreground';
    case 'En attente': return 'bg-warning text-warning-foreground';
    case 'En pause': return 'bg-muted text-muted-foreground';
    case 'Annulé': return 'bg-destructive text-destructive-foreground';
    default: return 'bg-muted text-muted-foreground';
  }
};

export default TaskManagement;