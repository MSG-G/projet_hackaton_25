import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  Calendar, 
  Package, 
  Camera,
  CheckCircle,
  XCircle
} from "lucide-react";

export function AIAnalytics() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-gradient-to-r from-secondary to-secondary-light">
          <Brain className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Intelligence Artificielle</h2>
          <p className="text-muted-foreground">Analyse prédictive et recommandations intelligentes</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Prédiction matériaux */}
        <Card className="border-secondary/20 shadow-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Package className="h-5 w-5 text-secondary" />
                Prédiction Matériaux
              </CardTitle>
              <Badge variant="secondary" className="text-xs">
                <TrendingUp className="h-3 w-3 mr-1" />
                IA Active
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Ciment - Chantier A</span>
                <Badge variant="outline" className="text-xs">3 jours</Badge>
              </div>
              <Progress value={75} className="h-2" />
              <p className="text-sm text-foreground">50 sacs nécessaires selon le planning</p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Fer à béton - Chantier B</span>
                <Badge variant="outline" className="text-xs">1 semaine</Badge>
              </div>
              <Progress value={45} className="h-2" />
              <p className="text-sm text-foreground">2 tonnes prévues pour les fondations</p>
            </div>

            <Button variant="outline" size="sm" className="w-full">
              Voir toutes les prédictions
            </Button>
          </CardContent>
        </Card>

        {/* Détection de risques */}
        <Card className="border-warning/20 shadow-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                Détection de Risques
              </CardTitle>
              <Badge variant="destructive" className="text-xs">
                2 Alertes
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-destructive" />
                <span className="text-sm text-foreground">EPI manquants - Zone 3</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-warning" />
                <span className="text-sm text-foreground">Balisage insuffisant</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span className="text-sm text-muted-foreground">Matériel sécurisé</span>
              </div>
            </div>

            <div className="bg-muted/50 p-3 rounded-lg">
              <p className="text-xs text-muted-foreground mb-2">Score de sécurité global</p>
              <div className="flex items-center gap-2">
                <Progress value={85} className="h-2 flex-1" />
                <span className="text-sm font-medium">85%</span>
              </div>
            </div>

            <Button variant="outline" size="sm" className="w-full">
              <Camera className="h-4 w-4 mr-2" />
              Analyser avec photo
            </Button>
          </CardContent>
        </Card>

        {/* Assistant Planning */}
        <Card className="border-primary/20 shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Assistant Planning
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="bg-primary/10 p-3 rounded-lg">
                <p className="text-sm font-medium text-foreground mb-1">Recommandation IA</p>
                <p className="text-xs text-muted-foreground">
                  Décaler la livraison de béton de 2 jours pour optimiser les équipes
                </p>
              </div>
              
              <div className="bg-secondary/10 p-3 rounded-lg">
                <p className="text-sm font-medium text-foreground mb-1">Optimisation détectée</p>
                <p className="text-xs text-muted-foreground">
                  Regrouper les livraisons du lundi peut économiser 15% sur le transport
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                Accepter
              </Button>
              <Button variant="ghost" size="sm" className="flex-1">
                Reporter
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphique prédictif */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Progression Prédictive vs Réelle
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Progression Prévue</p>
                <div className="flex items-center gap-2">
                  <Progress value={60} className="h-3 flex-1" />
                  <span className="text-sm font-medium">60%</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Progression Réelle</p>
                <div className="flex items-center gap-2">
                  <Progress value={45} className="h-3 flex-1" />
                  <span className="text-sm font-medium">45%</span>
                </div>
              </div>
            </div>
            
            <div className="bg-warning/10 p-3 rounded-lg border border-warning/20">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-warning" />
                <span className="text-sm font-medium">Retard détecté</span>
              </div>
              <p className="text-xs text-muted-foreground">
                L'IA recommande d'ajouter 2 ouvriers ou de décaler la date de fin de 3 jours
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}