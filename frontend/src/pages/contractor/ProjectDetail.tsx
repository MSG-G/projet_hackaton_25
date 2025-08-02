import { useState } from "react";
import { useParams } from "react-router-dom";
import { 
  ArrowLeft, Calendar, Users, MapPin, DollarSign, 
  CheckCircle, Clock, AlertTriangle, Camera, 
  MessageSquare, Plus, FileText, TrendingUp 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import TaskManagement from "@/components/project/TaskManagement";
import NewOrderForm from "@/components/project/NewOrderForm";
import PhotoManager from "@/components/project/PhotoManager";

const project = {
  id: 1,
  name: "Centre Commercial Plateau",
  location: "Abidjan, Plateau",
  progress: 75,
  status: "En cours",
  priority: "Haute",
  budget: "2.5M",
  spent: "1.8M",
  team: 12,
  startDate: "2023-08-15",
  deadline: "2024-03-15",
  description: "Construction d'un centre commercial moderne de 3 étages avec parking souterrain, espaces commerciaux et zone de restauration.",
  tasks: { total: 24, completed: 18, pending: 6 },
  alerts: 2,
  image: "🏢"
};

const timeline = [
  {
    phase: "Fondations",
    status: "completed",
    startDate: "2023-08-15",
    endDate: "2023-10-30",
    progress: 100,
    tasks: 8
  },
  {
    phase: "Structure",
    status: "completed",
    startDate: "2023-11-01",
    endDate: "2024-01-15",
    progress: 100,
    tasks: 12
  },
  {
    phase: "Gros œuvre",
    status: "in-progress",
    startDate: "2024-01-16",
    endDate: "2024-02-28",
    progress: 65,
    tasks: 10
  },
  {
    phase: "Second œuvre",
    status: "pending",
    startDate: "2024-03-01",
    endDate: "2024-03-15",
    progress: 0,
    tasks: 8
  }
];

const tasks = [
  {
    id: 1,
    title: "Coulage dalle niveau 2",
    status: "completed",
    assignee: "Équipe A",
    dueDate: "2024-01-20",
    priority: "Haute"
  },
  {
    id: 2,
    title: "Installation électricité RDC",
    status: "in-progress",
    assignee: "Équipe B",
    dueDate: "2024-02-05",
    priority: "Moyenne"
  },
  {
    id: 3,
    title: "Pose carrelage hall principal",
    status: "pending",
    assignee: "Équipe C",
    dueDate: "2024-02-15",
    priority: "Basse"
  }
];

const orders = [
  {
    id: "CMD-001",
    supplier: "CIMAF",
    items: "Ciment Portland x50 sacs",
    amount: "425 000 FCFA",
    status: "Livré",
    date: "2024-01-15"
  },
  {
    id: "CMD-002",
    supplier: "SIDERCEM",
    items: "Fer à béton HA 12mm x2T",
    amount: "1 300 000 FCFA",
    status: "En transit",
    date: "2024-01-20"
  }
];

const comments = [
  {
    id: 1,
    author: "Jean Kouassi",
    role: "Chef de chantier",
    date: "2024-01-18",
    content: "Avancement satisfaisant sur la dalle du niveau 2. Quelques ajustements nécessaires sur l'électricité.",
    avatar: "JK"
  },
  {
    id: 2,
    author: "Marie Diallo",
    role: "Architecte",
    date: "2024-01-17",
    content: "Les plans ont été mis à jour suite aux modifications demandées. Merci de valider avant de continuer.",
    avatar: "MD"
  }
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed": return <CheckCircle className="h-4 w-4 text-success" />;
    case "in-progress": return <Clock className="h-4 w-4 text-warning" />;
    case "pending": return <Clock className="h-4 w-4 text-muted-foreground" />;
    default: return <Clock className="h-4 w-4 text-muted-foreground" />;
  }
};

