import { useState } from 'react';
import { CheckSquare, ArrowLeft, Calendar, User, Flag, Building2, Save, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import { mockProjects } from '@/data/mockData';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

import api from '@/utils/api';
import { useEffect } from 'react';

interface ChecklistItem {
  text: string;
  done: boolean;
}

interface TaskFormData {
  title: string;
  description: string;
  projectId: string;
  assignee: string;
  priority: '' | 'high' | 'medium' | 'low';
  dueDate: string;
  checklist: ChecklistItem[];
}

// Payload type sent to backend when creating a task
interface CreateTaskPayload {
  projectId: string;
  title: string;
  description?: string | null;
  priority?: 'high' | 'medium' | 'low';
  dueDate?: string | null;
  progress?: number;

}


interface ProjectOption {
  id: string;
  name?: string;
  title?: string; // certains endpoints peuvent renvoyer title au lieu de name
  description?: string;
  location?: string;
  progress?: number;
}

interface ProjectsResponse {
  projects: ProjectOption[];
}

const NewTask = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<ProjectOption[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get<ProjectsResponse>('/contractor/projects');
        if (data.projects && data.projects.length > 0) {
          setProjects(data.projects);
          console.log('Projects chargés depuis API', data.projects);
        } else {
          console.warn('Liste de projets vide depuis l’API, utilisation des données mock');
          setProjects(mockProjects);
        }
      } catch (e) {
        console.error('Erreur chargement projets', e);
        // fallback offline/demo
        setProjects(mockProjects);
      }
    })();
  }, []);

  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    projectId: '',
    assignee: '',
    priority: '',
    dueDate: '',
    checklist: [{ text: '', done: false }]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Conversion des champs numériques / dates si besoin
      // calcul progression locale
      const progress = formData.checklist.length
        ? Math.round(
            (formData.checklist.filter((item) => item.done).length / formData.checklist.length) * 100
          )
        : 0;

      const payload: CreateTaskPayload = {
        projectId: formData.projectId,
        title: formData.title,
        description: formData.description || null,
        // Inclure priority seulement si choisi
        ...(formData.priority ? { priority: formData.priority } : {}),
        dueDate: formData.dueDate ? new Date(formData.dueDate + 'T00:00:00Z').toISOString() : null,
        progress
      };
      await api.post('/contractor/tasks', payload);
      navigate('/tasks');
    } catch (err) {
      console.error('Erreur création tâche', err);
      alert("Impossible de créer la tâche. Veuillez vérifier les champs et votre connexion.");
    }
  };

  const handleInputChange = <K extends keyof TaskFormData>(field: K, value: TaskFormData[K]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addChecklistItem = () => {
    setFormData(prev => ({
      ...prev,
      checklist: [...prev.checklist, { text: '', done: false }]
    }));
  };

  const updateChecklistItem = (index: number, value: string) => {
    const newChecklist = [...formData.checklist];
    newChecklist[index] = { ...newChecklist[index], text: value };
    setFormData(prev => ({
      ...prev,
      checklist: newChecklist
    }));
  };

  const toggleChecklistDone = (index: number, done: boolean) => {
    const newChecklist = [...formData.checklist];
    newChecklist[index] = { ...newChecklist[index], done };
    setFormData(prev => ({
      ...prev,
      checklist: newChecklist
    }));
  };

  const removeChecklistItem = (index: number) => {
    const newChecklist = formData.checklist.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      checklist: newChecklist
    }));
  };

  const checklistProgress = formData.checklist.length
    ? Math.round(
        (formData.checklist.filter((item) => item.done).length / formData.checklist.length) * 100
      )
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={() => navigate('/tasks')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Nouvelle Tâche</h1>
          <p className="text-muted-foreground">Créez une nouvelle tâche pour votre chantier</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informations principales */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckSquare className="h-5 w-5" />
                <span>Détails de la tâche</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titre de la tâche *</Label>
                <Input
                  id="title"
                  placeholder="Ex: Coulage des fondations"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description détaillée *</Label>
                <Textarea
                  id="description"
                  placeholder="Décrivez en détail cette tâche..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="project">Projet associé *</Label>
                  <Select value={formData.projectId} onValueChange={(value) => handleInputChange('projectId', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un projet" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name ?? project.title ?? 'Projet sans nom'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assignee">Responsable *</Label>
                  <Input
                    id="assignee"
                    placeholder="Ex: Kouadio Jean"
                    value={formData.assignee}
                    onChange={(e) => handleInputChange('assignee', e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Checklist */}
          <Card>
            <CardHeader>
              <CardTitle>Checklist des sous-tâches</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.checklist.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Checkbox checked={item.done} onCheckedChange={(checked) => toggleChecklistDone(index, !!checked)} />
                  <Input
                    placeholder="Description de la sous-tâche"
                    value={item.text}
                    onChange={(e) => updateChecklistItem(index, e.target.value)}
                  />
                  {formData.checklist.length > 1 && (
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      onClick={() => removeChecklistItem(index)}
                    >
                      ×
                    </Button>
                  )}
                </div>
              ))}

              {/* Progression checklist */}
              {formData.checklist.length > 0 && (
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progression</span>
                    <span>{checklistProgress}%</span>
                  </div>
                  <div className="w-full bg-accent rounded-full h-2">
                    <div
                      className="bg-secondary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${checklistProgress}%` }}
                    />
                  </div>
                </div>
              )}
              
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addChecklistItem}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter une sous-tâche
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Paramètres */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Planning</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="dueDate">Date d'échéance *</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => handleInputChange('dueDate', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priorité *</Label>
                <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value as TaskFormData['priority'])}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez la priorité" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">
                      <div className="flex items-center space-x-2">
                        <Flag className="h-4 w-4 text-destructive" />
                        <span>Haute</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="medium">
                      <div className="flex items-center space-x-2">
                        <Flag className="h-4 w-4 text-warning" />
                        <span>Moyenne</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="low">
                      <div className="flex items-center space-x-2">
                        <Flag className="h-4 w-4 text-success" />
                        <span>Basse</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Informations du projet */}
          {formData.projectId && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building2 className="h-5 w-5" />
                  <span>Projet associé</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  const project = projects.find(p => p.id === formData.projectId);
                  if (!project) return null;

                  const progress = project.progress ?? 0;

                  return (
                    <div className="space-y-2">
                      <p className="font-medium">{project.name ?? project.title ?? 'Projet sans nom'}</p>
                      <p className="text-sm text-muted-foreground">{project.description ?? '—'}</p>
                      <p className="text-sm text-muted-foreground">📍 {project.location ?? '—'}</p>
                      <div className="mt-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progression du projet</span>
                          <span>{progress}%</span>
                        </div>
                        <div className="w-full bg-accent rounded-full h-2">
                          <div
                            className="bg-secondary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <Button type="submit" className="w-full" variant="construction">
                <Save className="h-4 w-4 mr-2" />
                Créer la tâche
              </Button>
              <Button type="button" variant="outline" className="w-full" onClick={() => navigate('/tasks')}>
                Annuler
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>
      </div>
      
      <Footer />
    </div>
  );
};

export default NewTask;