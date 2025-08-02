import { useState, useEffect } from 'react';
import api from '@/utils/api';
import { Task } from '@/types';
import { Plus, Search, Filter, Camera, User, Calendar, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const Tasks = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data } = await api.get<{ tasks: Task[] }>('/contractor/tasks');
        setTasks(data.tasks);
      } catch {
        setError('Impossible de récupérer les tâches');
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);
  const [searchTerm, setSearchTerm] = useState('');

  const statusLabel = (s: Task['status']) => {
    switch (s) {
      case 'todo': return 'En attente';
      case 'in_progress': return 'En cours';
      case 'done': return 'Terminé';
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || 
      (activeTab === 'active' && task.status === 'in_progress') ||
      (activeTab === 'pending' && task.status === 'todo') ||
      (activeTab === 'completed' && task.status === 'done');
    return matchesSearch && matchesTab;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'En cours': return 'bg-secondary text-secondary-foreground';
      case 'Terminé': return 'bg-success text-success-foreground';
      case 'En attente': return 'bg-warning text-warning-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Haute': return 'text-destructive';
      case 'Moyenne': return 'text-warning';
      case 'Basse': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-destructive">{error}</div>;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestion des Tâches</h1>
          <p className="text-muted-foreground">Organisez et suivez l'avancement de vos tâches de chantier</p>
        </div>
        <Button asChild variant="construction">
          <Link to="/tasks/new">
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle Tâche
          </Link>
        </Button>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-8 w-8 text-success" />
              <div>
                <p className="text-2xl font-bold">18</p>
                <p className="text-sm text-muted-foreground">Terminées</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-secondary" />
              <div>
                <p className="text-2xl font-bold">6</p>
                <p className="text-sm text-muted-foreground">En cours</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-8 w-8 text-warning" />
              <div>
                <p className="text-2xl font-bold">2</p>
                <p className="text-sm text-muted-foreground">En retard</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <User className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-muted-foreground">Assignées</p>
              </div>
            </div>
          </CardContent>
        </Card>
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
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filtres
        </Button>
      </div>

      {/* Onglets */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">Toutes</TabsTrigger>
          <TabsTrigger value="active">En cours</TabsTrigger>
          <TabsTrigger value="pending">En attente</TabsTrigger>
          <TabsTrigger value="completed">Terminées</TabsTrigger>
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
                      <div className="space-y-2">
                        <CardTitle className="text-lg">{task.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">{task.description}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(statusLabel(task.status))}>
                          {statusLabel(task.status)}
                        </Badge>
                        <span className={`text-sm font-medium ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Informations de base */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{task.assignee}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString('fr-FR') : '—'}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Camera className="h-4 w-4 text-muted-foreground" />
                        <span>{task.photos ? task.photos.length : 0} photos</span>
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

                    {/* Checklist */}
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Checklist:</h4>
                      <div className="space-y-2">
                        {task.checklist.map((item) => (
                          <div key={item.id} className="flex items-center space-x-2">
                            <Checkbox 
                              checked={item.completed} 
                              className="data-[state=checked]:bg-success data-[state=checked]:border-success"
                            />
                            <span className={`text-sm ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                              {item.task}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-between pt-2">
                      <Button variant="outline" size="sm">
                        <Camera className="h-4 w-4 mr-2" />
                        Ajouter photo
                      </Button>
                      <div className="space-x-2">
                        <Button variant="outline" size="sm">
                          Modifier
                        </Button>
                        <Button size="sm" className="bg-success hover:bg-success/90 text-success-foreground">
                          Marquer terminé
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      </div>
      
      <Footer />
    </div>
  );
};

export default Tasks;