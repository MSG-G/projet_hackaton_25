import { useState } from 'react';
import { CheckSquare, ArrowLeft, Calendar, User, Flag, Building2, Save, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { mockProjects } from '@/data/mockData';

const NewTask = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    projectId: '',
    assignee: '',
    priority: '',
    dueDate: '',
    checklist: ['']
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ici, on enverrait les données au backend
    console.log('Nouvelle tâche:', formData);
    
    // Simulation de création réussie
    navigate('/tasks');
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addChecklistItem = () => {
    setFormData(prev => ({
      ...prev,
      checklist: [...prev.checklist, '']
    }));
  };

  const updateChecklistItem = (index: number, value: string) => {
    const newChecklist = [...formData.checklist];
    newChecklist[index] = value;
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
                      {mockProjects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
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
                  <Checkbox />
                  <Input
                    placeholder="Description de la sous-tâche"
                    value={item}
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
                <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez la priorité" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Haute">
                      <div className="flex items-center space-x-2">
                        <Flag className="h-4 w-4 text-destructive" />
                        <span>Haute</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="Moyenne">
                      <div className="flex items-center space-x-2">
                        <Flag className="h-4 w-4 text-warning" />
                        <span>Moyenne</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="Basse">
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
                  const project = mockProjects.find(p => p.id === formData.projectId);
                  return project ? (
                    <div className="space-y-2">
                      <p className="font-medium">{project.name}</p>
                      <p className="text-sm text-muted-foreground">{project.description}</p>
                      <p className="text-sm text-muted-foreground">📍 {project.location}</p>
                      <div className="mt-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progression du projet</span>
                          <span>{project.progress}%</span>
                        </div>
                        <div className="w-full bg-accent rounded-full h-2">
                          <div 
                            className="bg-secondary h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ) : null;
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