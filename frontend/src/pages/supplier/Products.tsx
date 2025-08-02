import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Package, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  ImageIcon,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Eye
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  stock: number;
  status: "Actif" | "En rupture" | "En révision";
  image: string;
  description: string;
}

export default function SupplierProducts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  
  const [products] = useState<Product[]>([
    {
      id: "1",
      name: "Ciment Portland CPJ 55",
      category: "Matériaux de base",
      price: "2,500 CFA",
      stock: 150,
      status: "Actif",
      image: "/placeholder.svg",
      description: "Ciment de haute qualité pour constructions durables"
    },
    {
      id: "2",
      name: "Fer à béton Ø12mm",
      category: "Armatures",
      price: "450 CFA/kg",
      stock: 0,
      status: "En rupture",
      image: "/placeholder.svg", 
      description: "Barres d'armature haute résistance"
    },
    {
      id: "3",
      name: "Gravier concassé 5/15",
      category: "Granulats",
      price: "8,500 CFA/m³",
      stock: 25,
      status: "Actif",
      image: "/placeholder.svg",
      description: "Gravier calibré pour béton de qualité"
    },
    {
      id: "4",
      name: "Casques de sécurité Pro",
      category: "EPI",
      price: "1,200 CFA",
      stock: 75,
      status: "En révision",
      image: "/placeholder.svg",
      description: "Casques conformes aux normes de sécurité"
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Actif": return "bg-green-100 text-green-800";
      case "En rupture": return "bg-red-100 text-red-800";
      case "En révision": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Actif": return <CheckCircle className="h-4 w-4" />;
      case "En rupture": return <AlertCircle className="h-4 w-4" />;
      case "En révision": return <Eye className="h-4 w-4" />;
      default: return null;
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        <div className="container mx-auto px-4 py-8">
          {/* En-tête */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-gradient-to-r from-primary to-primary-light">
                <Package className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Mes Produits</h1>
                <p className="text-muted-foreground">Gérez votre catalogue de produits BTP</p>
              </div>
            </div>

            <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
              <DialogTrigger asChild>
                <Button className="bg-secondary hover:bg-secondary-dark">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un produit
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Ajouter un nouveau produit</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="productName">Nom du produit</Label>
                      <Input id="productName" placeholder="Ex: Ciment Portland..." />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Catégorie</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une catégorie" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="materiaux">Matériaux de base</SelectItem>
                          <SelectItem value="armatures">Armatures</SelectItem>
                          <SelectItem value="granulats">Granulats</SelectItem>
                          <SelectItem value="epi">EPI</SelectItem>
                          <SelectItem value="outils">Outils</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Prix unitaire</Label>
                      <Input id="price" placeholder="Ex: 2500 CFA" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stock">Stock disponible</Label>
                      <Input id="stock" type="number" placeholder="Ex: 150" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" placeholder="Description détaillée du produit..." />
                  </div>

                  <div className="space-y-2">
                    <Label>Images du produit</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                      <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-sm text-muted-foreground">
                        Cliquez pour ajouter des images ou glissez-déposez
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end gap-4">
                    <Button variant="outline" onClick={() => setIsAddProductOpen(false)}>
                      Annuler
                    </Button>
                    <Button className="bg-secondary hover:bg-secondary-dark">
                      Ajouter le produit
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Statistiques rapides */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="shadow-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total produits</p>
                    <p className="text-2xl font-bold text-foreground">{products.length}</p>
                  </div>
                  <Package className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Produits actifs</p>
                    <p className="text-2xl font-bold text-success">
                      {products.filter(p => p.status === "Actif").length}
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
                    <p className="text-sm text-muted-foreground">En rupture</p>
                    <p className="text-2xl font-bold text-destructive">
                      {products.filter(p => p.status === "En rupture").length}
                    </p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-destructive" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Valeur stock</p>
                    <p className="text-2xl font-bold text-foreground">1.2M CFA</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-secondary" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Barre de recherche et filtres */}
          <Card className="shadow-card mb-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher un produit..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filtrer par statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="active">Actif</SelectItem>
                    <SelectItem value="rupture">En rupture</SelectItem>
                    <SelectItem value="revision">En révision</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Liste des produits */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="shadow-card hover:shadow-construction transition-all duration-300">
                <CardContent className="p-0">
                  <div className="aspect-square bg-muted rounded-t-lg flex items-center justify-center">
                    <ImageIcon className="h-16 w-16 text-muted-foreground" />
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-foreground">{product.name}</h3>
                      <Badge className={getStatusColor(product.status)}>
                        {getStatusIcon(product.status)}
                        <span className="ml-1">{product.status}</span>
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
                    <p className="text-xs text-muted-foreground mb-3">{product.description}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-bold text-secondary">{product.price}</span>
                      <span className="text-sm text-muted-foreground">
                        Stock: {product.stock}
                      </span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="h-4 w-4 mr-1" />
                        Modifier
                      </Button>
                      <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <Card className="shadow-card">
              <CardContent className="p-8 text-center">
                <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Aucun produit trouvé</h3>
                <p className="text-muted-foreground">Essayez de modifier vos critères de recherche.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}