const ProjectDetail = () => {
  const { id } = useParams();
  const [newComment, setNewComment] = useState("");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Project Header */}
      <div className="bg-gradient-primary">
        <div className="container py-8">
          <div className="flex items-center space-x-4 text-white mb-6">
            <Button asChild variant="ghost" className="text-white hover:bg-white/20">
              <Link to="/projects">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour aux chantiers
              </Link>
            </Button>
          </div>
          
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Project Info */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="text-4xl">{project.image}</div>
                <div>
                  <h1 className="text-3xl font-bold text-white">{project.name}</h1>
                  <div className="flex items-center text-white/80">
                    <MapPin className="h-4 w-4 mr-1" />
                    {project.location}
                  </div>
                </div>
              </div>
              
              <p className="text-white/90">{project.description}</p>
              
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-secondary text-secondary-foreground">
                  {project.status}
                </Badge>
                <Badge className="bg-destructive text-destructive-foreground">
                  Priorité {project.priority}
                </Badge>
                {project.alerts > 0 && (
                  <Badge variant="destructive" className="animate-pulse">
                    {project.alerts} alertes
                  </Badge>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="space-y-4">
              <Card className="bg-white/10 border-white/20 text-white">
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between">
                    <span>Avancement</span>
                    <span className="font-bold">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                  
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-white/70">Budget</p>
                      <p className="font-semibold">{project.budget} FCFA</p>
                    </div>
                    <div>
                      <p className="text-white/70">Dépensé</p>
                      <p className="font-semibold">{project.spent} FCFA</p>
                    </div>
                    <div>
                      <p className="text-white/70">Équipe</p>
                      <p className="font-semibold">{project.team} personnes</p>
                    </div>
                    <div>
                      <p className="text-white/70">Échéance</p>
                      <p className="font-semibold">
                        {new Date(project.deadline).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <Tabs defaultValue="timeline" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="tasks">Tâches</TabsTrigger>
            <TabsTrigger value="orders">Commandes</TabsTrigger>
            <TabsTrigger value="photos">Photos</TabsTrigger>
            <TabsTrigger value="comments">Commentaires</TabsTrigger>
          </TabsList>

          {/* Timeline */}
          <TabsContent value="timeline" className="space-y-6">
            <div className="grid gap-4">
              {timeline.map((phase, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(phase.status)}
                        <h3 className="text-lg font-semibold">{phase.phase}</h3>
                        <Badge variant="outline">{phase.tasks} tâches</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(phase.startDate).toLocaleDateString('fr-FR')} - 
                        {new Date(phase.endDate).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progression</span>
                        <span className="font-semibold">{phase.progress}%</span>
                      </div>
                      <Progress value={phase.progress} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Tasks */}
          <TabsContent value="tasks" className="space-y-6">
            <TaskManagement />
          </TabsContent>

          {/* Orders */}
          <TabsContent value="orders" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Commandes liées</h2>
              <NewOrderForm>
                <Button variant="construction">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle commande
                </Button>
              </NewOrderForm>
            </div>
            
            <div className="grid gap-4">
              {orders.map((order) => (
                <Card key={order.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold">{order.id}</h3>
                          <Badge variant="outline">{order.status}</Badge>
                        </div>
                        <p className="text-sm">{order.items}</p>
                        <p className="text-xs text-muted-foreground">
                          {order.supplier} • {new Date(order.date).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-lg">{order.amount}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Photos */}
          <TabsContent value="photos" className="space-y-6">
            <PhotoManager projectId={id} />
          </TabsContent>

          {/* Comments */}
          <TabsContent value="comments" className="space-y-6">
            <h2 className="text-2xl font-bold">Commentaires et notes</h2>
            
            {/* Add Comment */}
            <Card>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <Textarea
                    placeholder="Ajouter un commentaire ou une note..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <div className="flex justify-end">
                    <Button variant="construction">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Publier
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Comments List */}
            <div className="space-y-4">
              {comments.map((comment) => (
                <Card key={comment.id}>
                  <CardContent className="p-4">
                    <div className="flex space-x-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-primary text-white font-semibold">
                        {comment.avatar}
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold">{comment.author}</h3>
                          <Badge variant="outline">{comment.role}</Badge>
                          <span className="text-sm text-muted-foreground">
                            {new Date(comment.date).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                        <p className="text-sm">{comment.content}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default ProjectDetail;