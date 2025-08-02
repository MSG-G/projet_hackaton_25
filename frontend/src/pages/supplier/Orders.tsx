import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { 
  ShoppingCart, 
  Search, 
  MessageCircle, 
  CheckCircle, 
  Clock, 
  Package,
  Truck,
  Phone,
  Mail,
  MapPin,
  Calendar,
  AlertTriangle,
  X,
  Check,
  Edit3,
  Eye,
  Filter,
  Download,
  Send
} from "lucide-react";

interface Order {
  id: string;
  clientName: string;
  clientContact: string;
  products: { name: string; quantity: string; price: string }[];
  totalAmount: string;
  status: "Nouvelle" | "En cours" | "Livrée" | "Annulée";
  orderDate: string;
  deliveryDate?: string;
  location: string;
  notes?: string;
}

export default function SupplierOrders() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderAction, setOrderAction] = useState<{type: 'accept' | 'reject' | 'modify' | null, orderId: string | null}>({type: null, orderId: null});
  const [deliveryDate, setDeliveryDate] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [modificationNotes, setModificationNotes] = useState("");

  const [orders, setOrders] = useState<Order[]>([
    {
      id: "CMD-2024-001",
      clientName: "Chantier Résidence Azure",
      clientContact: "+225 07 12 34 56 78",
      products: [
        { name: "Ciment Portland CPJ 55", quantity: "50 sacs", price: "125,000 CFA" }
      ],
      totalAmount: "125,000 CFA",
      status: "Nouvelle",
      orderDate: "2024-01-15",
      location: "Cocody, Abidjan",
      notes: "Livraison urgente demandée pour vendredi"
    },
    {
      id: "CMD-2024-002", 
      clientName: "Projet Villa Moderne",
      clientContact: "+225 05 98 76 54 32",
      products: [
        { name: "Fer à béton Ø12mm", quantity: "2 tonnes", price: "450,000 CFA" }
      ],
      totalAmount: "450,000 CFA",
      status: "En cours",
      orderDate: "2024-01-14",
      deliveryDate: "2024-01-18",
      location: "Plateau, Abidjan"
    },
    {
      id: "CMD-2024-003",
      clientName: "Chantier Centre Commercial",
      clientContact: "+225 01 23 45 67 89",
      products: [
        { name: "Gravier concassé 5/15", quantity: "10m³", price: "85,000 CFA" }
      ],
      totalAmount: "85,000 CFA",
      status: "Livrée",
      orderDate: "2024-01-12",
      deliveryDate: "2024-01-16",
      location: "Yopougon, Abidjan"
    },
    {
      id: "CMD-2024-004",
      clientName: "Construction Résidence Bella",
      clientContact: "+225 07 11 22 33 44",
      products: [
        { name: "Casques de sécurité Pro", quantity: "20 unités", price: "24,000 CFA" },
        { name: "Ciment Portland CPJ 55", quantity: "30 sacs", price: "75,000 CFA" }
      ],
      totalAmount: "99,000 CFA",
      status: "En cours",
      orderDate: "2024-01-13",
      deliveryDate: "2024-01-19",
      location: "Marcory, Abidjan"
    }
  ]);

  // Actions de validation
  const handleAcceptOrder = async (orderId: string) => {
    if (!deliveryDate) {
      toast.error("Veuillez définir une date de livraison");
      return;
    }
    
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status: "En cours" as const, deliveryDate }
        : order
    ));
    
    toast.success("Commande acceptée avec succès");
    setOrderAction({type: null, orderId: null});
    setDeliveryDate("");
  };

  const handleRejectOrder = async (orderId: string) => {
    if (!rejectionReason.trim()) {
      toast.error("Veuillez indiquer la raison du refus");
      return;
    }
    
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status: "Annulée" as const, notes: rejectionReason }
        : order
    ));
    
    toast.success("Commande refusée");
    setOrderAction({type: null, orderId: null});
    setRejectionReason("");
  };

  const handleModifyOrder = async (orderId: string) => {
    if (!modificationNotes.trim()) {
      toast.error("Veuillez préciser les modifications");
      return;
    }
    
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, notes: `Modifications demandées: ${modificationNotes}` }
        : order
    ));
    
    toast.success("Demande de modification envoyée au client");
    setOrderAction({type: null, orderId: null});
    setModificationNotes("");
  };

  const handleConfirmDelivery = async (orderId: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status: "Livrée" as const }
        : order
    ));
    
    toast.success("Livraison confirmée");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Nouvelle": return "bg-blue-100 text-blue-800";
      case "En cours": return "bg-yellow-100 text-yellow-800";
      case "Livrée": return "bg-green-100 text-green-800";
      case "Annulée": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Nouvelle": return <Package className="h-4 w-4" />;
      case "En cours": return <Clock className="h-4 w-4" />;
      case "Livrée": return <CheckCircle className="h-4 w-4" />;
      case "Annulée": return <CheckCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  const filterOrdersByStatus = (status?: string) => {
    let filtered = orders;
    if (status && status !== "all") {
      filtered = filtered.filter(order => order.status.toLowerCase() === status);
    }
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.clientName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return filtered;
  };

  const OrderCard = ({ order }: { order: Order }) => (
    <Card className="shadow-card hover:shadow-construction transition-all duration-300 border-l-4 border-l-primary/50">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-foreground">{order.id}</h3>
            <p className="text-sm text-muted-foreground">{order.clientName}</p>
            {order.notes?.includes("urgente") && (
              <Badge variant="destructive" className="mt-1">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Urgent
              </Badge>
            )}
          </div>
          <Badge className={getStatusColor(order.status)}>
            {getStatusIcon(order.status)}
            <span className="ml-1">{order.status}</span>
          </Badge>
        </div>

        <div className="space-y-2 mb-4">
          {order.products.map((product, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span className="text-muted-foreground truncate">{product.name}</span>
              <span className="font-medium">{product.quantity}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="truncate">{order.location}</span>
          </div>
          <span className="text-lg font-bold text-secondary">{order.totalAmount}</span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{order.orderDate}</span>
          </div>
          {order.deliveryDate && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Truck className="h-4 w-4" />
              <span>{order.deliveryDate}</span>
            </div>
          )}
        </div>

        {/* Actions rapides selon le statut */}
        {order.status === "Nouvelle" && (
          <div className="space-y-2 mb-4">
            <div className="flex gap-2">
              <Button 
                size="sm" 
                className="flex-1 bg-success hover:bg-success/90"
                onClick={() => setOrderAction({type: 'accept', orderId: order.id})}
              >
                <Check className="h-4 w-4 mr-1" />
                Accepter
              </Button>
              <Button 
                size="sm" 
                variant="destructive" 
                className="flex-1"
                onClick={() => setOrderAction({type: 'reject', orderId: order.id})}
              >
                <X className="h-4 w-4 mr-1" />
                Refuser
              </Button>
            </div>
            <Button 
              size="sm" 
              variant="outline" 
              className="w-full"
              onClick={() => setOrderAction({type: 'modify', orderId: order.id})}
            >
              <Edit3 className="h-4 w-4 mr-1" />
              Demander modification
            </Button>
          </div>
        )}

        {order.status === "En cours" && (
          <div className="mb-4">
            <Button 
              size="sm" 
              className="w-full bg-success hover:bg-success/90"
              onClick={() => handleConfirmDelivery(order.id)}
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Confirmer livraison
            </Button>
          </div>
        )}

        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex-1" onClick={() => setSelectedOrder(order)}>
                <Eye className="h-4 w-4 mr-1" />
                Détails
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Commande {order.id}
                </DialogTitle>
              </DialogHeader>
              {selectedOrder && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Informations client</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-2">
                          <strong>Nom:</strong> {selectedOrder.clientName}
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          <strong>Contact:</strong> {selectedOrder.clientContact}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <strong>Localisation:</strong> {selectedOrder.location}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Informations commande</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <strong>Date commande:</strong> {selectedOrder.orderDate}
                        </div>
                        {selectedOrder.deliveryDate && (
                          <div className="flex items-center gap-2">
                            <Truck className="h-4 w-4" />
                            <strong>Date livraison:</strong> {selectedOrder.deliveryDate}
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <strong>Statut:</strong>
                          <Badge className={getStatusColor(selectedOrder.status)}>
                            {getStatusIcon(selectedOrder.status)}
                            <span className="ml-1">{selectedOrder.status}</span>
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Produits commandés</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedOrder.products.map((product, index) => (
                          <div key={index} className="flex justify-between items-center p-4 bg-muted rounded-lg">
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-muted-foreground">Quantité: {product.quantity}</p>
                            </div>
                            <span className="font-bold text-secondary">{product.price}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between items-center mt-4 p-4 bg-primary/10 rounded-lg border">
                        <span className="text-lg font-semibold">Total</span>
                        <span className="text-2xl font-bold text-secondary">{selectedOrder.totalAmount}</span>
                      </div>
                    </CardContent>
                  </Card>

                  {selectedOrder.notes && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Notes</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground bg-muted p-4 rounded-lg">
                          {selectedOrder.notes}
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  <div className="flex flex-col md:flex-row gap-3">
                    <Button variant="outline" className="flex-1">
                      <Phone className="h-4 w-4 mr-2" />
                      Appeler le client
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Envoyer un message
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger facture
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
          
          <Button variant="outline" size="sm">
            <MessageCircle className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        <div className="container mx-auto px-4 py-8">
          {/* En-tête */}
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 rounded-lg bg-gradient-to-r from-primary to-primary-light">
              <ShoppingCart className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Commandes</h1>
              <p className="text-muted-foreground">Gérez les commandes de vos clients</p>
            </div>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="shadow-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Nouvelles</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {orders.filter(o => o.status === "Nouvelle").length}
                    </p>
                  </div>
                  <Package className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">En cours</p>
                    <p className="text-2xl font-bold text-warning">
                      {orders.filter(o => o.status === "En cours").length}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-warning" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Livrées</p>
                    <p className="text-2xl font-bold text-success">
                      {orders.filter(o => o.status === "Livrée").length}
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-success" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total CA</p>
                    <p className="text-2xl font-bold text-secondary">759K CFA</p>
                  </div>
                  <Package className="h-8 w-8 text-secondary" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Barre de recherche */}
          <Card className="shadow-card mb-6">
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par numéro de commande ou nom de client..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Onglets par statut */}
          <Tabs defaultValue="all">
            <TabsList className="grid w-full grid-cols-5 mb-6">
              <TabsTrigger value="all">Toutes</TabsTrigger>
              <TabsTrigger value="nouvelle">Nouvelles</TabsTrigger>
              <TabsTrigger value="en cours">En cours</TabsTrigger>
              <TabsTrigger value="livrée">Livrées</TabsTrigger>
              <TabsTrigger value="annulée">Annulées</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filterOrdersByStatus().map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="nouvelle">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filterOrdersByStatus("nouvelle").map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="en cours">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filterOrdersByStatus("en cours").map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="livrée">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filterOrdersByStatus("livrée").map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="annulée">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filterOrdersByStatus("annulée").map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Dialogs de validation */}
          {/* Dialog Accepter commande */}
          <Dialog open={orderAction.type === 'accept'} onOpenChange={() => setOrderAction({type: null, orderId: null})}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-success" />
                  Accepter la commande
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Confirmez-vous l'acceptation de cette commande ? Veuillez définir une date de livraison.
                </p>
                <div className="space-y-2">
                  <Label htmlFor="deliveryDate">Date de livraison prévue</Label>
                  <Input
                    id="deliveryDate"
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setOrderAction({type: null, orderId: null})}
                  >
                    Annuler
                  </Button>
                  <Button 
                    className="flex-1 bg-success hover:bg-success/90"
                    onClick={() => orderAction.orderId && handleAcceptOrder(orderAction.orderId)}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Accepter
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Dialog Refuser commande */}
          <Dialog open={orderAction.type === 'reject'} onOpenChange={() => setOrderAction({type: null, orderId: null})}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <X className="h-5 w-5 text-destructive" />
                  Refuser la commande
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Pourquoi refusez-vous cette commande ? Cette raison sera communiquée au client.
                </p>
                <div className="space-y-2">
                  <Label htmlFor="rejectionReason">Raison du refus</Label>
                  <Select onValueChange={setRejectionReason}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez une raison" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stock">Produit en rupture de stock</SelectItem>
                      <SelectItem value="location">Zone de livraison non couverte</SelectItem>
                      <SelectItem value="quantity">Quantité trop importante</SelectItem>
                      <SelectItem value="delay">Délai de livraison impossible</SelectItem>
                      <SelectItem value="technical">Problème technique</SelectItem>
                      <SelectItem value="other">Autre raison</SelectItem>
                    </SelectContent>
                  </Select>
                  {rejectionReason === 'other' && (
                    <Textarea
                      placeholder="Précisez la raison..."
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                    />
                  )}
                </div>
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setOrderAction({type: null, orderId: null})}
                  >
                    Annuler
                  </Button>
                  <Button 
                    variant="destructive" 
                    className="flex-1"
                    onClick={() => orderAction.orderId && handleRejectOrder(orderAction.orderId)}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Refuser
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Dialog Modifier commande */}
          <Dialog open={orderAction.type === 'modify'} onOpenChange={() => setOrderAction({type: null, orderId: null})}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Edit3 className="h-5 w-5 text-warning" />
                  Demander une modification
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Précisez les modifications nécessaires. Votre demande sera envoyée au client.
                </p>
                <div className="space-y-2">
                  <Label htmlFor="modificationNotes">Modifications demandées</Label>
                  <Textarea
                    id="modificationNotes"
                    placeholder="Décrivez les modifications nécessaires (quantité, produits, délais...)"
                    value={modificationNotes}
                    onChange={(e) => setModificationNotes(e.target.value)}
                    rows={4}
                  />
                </div>
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setOrderAction({type: null, orderId: null})}
                  >
                    Annuler
                  </Button>
                  <Button 
                    className="flex-1 bg-warning hover:bg-warning/90"
                    onClick={() => orderAction.orderId && handleModifyOrder(orderAction.orderId)}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Envoyer demande
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </main>

      <Footer />
    </div>
  );
}