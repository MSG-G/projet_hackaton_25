import { useState } from 'react';
import { Building2, MapPin, Calendar, DollarSign, Save, ArrowLeft } from 'lucide-react';
import api from '@/utils/api';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const NewProject = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    coordinates: { lat: '', lng: '' },
    category: '',
    budget: '',
    startDate: '',
    deadline: '',
    priority: 'medium',
    teamSize: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        title: formData.title,
        description: formData.description || null,
        location: formData.location || null,
        budget: formData.budget ? Number(formData.budget) : null,
        startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
        deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null,
        priority: formData.priority,
        teamSize: formData.teamSize || null
      };
      await api.post('/contractor/projects', payload);
      navigate('/projects');
    } catch (err) {
      console.error(err);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={() => navigate('/projects')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Nouveau Chantier</h1>
          <p className="text-muted-foreground">Créez un nouveau projet de construction</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informations principales */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building2 className="h-5 w-5" />
                <span>Informations générales</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom du projet *</Label>
                  <Input
                    id="name"
                    placeholder="Ex: Centre Commercial Plateau"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    required
                  />
                </div>

              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Décrivez votre projet de construction..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="residentiel">Résidentiel</SelectItem>
                    <SelectItem value="industriel">Industriel</SelectItem>
                    <SelectItem value="infrastructure">Infrastructure</SelectItem>
                    <SelectItem value="renovation">Rénovation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Localisation</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="location">Adresse du chantier *</Label>
                <Input
                  id="location"
                  placeholder="Ex: Boulevard de la République, Plateau, Abidjan"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lat">Latitude</Label>
                  <Input
                    id="lat"
                    placeholder="Ex: 5.316667"
                    value={formData.coordinates.lat}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      coordinates: { ...prev.coordinates, lat: e.target.value }
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lng">Longitude</Label>
                  <Input
                    id="lng"
                    placeholder="Ex: -4.033333"
                    value={formData.coordinates.lng}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      coordinates: { ...prev.coordinates, lng: e.target.value }
                    }))}
                  />
                </div>
              </div>

              {/* Simulation de carte */}
              <div className="h-40 bg-accent rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Cliquez pour localiser sur la carte</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Paramètres du projet */}
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
                <Label htmlFor="startDate">Date de début *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deadline">Date de fin prévue *</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => handleInputChange('deadline', e.target.value)}
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
                    <SelectItem value="high">Haute</SelectItem>
                    <SelectItem value="medium">Moyenne</SelectItem>
                    <SelectItem value="low">Basse</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5" />
                <span>Budget et équipe</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="budget">Budget total (FCFA) *</Label>
                <Input
                  id="budget"
                  type="number"
                  placeholder="Ex: 2500000"
                  value={formData.budget}
                  onChange={(e) => handleInputChange('budget', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="teamSize">Taille de l'équipe</Label>
                <Input
                  id="teamSize"
                  type="number"
                  placeholder="Ex: 12"
                  value={formData.teamSize}
                  onChange={(e) => handleInputChange('teamSize', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <Button type="submit" className="w-full" variant="construction">
                <Save className="h-4 w-4 mr-2" />
                Créer le projet
              </Button>
              <Button type="button" variant="outline" className="w-full" onClick={() => navigate('/projects')}>
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

export default NewProject;