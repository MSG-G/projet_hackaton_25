import { useState } from "react";
import { Search, Filter, Grid, List, ShoppingCart, Heart, Star, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import AdvancedFilters from "@/components/marketplace/AdvancedFilters";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const categories = [
  "Tous", "Ciment", "Fer à béton", "Outillage", "EPI", "Électricité", "Plomberie", "Carrelage"
];

const products = [
  {
    id: 1,
    name: "Ciment Portland CEM II 42.5",
    price: "8 500",
    unit: "sac 50kg",
    image: "🏗️",
    category: "Ciment",
    supplier: "CIMAF",
    rating: 4.8,
    reviews: 156,
    inStock: true,
    discount: 10
  },
  {
    id: 2,
    name: "Fer à béton HA 12mm",
    price: "650 000",
    unit: "tonne",
    image: "🔩",
    category: "Fer à béton",
    supplier: "SIDERCEM",
    rating: 4.9,
    reviews: 89,
    inStock: true,
    discount: null
  },
  {
    id: 3,
    name: "Casque de sécurité blanc",
    price: "15 000",
    unit: "pièce",
    image: "⛑️",
    category: "EPI",
    supplier: "SAFETY FIRST",
    rating: 4.7,
    reviews: 234,
    inStock: true,
    discount: 15
  },
  {
    id: 4,
    name: "Perceuse visseuse 18V",
    price: "85 000",
    unit: "pièce",
    image: "🔧",
    category: "Outillage",
    supplier: "BOSCH",
    rating: 4.9,
    reviews: 67,
    inStock: false,
    discount: null
  },
  {
    id: 5,
    name: "Carrelage 60x60 blanc",
    price: "25 000",
    unit: "m²",
    image: "🔲",
    category: "Carrelage",
    supplier: "CERAMICA",
    rating: 4.6,
    reviews: 45,
    inStock: true,
    discount: 20
  },
  {
    id: 6,
    name: "Tuyau PVC Ø 110mm",
    price: "12 000",
    unit: "mètre",
    image: "🔌",
    category: "Plomberie",
    supplier: "WAVIN",
    rating: 4.8,
    reviews: 123,
    inStock: true,
    discount: null
  }
];

const Marketplace = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("popularity");
  const [advancedFilters, setAdvancedFilters] = useState<any>({});
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Tous" || product.category === selectedCategory;
    
    // Apply advanced filters
    let passesAdvancedFilters = true;
    
    if (advancedFilters.priceRange) {
      const price = parseInt(product.price.replace(/\s/g, ''));
      passesAdvancedFilters = passesAdvancedFilters && 
        price >= advancedFilters.priceRange[0] && 
        price <= advancedFilters.priceRange[1];
    }
    
    if (advancedFilters.suppliers?.length > 0) {
      passesAdvancedFilters = passesAdvancedFilters && 
        advancedFilters.suppliers.includes(product.supplier);
    }
    
    if (advancedFilters.inStockOnly) {
      passesAdvancedFilters = passesAdvancedFilters && product.inStock;
    }
    
    if (advancedFilters.hasDiscount) {
      passesAdvancedFilters = passesAdvancedFilters && !!product.discount;
    }
    
    if (advancedFilters.minRating) {
      passesAdvancedFilters = passesAdvancedFilters && 
        product.rating >= advancedFilters.minRating;
    }
    
    return matchesSearch && matchesCategory && passesAdvancedFilters;
  });

  const ProductComparisonDialog = ({ product }: { product: any }) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full mt-2">
          <BarChart3 className="h-4 w-4 mr-2" />
          Comparer
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Comparaison de produit</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-6xl mb-2">{product.image}</div>
              <h3 className="font-semibold">{product.name}</h3>
              <p className="text-sm text-muted-foreground">Par {product.supplier}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Prix:</span>
                <span className="font-medium">{product.price} FCFA</span>
              </div>
              <div className="flex justify-between">
                <span>Note:</span>
                <span className="font-medium">{product.rating} ⭐</span>
              </div>
              <div className="flex justify-between">
                <span>Stock:</span>
                <span className={product.inStock ? "text-success" : "text-destructive"}>
                  {product.inStock ? "Disponible" : "Rupture"}
                </span>
              </div>
              {product.discount && (
                <div className="flex justify-between">
                  <span>Remise:</span>
                  <span className="text-secondary font-medium">-{product.discount}%</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold">Produits similaires</h4>
            <div className="space-y-2">
              {products
                .filter(p => p.category === product.category && p.id !== product.id)
                .slice(0, 3)
                .map(similarProduct => (
                  <div key={similarProduct.id} className="p-2 border rounded flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">{similarProduct.name}</p>
                      <p className="text-xs text-muted-foreground">{similarProduct.supplier}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{similarProduct.price} FCFA</p>
                      <p className="text-xs">{similarProduct.rating} ⭐</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Page Header */}
      <div className="bg-gradient-primary">
        <div className="container py-16">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-4">Marketplace BTP</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Découvrez notre sélection de matériaux et équipements de qualité, 
              livrés directement sur vos chantiers
            </p>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher des matériaux, outils, équipements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popularity">Popularité</SelectItem>
                <SelectItem value="price-asc">Prix croissant</SelectItem>
                <SelectItem value="price-desc">Prix décroissant</SelectItem>
                <SelectItem value="rating">Meilleures notes</SelectItem>
                <SelectItem value="newest">Plus récents</SelectItem>
              </SelectContent>
            </Select>

            {/* View Mode */}
            <div className="flex border rounded-lg">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-r-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Categories */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
              {categories.map((category) => (
                <TabsTrigger key={category} value={category} className="text-xs">
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            {filteredProducts.length} produits trouvés
          </p>
          <AdvancedFilters onFiltersChange={setAdvancedFilters} />
        </div>

        {/* Products Grid */}
        <div className={`grid gap-6 ${
          viewMode === "grid" 
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
            : "grid-cols-1"
        }`}>
          {filteredProducts.map((product) => (
            <Card key={product.id} className="group hover:shadow-construction transition-all duration-300 hover:scale-105">
              <CardContent className="p-4">
                {/* Product Image */}
                <div className="relative mb-4">
                  <div className="aspect-square bg-muted rounded-lg flex items-center justify-center text-6xl">
                    {product.image}
                  </div>
                  {product.discount && (
                    <Badge className="absolute -top-2 -right-2 bg-secondary text-secondary-foreground">
                      -{product.discount}%
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 left-2 bg-background/80 hover:bg-background"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>

                {/* Product Info */}
                <div className="space-y-2">
                  <Badge variant="outline" className="text-xs">
                    {product.category}
                  </Badge>
                  <h3 className="font-semibold text-sm leading-tight">
                    {product.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Par {product.supplier}
                  </p>
                  
                  {/* Rating */}
                  <div className="flex items-center space-x-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-3 w-3 ${
                            i < Math.floor(product.rating) 
                              ? 'fill-secondary text-secondary' 
                              : 'text-muted-foreground'
                          }`} 
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {product.rating} ({product.reviews})
                    </span>
                  </div>

                  {/* Price */}
                  <div className="space-y-1">
                    <div className="text-lg font-bold text-primary">
                      {product.price} FCFA
                    </div>
                    <div className="text-xs text-muted-foreground">
                      par {product.unit}
                    </div>
                  </div>

                  {/* Stock Status */}
                  <div className="flex items-center space-x-2">
                    <div className={`h-2 w-2 rounded-full ${
                      product.inStock ? 'bg-success' : 'bg-destructive'
                    }`} />
                    <span className={`text-xs ${
                      product.inStock ? 'text-success' : 'text-destructive'
                    }`}>
                      {product.inStock ? 'En stock' : 'Rupture de stock'}
                    </span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-4 pt-0 space-y-2">
                <Button 
                  className="w-full" 
                  variant="construction"
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Ajouter au panier
                </Button>
                <ProductComparisonDialog product={product} />
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Charger plus de produits
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Marketplace;