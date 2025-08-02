import { useState } from 'react';
import { Truck, MapPin, Phone, Clock, Package, CheckCircle, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { mockDeliveries } from '@/data/mockData';

const Delivery = () => {
  const [activeTab, setActiveTab] = useState('active');

  const deliveries = mockDeliveries;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'En transit': return 'bg-secondary text-secondary-foreground';
      case 'Livré': return 'bg-success text-success-foreground';
      case 'Retardé': return 'bg-warning text-warning-foreground';
      case 'Annulé': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Page Header */}
      <div className="bg-gradient-primary">
        <div className="container py-16">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-4">Suivi des Livraisons</h1>
            <p className="text-xl text-white/90">
              Suivez vos commandes en temps réel jusqu'à votre chantier
            </p>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="active">Livraisons actives</TabsTrigger>
            <TabsTrigger value="history">Historique</TabsTrigger>
            <TabsTrigger value="map">Carte en temps réel</TabsTrigger>
          </TabsList>

          {/* Active Deliveries */}
          <TabsContent value="active" className="space-y-6">
            {deliveries.map((delivery) => (
              <Card key={delivery.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Truck className="h-6 w-6 text-primary" />
                      <div>
                        <CardTitle className="text-lg">{delivery.id}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Commande {delivery.orderId}
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(delivery.status)}>
                      {delivery.status}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Delivery Progress */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Progression de la livraison</span>
                      <span className="font-medium">En route vers destination</span>
                    </div>
                    <Progress value={65} className="h-3" />
                    <div className="grid grid-cols-3 text-xs text-muted-foreground">
                      <span>Départ</span>
                      <span className="text-center">En route</span>
                      <span className="text-right">Livraison</span>
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {/* Driver Info */}
                    <Card>
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-primary" />
                          <span className="font-medium">Chauffeur</span>
                        </div>
                        <div className="space-y-1">
                          <p className="font-semibold">{delivery.driverName}</p>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            <span>{delivery.driverPhone}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {delivery.vehicleInfo}
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Location Info */}
                    <Card>
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-primary" />
                          <span className="font-medium">Localisation</span>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div>
                            <p className="text-muted-foreground">Départ:</p>
                            <p className="font-medium">{delivery.startLocation.name}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Destination:</p>
                            <p className="font-medium">{delivery.destination.name}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* ETA Info */}
                    <Card>
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-primary" />
                          <span className="font-medium">Estimation</span>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div>
                            <p className="text-muted-foreground">Temps restant:</p>
                            <p className="font-semibold text-secondary">
                              {delivery.estimatedTime}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Distance:</p>
                            <p className="font-medium">{delivery.distance}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Tracking Timeline */}
                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center space-x-2">
                      <Package className="h-4 w-4" />
                      <span>Suivi détaillé</span>
                    </h4>
                    <div className="space-y-3">
                      {delivery.trackingPoints.map((point, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{point.status}</span>
                              <span className="text-sm text-muted-foreground">
                                {point.timestamp}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Position: {point.lat.toFixed(4)}, {point.lng.toFixed(4)}
                            </p>
                          </div>
                          {index === delivery.trackingPoints.length - 1 && (
                            <CheckCircle className="h-5 w-5 text-secondary" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-3">
                    <Button variant="outline" className="flex-1">
                      <Phone className="h-4 w-4 mr-2" />
                      Contacter le chauffeur
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <MapPin className="h-4 w-4 mr-2" />
                      Voir sur la carte
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Delivery History */}
          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Historique des livraisons</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      id: 'DEL-002',
                      orderId: 'CMD-2024-002',
                      status: 'Livré',
                      date: '2024-01-20',
                      items: 'Ciment Portland x30 sacs',
                      total: '255,000 FCFA'
                    },
                    {
                      id: 'DEL-003',
                      orderId: 'CMD-2024-003',
                      status: 'Livré',
                      date: '2024-01-18',
                      items: 'Fer à béton HA 10mm x1T',
                      total: '580,000 FCFA'
                    }
                  ].map((delivery) => (
                    <div key={delivery.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{delivery.id}</span>
                          <Badge className={getStatusColor(delivery.status)}>
                            {delivery.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {delivery.items}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(delivery.date).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{delivery.total}</p>
                        <Button variant="outline" size="sm">
                          Voir détails
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Real-time Map */}
          <TabsContent value="map" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>Carte des livraisons en temps réel</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative h-96 bg-accent rounded-lg overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10"></div>
                  
                  {/* Simulation de camions en mouvement */}
                  <div className="absolute top-1/3 left-1/4 bg-secondary text-secondary-foreground p-2 rounded-full">
                    <Truck className="h-4 w-4" />
                  </div>
                  
                  <div className="absolute bottom-1/3 right-1/4 bg-primary text-primary-foreground p-2 rounded-full">
                    <Truck className="h-4 w-4" />
                  </div>
                  
                  <div className="absolute bottom-4 left-4 bg-background/90 p-3 rounded text-sm">
                    <p className="font-medium mb-2">Légende:</p>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-secondary rounded-full"></div>
                        <span>Livraisons en cours</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-primary rounded-full"></div>
                        <span>Prochaines livraisons</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">Carte interactive en développement</p>
                    </div>
                  </div>
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

export default Delivery;